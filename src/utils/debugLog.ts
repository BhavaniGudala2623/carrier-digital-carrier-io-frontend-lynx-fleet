import { isAppDebugLogActive } from './isAppDebugLogActive';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debugLog = (message?: any, ...optionalParams: any[]) => {
  if (isAppDebugLogActive()) {
    // eslint-disable-next-line no-console
    console.log(message, optionalParams);
  }
};
