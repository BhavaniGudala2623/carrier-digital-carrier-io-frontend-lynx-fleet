/**
 * "My Scheduled Reports"
 * Searching on Folders like %U:{userId}
 */
import { useEffect, useState } from 'react';
import { LookerService } from '@carrier-io/lynx-fleet-data-lib';
import Box from '@carrier-io/fds-react/Box';

import { transformScheduledPlanByUserResponse } from '../utils';
import { ScheduledPlan } from '../types';

import { ReportsGrid } from './ReportsGrid';

import { Loader } from '@/components';

type ReportsMineProps = {
  lookerUserId?: string;
  lookerUserAccessToken?: string;
};

export const ReportsMine = ({ lookerUserId, lookerUserAccessToken }: ReportsMineProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleData, setScheduleData] = useState<ScheduledPlan[]>([]);

  /**
   * "chained" Promise methodology to get:
   * All Dashboards -> filter regex on folder name -> then scheduled plan data
   * @see https://dev.to/everenjohn/useeffect-chaining-359i
   * @returns
   */
  async function loadScheduledPlanDataByUserId(signal: AbortSignal) {
    if (lookerUserId && lookerUserAccessToken) {
      try {
        const scheduledPlanData = await LookerService.fetchScheduledPlansByUserId(
          lookerUserId,
          lookerUserAccessToken,
          signal
        );

        setScheduleData(transformScheduledPlanByUserResponse(scheduledPlanData));
      } catch {
        throw new Error('Unable to retrieve Looker scheduled plan information.');
      }
    }
  }

  /**
   * Load report data (scheduled plans)
   */
  useEffect(() => {
    const abortController = new AbortController();

    if (lookerUserId) {
      loadScheduledPlanDataByUserId(abortController.signal).finally(() => setLoading(false));
    }

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookerUserId]);

  return <Box height="100%">{loading ? <Loader /> : <ReportsGrid data={scheduleData} />}</Box>;
};
