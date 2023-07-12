/**
 * src/components/looker/DashboardEmbed/embedCallbackRef.ts
 * Extrapolating out this callback function for testing
 */
import { Dispatch, SetStateAction } from 'react';
import { LookerEmbedDashboard, LookerEmbedSDK } from '@looker/embed-sdk';

export function embedCallbackRef(
  el: HTMLDivElement | null,
  // dashboardLoadedHandler: (evt: DashboardEvent) => void,
  // filterChangeHandler: (evt: DashboardEvent) => void,
  lookerHost: string,
  setDashboard: Dispatch<SetStateAction<LookerEmbedDashboard | null>>,
  signedUrl: string
) {
  if (el && lookerHost && signedUrl) {
    // eslint-disable-next-line no-param-reassign
    el.innerHTML = '';
    LookerEmbedSDK.init(lookerHost);

    const db = LookerEmbedSDK.createDashboardWithUrl(signedUrl);

    db.appendTo(el)
      .withNext()
      .build()
      .connect()
      .then((dash: LookerEmbedDashboard) => {
        setDashboard(dash);
      })
      .catch((error) => {
        /* istanbul ignore next */ console.error('Connection error', error);
      });
  }
}
