import * as XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import * as queryString from 'query-string';
import { startTimer } from './utils/start-timer';
import { MezzoClient } from '@caribou-crew/mezzo-core-client';
import * as getHost from 'rn-host-detect';

import ConnectionManager from './utils/connection-manager';
import { ClientOptions } from '@caribou-crew/mezzo-interfaces';
import * as log from 'loglevel';

const getLogLevel = (desired?: string): log.LogLevelDesc => {
  const lower = desired?.toLowerCase();
  switch (lower) {
    case 'trace':
    case 'debug':
    case 'info':
    case 'warn':
    case 'error':
    case 'silent':
      return lower;
    default:
      return 'info';
  }
};
// log.setDefaultLevel(getLogLevel(process.env?.['LOG_LEVEL']));
log.setDefaultLevel('debug');

/**
 * Don't include the response bodies for images by default.
 */
const DEFAULT_CONTENT_TYPES_RX = /^(image)\/.*$/i;

const DEFAULTS: ClientOptions = {
  createSocket: (path: string) => new ConnectionManager(path), // eslint-disable-line
  host: getHost('localhost'),
  port: 8000,
  name: 'React Native App',
  environment: process.env.NODE_ENV || (__DEV__ ? 'development' : 'production'),
  client: {},
  getClientId: () => {
    return new Promise((resolve) => resolve('Some Temp id'));
  },
  proxyHack: true,
};

export const interceptReactNativeFetch = (pluginConfig: ClientOptions = {}) => {
  const options = {
    ...DEFAULTS,
    ...pluginConfig,
  };
  log.info(
    "[mezzo-intercept.intercept] Interceting React Native's fetch: ",
    options
  );
  const mezzoClient = new MezzoClient().initRecording(options);

  // a RegExp to suppess adding the body cuz it costs a lot to serialize
  const ignoreContentTypes =
    options.ignoreContentTypes || DEFAULT_CONTENT_TYPES_RX;

  // a XHR call tracker
  let mezzoCounter = 1000;

  // a temporary cache to hold requests so we can match up the data
  const requestCache = {};

  /**
   * Initializes a newly-created request, or re-initializes an existing one
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
   * @param method
   * @param url
   */
  function onOpen(method: string, url: string, xhr: any) {
    log.debug(
      `[mezzo-intercept.onOpen] Network request open to ${method} ${url}`,
      { xhr }
    );
    // bump the counter
    mezzoCounter++;

    const guid = mezzoClient.recordingClient.captureApiRequest(method, url);
    // tag
    xhr._trackingName = mezzoCounter;
    xhr._guid = guid;
  }

  /**
   * Send the network request to the server
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
   *
   * @param {*} data - The data sent to the server.
   * @param {*} instance - The XMLHTTPRequest instance.
   */
  function onSend(data: Record<string, unknown>, xhr: any) {
    log.debug('[mezzo-intercept.onSend] Network request sent', { data, xhr });
    if (options.ignoreUrls && options.ignoreUrls.test(xhr._url)) {
      xhr._skipMezzoCapture = true;
      return;
    }

    // bump the counter
    // mezzoCounter++;

    // // tag
    // xhr._trackingName = mezzoCounter;

    // mezzoClient.captureApiRequest(method, url);
    // cache
    requestCache[mezzoCounter] = {
      data: data,
      xhr,
      stopTimer: startTimer(),
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
    log.debug('[mezzo-intercept.onResponse] Network response: ', {
      status,
      timeout,
      response,
      url,
      type,
      xhr,
    });
    if (xhr._skipMezzoCapture) {
      log.debug(
        '[mezzo-intercept.onResponse] Skipping processing of response for ',
        url
      );
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
      let body: string | Record<string, unknown> = `~~~ skipped ~~~`;
      if (responseBodyText) {
        try {
          // all i am saying, is give JSON a chance...
          body = JSON.parse(responseBodyText);
        } catch (boom) {
          log.error(
            '[mezzo-intercept.onResponse] Failed to parse response json, using',
            boom
          );
          body = response;
        }
      }
      const mezzoResponse = {
        body,
        status,
        headers: xhr.responseHeaders || null,
      };

      mezzoClient.recordingClient.captureApiResponse(
        mezzoRequest,
        mezzoResponse,
        stopTimer(),
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
      log.debug('[mezzo-intercept.onResponse] Not sending real response');
      sendResponse('');
    }
  }

  // register our monkey-patch
  XHRInterceptor.setOpenCallback(onOpen);
  XHRInterceptor.setSendCallback(onSend);
  XHRInterceptor.setResponseCallback(onResponse);
  XHRInterceptor.enableInterception();
};
