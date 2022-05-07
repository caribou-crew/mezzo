import * as XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import * as queryString from 'query-string';
import { startTimer } from './utils/start-timer';
import { createClient } from '@caribou-crew/mezzo-core-client';
import * as getHost from 'rn-host-detect';

import ConnectionManager from './utils/connection-manager';
import { ClientOptions } from '@caribou-crew/mezzo-interfaces';

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
  // const options = Object.assign({}, DEFAULTS, pluginConfig);
  const options = {
    ...DEFAULTS,
    ...pluginConfig,
  };

  console.log('Using host: ', options.host);

  // mezzoClient.configure({});
  const mezzoClient = createClient(options);
  console.log('Attempting to connect to socket');

  // a RegExp to suppess adding the body cuz it costs a lot to serialize
  const ignoreContentTypes =
    options.ignoreContentTypes || DEFAULT_CONTENT_TYPES_RX;

  // a XHR call tracker
  let reactotronCounter = 1000;

  // a temporary cache to hold requests so we can match up the data
  const requestCache = {};

  /**
   * Fires when we talk to the server.
   *
   * @param {*} data - The data sent to the server.
   * @param {*} instance - The XMLHTTPRequest instance.
   */
  function onSend(data, xhr) {
    if (options.ignoreUrls && options.ignoreUrls.test(xhr._url)) {
      xhr._skipReactotron = true;
      return;
    }

    // bump the counter
    reactotronCounter++;

    // tag
    xhr._trackingName = reactotronCounter;

    // cache
    requestCache[reactotronCounter] = {
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
  function onResponse(status, timeout, response, url, type, xhr) {
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

      // send this off to Reactotron
      // (reactotron as any).apiResponse(tronRequest, tronResponse, stopTimer()); // TODO: Fix
      console.log('TODO finish implementng me, send request off');
      mezzoClient.captureApiResponse(mezzoRequest, mezzoResponse, stopTimer());
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
  XHRInterceptor.setSendCallback(onSend);
  XHRInterceptor.setResponseCallback(onResponse);
  XHRInterceptor.enableInterception();

  // nothing of use to offer to the plugin
  // return {};
  // return mezzoClient;
};
