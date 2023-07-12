import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LookerService } from '@carrier-io/lynx-fleet-data-lib';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { AlertColor } from '@/types';

export type DeleteReportArgs = {
  onClose: () => void;
  lookerAccessToken?: string;
  onDeleteSuccess: (planId: string | number) => void;
};

export const useDeleteReport = ({ onClose, lookerAccessToken, onDeleteSuccess }: DeleteReportArgs) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const openSnackBar = useCallback(
    (message: string, severity: AlertColor) => {
      if (severity === 'info') {
        showMessage(dispatch, message);
      }

      if (severity === 'error') {
        showError(dispatch, message);
      }
    },
    [dispatch]
  );

  const handleDeleteReport = useCallback(
    async (planId: string | number) => {
      if (!planId) {
        return;
      }

      setLoading(true);

      try {
        // set the last argument to true if you want to just dry run this call
        // and see the expected result
        const result = await LookerService.scheduledPlanDelete({
          userToken: lookerAccessToken || '',
          scheduledPlanId: planId.toString(),
          dryRun: false,
        });

        const { data, errors } = result;

        if (errors || !data) {
          openSnackBar(`${t('command-history.command-status.failed')} - ${errors?.[0]?.message}`, 'error');
          // eslint-disable-next-line no-console
          console.error('Delete report error: ', errors);
        } else {
          // see schema side of things in celsius-gql-sls
          const { success, error } = data.deleteScheduledPlan;

          if (success) {
            onDeleteSuccess(planId);
            openSnackBar(t('assets.reports.report-deleted'), 'info');
          } else {
            openSnackBar(`${t('command-history.command-status.failed')} - ${error}`, 'error');
            // eslint-disable-next-line no-console
            console.error('Delete report error: ', error);
          }
        }
      } catch (error) {
        openSnackBar(`${t('command-history.command-status.failed')} - ${error}`, 'error');
        // eslint-disable-next-line no-console
        console.error('Delete report error: ', error);
      }

      setLoading(false);
      onClose();
    },
    [onClose, lookerAccessToken, openSnackBar, t, onDeleteSuccess]
  );

  return {
    handleDeleteReport,
    isLoading,
  };
};
