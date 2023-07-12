import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';

import { LookerUserContext } from '../context';
import { FALLBACK_EMBED_SESSION_LENGTH } from '../utils';
import { useUpdateDashboardLocalization } from '../hooks/useUpdateDashboardLocalization';

import { DashboardEmbed } from './LookerDashboardEmbedded/DashboardEmbed/DashboardEmbed';

import { Loader } from '@/components';

export type EmbeddedDashboardProps = {
  dashboardId: string;
};

export const EmbeddedDashboardFleetReports = ({ dashboardId }: EmbeddedDashboardProps) => {
  const { state: lookerState } = useContext(LookerUserContext);
  const lookerHost = new URL(`https://${process.env.REACT_APP_LOOKER_API_URL}`).host;
  const { t } = useTranslation();

  const [accessDenied, setAccessDenied] = useState<string>('');
  const [isLocalizationUpdating, setIsLocalizationUpdating] = useState<boolean>(false);
  const { updateDashboardLocalization } = useUpdateDashboardLocalization(
    dashboardId,
    lookerState.user.accessToken
  );

  useEffect(() => {
    if (!lookerState.userDataLoading && lookerState.authSuccessful) {
      const hasFilters = false;

      setIsLocalizationUpdating(true);
      updateDashboardLocalization(hasFilters).finally(() => {
        setIsLocalizationUpdating(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookerState.authSuccessful, lookerState.userDataLoading]);

  useEffect(() => {
    if (!lookerState.userDataLoading && !lookerState.authSuccessful) {
      setAccessDenied(t('assets.reports.looker-access-denied'));
    } else {
      setAccessDenied('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookerState.userDataLoading, lookerState.authSuccessful]);

  if (isLocalizationUpdating || lookerState.userDataLoading) {
    return <Loader />;
  }

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {accessDenied && <Alert severity="error">{accessDenied}</Alert>}
      {!accessDenied && (
        <Box display="flex" height="100%" bgcolor="rgba(244, 246, 249, 0.75)">
          <Box flexGrow={1} pt={2.5} height="100%">
            <DashboardEmbed
              dashboardId={dashboardId}
              embedDomain={`${window.location.protocol}//${window.location.host}`}
              forceLogoutLogin
              lookerHost={lookerHost}
              sessionLength={FALLBACK_EMBED_SESSION_LENGTH}
              width="100%"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
