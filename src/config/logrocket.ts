/* eslint-disable no-param-reassign */
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

export function initLogRocket() {
  if (process.env.REACT_APP_LOGROCKET_ENABLED === 'true' && process.env.REACT_APP_LOGROCKET_APP_ID) {
    LogRocket.init(process.env.REACT_APP_LOGROCKET_APP_ID, {
      dom: {
        inputSanitizer: true,
      },
      network: {
        requestSanitizer: (request) => {
          if (request.method && request.method.toLowerCase() === 'post') {
            request.body = '';
          }
          if (request.url && request.url.indexOf('okta') !== -1) {
            request.body = '';
          }

          return request;
        },
        responseSanitizer: (response) => {
          if (response.headers['x-secret']) {
            return null;
          }
          response.body = '';

          return response;
        },
      },
    });

    setupLogRocketReact(LogRocket);
  }
}
