import * as XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import * as queryString from 'query-string';
import { Reactotron, ReactotronCore } from 'reactotron-core-client';
import MezzoClient from '@caribou-crew/mezzo-core-client';
import connectionManager from './utils/connection-manager';
import { IClientOptions } from '@caribou-crew/mezzo-interfaces';
import * as log from 'loglevel';

/**
 * Don't include the response bodies for images by default.
 */
const DEFAULT_CONTENT_TYPES_RX = /^(image)\/.*$/i;

export interface MezzoAndReactotronNetworkingOptions {
  ignoreContentTypes?: RegExp;
  ignoreUrls?: RegExp[];
}

const DEFAULTS: MezzoAndReactotronNetworkingOptions = {
  ignoreContentTypes: DEFAULT_CONTENT_TYPES_RX,
  ignoreUrls: [],
};

export default <ReactotronSubtype = ReactotronCore>(
    pluginConfig?: MezzoAndReactotronNetworkingOptions,
    mezzoClientOptions?: IClientOptions
  ) =>
  (reactotron: Reactotron<ReactotronSubtype> & ReactotronSubtype) => {
    const { ignoreContentTypes, ignoreUrls } = {
      ...DEFAULTS,
      ...pluginConfig,
    };

    const mezzoOptions: IClientOptions = {
      ...mezzoClientOptions,
      createSocket: (path: string) => connectionManager(path), // eslint-disable-line
    };

    const mezzoClient = MezzoClient(mezzoOptions);
    mezzoClient.connect();

    // a XHR call tracker
    let xhrCounter = 1000;

    // a temporary cache to hold requests so we can match up the data
    const requestCache = {};

    /**
     * Initializes a newly-created request, or re-initializes an existing one
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
     * @param method
     * @param url
     */
    function onOpen(method: string, url: string, xhr: any) {
      // log.debug(
      //   `[mezzo-intercept.onOpen] Network request open to ${method} ${url}`,
      //   { xhr }
      // );
      // bump the counter
      xhrCounter++;

      const guid = mezzoClient.captureApiRequest(method, url);
      // tag
      xhr._trackingName = xhrCounter;
      xhr._guid = guid;
    }

    /**
     * Fires when we talk to the server.
     *
     * @param {*} data - The data sent to the server.
     * @param {*} instance - The XMLHTTPRequest instance.
     */
    function onSend(data: Record<string, unknown>, xhr: any) {
      if (ignoreUrls.some((regex) => regex.test(xhr._url))) {
        log.info('~~~~~~~Skipping reactotron for URL pattern: ', xhr._url);
        xhr._skipReactotron = true;
        return;
      } else {
        log.info('~~~~Not skipping for url ', xhr._url);
      }

      //   // bump the counter
      //   xhrCounter++;

      //   // tag
      //   xhr._trackingName = xhrCounter;

      // cache
      requestCache[xhrCounter] = {
        data: data,
        xhr,
        stopTimer: reactotron.startTimer(),
      };
    }

    /**
     * Fires when the server gives us a response.
     *
     * @param {number} status - The HTTP response status.
     * @param {boolean} timeout - Did we timeout?
     * @param {*} response - The response data.
     * @param {string} url - The URL we talked to.
     * @param {*} type - Not sure.
     * @param {*} xhr - The XMLHttpRequest instance.
     */
    function onResponse(
      status: number,
      timeout: boolean,
      response: any,
      url: string,
      type: any,
      xhr: any
    ) {
      if (xhr._skipReactotron) {
        return;
      }

      let params = null;
      const queryParamIdx = url ? url.indexOf('?') : -1;

      if (queryParamIdx > -1) {
        params = queryString.parse(url.substr(queryParamIdx));
      }

      // fetch and clear the request data from the cache
      const rid = xhr._trackingName;
      const guid = xhr._guid;
      const cachedRequest = requestCache[rid] || {};
      requestCache[rid] = null;

      // assemble the request object
      const { data, stopTimer } = cachedRequest;
      const mezzoRequest = {
        url: url || cachedRequest.xhr._url,
        method: xhr._method || null,
        data,
        headers: xhr._headers || null,
        params,
      };

      // what type of content is this?
      const contentType =
        (xhr.responseHeaders && xhr.responseHeaders['content-type']) ||
        (xhr.responseHeaders && xhr.responseHeaders['Content-Type']) ||
        '';

      const sendResponse = (responseBodyText) => {
        let body = `~~~ skipped ~~~`;
        if (responseBodyText) {
          try {
            // all i am saying, is give JSON a chance...
            body = JSON.parse(responseBodyText);
          } catch (boom) {
            body = response;
          }
        }
        const mezzoResponse = {
          body,
          status,
          headers: xhr.responseHeaders || null,
        };

        const stopTime = stopTimer();

        log.debug('Captpuring response to reactotron and mezzo');
        reactotron.apiResponse(mezzoRequest, mezzoResponse, stopTime);
        mezzoClient.captureApiResponse(
          mezzoRequest,
          mezzoResponse,
          stopTime,
          guid
        );
      };

      // can we use the real response?
      const useRealResponse =
        (typeof response === 'string' || typeof response === 'object') &&
        !ignoreContentTypes.test(contentType || '');

      // prepare the right body to send
      if (useRealResponse) {
        if (type === 'blob' && typeof FileReader !== 'undefined' && response) {
          // Disable reason: FileReader should be in global scope since RN 0.54
          // eslint-disable-next-line no-undef
          const bReader = new FileReader();
          const brListener = () => {
            sendResponse(bReader.result);
            bReader.removeEventListener('loadend', brListener);
          };
          bReader.addEventListener('loadend', brListener);
          bReader.readAsText(response);
        } else {
          sendResponse(response);
        }
      } else {
        sendResponse('');
      }
    }

    // register our monkey-patch
    XHRInterceptor.setOpenCallback(onOpen);
    XHRInterceptor.setSendCallback(onSend);
    XHRInterceptor.setResponseCallback(onResponse);
    XHRInterceptor.enableInterception();

    // nothing of use to offer to the plugin
    return {};
  };
