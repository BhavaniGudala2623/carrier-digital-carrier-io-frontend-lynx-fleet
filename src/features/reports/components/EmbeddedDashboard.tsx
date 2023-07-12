import { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { shallowEqual } from 'react-redux';
import DashboardEmbed from '@carrier-io/fds-react/looker/DashboardEmbed';
import { DashboardEvent } from '@looker/embed-sdk';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@carrier-io/fds-react';

import { LookerUserContext } from '../context';
import { FALLBACK_EMBED_SESSION_LENGTH } from '../utils';
import { useUpdateDashboardLocalization } from '../hooks/useUpdateDashboardLocalization';

import { useAppSelector } from '@/stores';
import { Loader } from '@/components';

export type EmbeddedDashboardProps = {
  dashboardId: string;
};

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  embedWrapper: {
    backgroundColor: 'rgba(244, 246, 249, 0.75)',
    display: 'flex',
  },
  embedContainer: {
    flexGrow: 1,
    paddingTop: '20px',
  },
}));

export const EmbeddedDashboard = ({ dashboardId }: EmbeddedDashboardProps) => {
  const { state: lookerState } = useContext(LookerUserContext);
  const classes = useStyles();
  const lookerHost = new URL(`https://${process.env.REACT_APP_LOOKER_API_URL}`).host;
  const navigate = useNavigate();
  const { t } = useTranslation();

  // @ts-ignore // TODO fix state
  const { currentState } = useAppSelector((state) => ({ currentState: state?.assetHistory }), shallowEqual);

  const [accessDenied, setAccessDenied] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [goBackLink, setGoBackLink] = useState<string>('/reports');
  const [scheduleButtonDisabled, setScheduleButtonDisabled] = useState<boolean>(false);
  const [isLocalizationUpdating, setIsLocalizationUpdating] = useState<boolean>(false);
  const { updateDashboardLocalization } = useUpdateDashboardLocalization(
    dashboardId,
    lookerState.user.accessToken
  );

  /**
   * embed component download filename formatter
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadFormatter = (dashboardTitle?: string, filters?: Record<string, any> | null) => {
    let base_filename;
    if (!dashboardTitle) {
      return 'download';
    }

    // check new report name format
    const parts = dashboardTitle.split('__');
    if (parts.length === 3) {
      base_filename = `${parts[0].trim().replace(/[^A-Za-z0-9]/g, '')}-${parts[1]
        .trim()
        .replace(/[^A-Za-z0-9]/g, '')}`;
    } else {
      base_filename = dashboardTitle
        .trim()
        .split(/\s+/)
        .map((m) => m.replace(/[^A-Za-z0-9]/g, ''))
        .join('-');
    }

    if (filters) {
      const { Timeframe = '' } = filters;
      if (Timeframe) {
        base_filename = `${base_filename}-${Timeframe.replace(/\s+/g, '')}`;
      }
    }

    return base_filename;
  };

  /**
   * component close button handler
   */
  const handleClose = () => navigate(goBackLink);

  /**
   * handling filter change(s) in the dashboard
   * @param dashboardEvent
   */
  const handleFilterChange = (dashboardEvent: DashboardEvent) => {
    const timeframe = dashboardEvent?.dashboard?.dashboard_filters?.Timeframe || '';
    if (timeframe === 'Custom') {
      setScheduleButtonDisabled(true);
      setErrorMessage(t('assets.reports.custom-filters-error'));
    } else {
      setScheduleButtonDisabled(false);
      setErrorMessage(null);
    }
  };

  useEffect(() => {
    if (!lookerState.userDataLoading && lookerState.authSuccessful) {
      const hasFilters = true;

      setIsLocalizationUpdating(true);
      updateDashboardLocalization(hasFilters).finally(() => {
        setIsLocalizationUpdating(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookerState.authSuccessful, lookerState.userDataLoading]);

  /**
   * handling the initial load, to see if the timeframe is custom
   * we don't want the schedule button disabled if this is the case
   */
  const handleDashboardLoad = (dashboardEvent: DashboardEvent) => {
    const timeframe = dashboardEvent?.dashboard?.dashboard_filters?.Timeframe || '';
    if (timeframe === 'Custom') {
      setScheduleButtonDisabled(true);
      setErrorMessage(t('assets.reports.custom-filters-error'));
    }
  };

  useEffect(() => {
    if (currentState?.eventHistoryLoaded && currentState?.asset?.id) {
      setGoBackLink(`/assets/${currentState.asset.id}`);
    }
  }, [currentState]);

  /**
   * make sure context.authSuccessful is true
   */
  useEffect(() => {
    if (!lookerState.userDataLoading && !lookerState.authSuccessful) {
      setAccessDenied(t('assets.reports.looker-access-denied'));
    } else {
      setAccessDenied('');
    }
  }, [lookerState, t]);

  if (isLocalizationUpdating || lookerState.userDataLoading) {
    return <Loader />;
  }

  return (
    <div className={classes.root}>
      {accessDenied && <Alert severity="error">{accessDenied}</Alert>}
      {!accessDenied && (
        <div className={classes.embedWrapper}>
          <div className={classes.embedContainer}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <DashboardEmbed
              accessToken={lookerState?.user?.accessToken || ''}
              closeButton
              dashboardId={dashboardId}
              disableEdit
              downloadButton
              downloadFilenameFormatter={downloadFormatter}
              downloadHeight="1240"
              downloadOnFilterChangeRun
              downloadOnRender
              downloadWidth="1754"
              embedDomain={`${window.location.protocol}//${window.location.host}`}
              forceLogoutLogin={false}
              lookerHost={lookerHost}
              onClose={handleClose}
              onDashboardLoaded={handleDashboardLoad}
              onFilterChange={handleFilterChange}
              pdfPaperSize="a4"
              scheduleButton
              scheduleButtonDisabled={scheduleButtonDisabled}
              sessionLength={FALLBACK_EMBED_SESSION_LENGTH}
              toolbarBtnCloseText={t('common.close')}
              toolbarBtnDownloadText={t('assets.reports.embed.download-button', {
                defaultValue: 'Download',
              })}
              toolbarBtnDownloadReadyText={t('assets.reports.embed.download-ready-button', {
                defaultValue: 'Download Ready',
              })}
              toolbarBtnRunText={t('assets.reports.embed.run-button', {
                defaultValue: 'Run',
              })}
              toolbarBtnScheduleText={t('assets.reports.embed.schedule-button', {
                defaultValue: 'Schedule',
              })}
              width="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};
