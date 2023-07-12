import { useCallback, useContext, useEffect, useState, memo } from 'react';
import { LookerEmbedDashboard } from '@looker/embed-sdk';
import { useOktaAuth } from '@okta/okta-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Box from '@carrier-io/fds-react/Box';

import { useReportsBreadcrumbs } from '../../../hooks/useReportsBreadcrumbs';
import { reportIds } from '../../../utils/constants';
import { getTranslatedTextValue } from '../../../utils';

import { embedCallbackRef } from './embedCallbackRef';
import { EmbedContainer } from './EmbedContainer';
import { fetchSignedUrl } from './fetchSignedUrl';

import { LookerUserContext } from '@/features/reports';
import { useAppSelector } from '@/stores';
import {
  // getUserAccessibleFleetIds,
  getUserAccessibleTenantIds,
  getAuthUserIsCarrierAdmin,
} from '@/features/authentication';

export type DashboardEmbedProps = {
  dashboardId: string;
  embedDomain: string;
  forceLogoutLogin?: boolean;
  height?: string | number;
  lookerHost: string;
  sessionLength?: number | string;
  width?: string | number;
};

export const DashboardEmbed = memo(
  ({
    dashboardId,
    embedDomain,
    forceLogoutLogin,
    height,
    lookerHost,
    sessionLength,
    width,
  }: DashboardEmbedProps) => {
    const { t } = useTranslation();
    const { state: lookerState } = useContext(LookerUserContext);
    const { authState } = useOktaAuth();
    const authUserIsCarrierAdmin = useAppSelector(getAuthUserIsCarrierAdmin);
    const userAccessibleTenantIds = useAppSelector(getUserAccessibleTenantIds);
    // const userAccessibleFleetIds = useAppSelector(getUserAccessibleFleetIds);

    const [, setDashboard] = useState<LookerEmbedDashboard | null>(null);
    const [signedUrl, setSignedUrl] = useState<string>('');

    const { search: filters = '' } = useLocation();

    const clientId = authState?.idToken?.clientId;
    const accessToken = lookerState?.user?.accessToken;
    const reportTitleUS = reportIds.get(dashboardId) ?? '';
    const reportTitle = getTranslatedTextValue(reportTitleUS, t);

    useReportsBreadcrumbs(reportTitle, dashboardId);

    /**
     * This useCallback is for injecting <iframe> once
     * we have a signed URL
     */
    const embedCtrRef = useCallback(
      (el: HTMLDivElement | null) => embedCallbackRef(el, lookerHost, setDashboard, signedUrl),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [lookerHost, signedUrl]
    );

    /**
     * this useEffect() will attempt to retrieve a signed URL
     * if both the access token and window.fetch are available
     */
    useEffect(() => {
      if (dashboardId && embedDomain && lookerHost && sessionLength && clientId) {
        fetchSignedUrl({
          dashboardId,
          embedDomain,
          setSignedUrl,
          forceLogoutLogin: forceLogoutLogin ?? true,
          isCarrierAdmin: authUserIsCarrierAdmin,
          tenantIds: userAccessibleTenantIds,
          permissions: [
            'schedule_look_emails',
            'schedule_external_look_emails',
            'download_with_limit',
            'access_data',
            'see_lookml_dashboards',
            'see_looks',
            'see_drill_overlay',
          ],
          accessToken,
          filters,
          lookerHost,
          // fleetIds: userAccessibleFleetIds,
        })
          // eslint-disable-next-line no-console
          .catch((error) => console.error(error));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      accessToken,
      dashboardId,
      embedDomain,
      forceLogoutLogin,
      lookerHost,
      sessionLength,
      clientId,
      filters,
    ]);

    return (
      <Box position="relative" height="100%">
        <EmbedContainer width={width} height={height || '100%'} ref={embedCtrRef} />
      </Box>
    );
  }
);
