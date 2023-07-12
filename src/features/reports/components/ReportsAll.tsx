/**
 * "My Scheduled Reports"
 */
import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { LookerUserProviderState, AllDashboardsWithFolderInfoResponse } from '@carrier-io/lynx-fleet-types';
import { LookerService } from '@carrier-io/lynx-fleet-data-lib';

import { getFolderMatchRegex, transformScheduledPlanQueryResponse } from '../utils';
import { ScheduledPlan } from '../types';

import { ReportsGrid } from './ReportsGrid';

import { Loader } from '@/components';

type ReportsAllProps = {
  lookerState: Partial<LookerUserProviderState>;
};

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '15px',
  },
}));

function ReportsAll({ lookerState }: ReportsAllProps): JSX.Element {
  const classes = useStyles();
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scheduleData, setScheduleData] = useState<ScheduledPlan[]>([]);

  /**
   * "chained" Promise methodology to getting:
   *   folder ID(s) by wildcard name -> then
   *   dashboard ID(s) for folder ID(s) -> then
   *   scheduled plan data for dashboard ID(s)
   * @see https://dev.to/everenjohn/useeffect-chaining-359i
   */
  async function loadScheduledPlanData() {
    // a compound regular expression with all possible matching folder names
    const folderNameFilterRe = getFolderMatchRegex(lookerState);

    return (
      // //////////////////////////////////////////////////////////
      // Step 1. Retrieve all current dashboards including
      // folder id/name information for filtering in the then()
      // ////////////////////////////////////////////////////////
      new Promise<AllDashboardsWithFolderInfoResponse[]>(
        // eslint-disable-next-line no-async-promise-executor
        async (
          resolve,
          reject // eslint-disable-next-line consistent-return
        ) => {
          try {
            const dashboardData: AllDashboardsWithFolderInfoResponse[] =
              await LookerService.fetchAllDashboardsWithFolderInfo(lookerState?.user?.accessToken || '');

            if (folderNameFilterRe) {
              resolve(dashboardData.filter((f) => folderNameFilterRe.test(f?.folder?.name || '')));
            } else {
              resolve([]);
            }
          } catch (_) {
            reject(new Error('Unable to retrieve Looker dashboard information.'));
          }
        }
      )
        // //////////////////////////////////////////////////////////
        // Step 2: Fetch scheduled plans for dashboard ID(s)
        // //////////////////////////////////////////////////////////
        .then(async (dashboardData) => {
          // filter out on compound folder regex and just in case only
          // use dashboard IDs that are numeric, cuz we have some that can be
          // strings
          let filtered: AllDashboardsWithFolderInfoResponse[] = [];

          if (folderNameFilterRe) {
            filtered = dashboardData.filter((f: AllDashboardsWithFolderInfoResponse) =>
              folderNameFilterRe.test(f?.folder?.name || '')
            );
          }

          const numericDashboardIds = filtered
            .filter((f: AllDashboardsWithFolderInfoResponse) => !Number.isNaN(+f.id))
            .map((m: AllDashboardsWithFolderInfoResponse) => m.id);

          try {
            const scheduledPlanData = await LookerService.fetchScheduledPlansByDashboardId(
              numericDashboardIds,
              lookerState?.user?.accessToken || ''
            );
            setScheduleData(transformScheduledPlanQueryResponse(scheduledPlanData));
          } catch (_) {
            throw new Error('Unable to retrieve Looker scheduled plan information.');
          }
        })
        .finally(() => {
          setLoading(false);
        })
    ); // end return
  } // end function

  /**
   * Load report data (scheduled plans)
   */
  useEffect(() => {
    if (lookerState?.user?.id) {
      loadScheduledPlanData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookerState?.user?.id]);

  return (
    <div>
      <div className={classes.title}>{t('assets.reports.all-scheduled-reports')}</div>
      {loading ? <Loader /> : <ReportsGrid data={scheduleData} />}
    </div>
  );
}

// eslint-disable-next-line import/no-default-export
export default ReportsAll;
