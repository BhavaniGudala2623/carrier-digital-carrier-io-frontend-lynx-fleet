/*
Variables declared in the console are added to the window object (https://developer.mozilla.org/en-US/docs/Web/API/Window).

 To activate application debug logs:
 - open Google Chrome Console and type:
     appDebugLog=true
 - to check type:
     window
*/
export const isAppDebugLogActive = () =>
  (window as { appDebugLog?: boolean } | undefined)?.appDebugLog === true;
