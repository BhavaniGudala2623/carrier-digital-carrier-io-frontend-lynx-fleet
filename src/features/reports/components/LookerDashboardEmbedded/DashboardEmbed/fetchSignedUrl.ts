/**
 * src/components/looker/DashboardEmbed/fetchSignedUrl.ts
 * async call to fetch a signed URL
 */
import { LookerService } from '@carrier-io/lynx-fleet-data-lib';

import { LOOKER_NULL_STRING_FILTER_REPORT } from '../../../utils/constants';

export async function fetchSignedUrl(options: {
  dashboardId: string | number;
  embedDomain: string;
  setSignedUrl: (url: string) => void;
  forceLogoutLogin: boolean;
  isCarrierAdmin: boolean;
  tenantIds: string[];
  permissions: string[];
  accessToken: string;
  filters: string;
  lookerHost?: string;
  // fleetIds: string[];
}) {
  const {
    dashboardId,
    embedDomain,
    setSignedUrl,
    forceLogoutLogin,
    isCarrierAdmin,
    tenantIds,
    permissions,
    accessToken,
    filters = '',
  } = options;
  const company_access = isCarrierAdmin ? LOOKER_NULL_STRING_FILTER_REPORT : tenantIds.join(',');

  // @ts-ignore
  const ssoEmbedUrlResponse = await LookerService.getSsoEmbedUrl({
    options: {
      dashboardId: dashboardId.toString(),
      embedDomain,
      forceLogoutLogin,
      companyAccess: company_access,
      fleetAccess: LOOKER_NULL_STRING_FILTER_REPORT,
      permissions,
      accessToken,
      filters,
    },
  });

  const { success, url, error } = ssoEmbedUrlResponse.data.getSsoEmbedUrl;

  if (success && url) {
    /* const result = await fetch(`https://${lookerHost}/api/4.0/embed/token_url/me`, {
      body: JSON.stringify({ target_url: url }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (result?.ok) {
      const dataFetch = await result.json();
      console.log('dataFetch :', dataFetch);

      setSignedUrl(dataFetch?.url);
    } */

    setSignedUrl(url);
    console.log('ssoEmbedUrl', url);
  } else {
    console.log('Error', error);
  }
}
