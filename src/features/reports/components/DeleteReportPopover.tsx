import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import Button from '@carrier-io/fds-react/Button';

import { useDeleteReport } from '../hooks/useDeleteReport';

import { Loader, Dialog } from '@/components';

export type Props = {
  onCancelClick: () => void;
  lookerAccessToken?: string;
  onDeleteSuccess: (planId: string | number) => void;
  scheduledPlanId: string | number;
};

export const DeleteReportPopover = ({
  onCancelClick,
  lookerAccessToken,
  onDeleteSuccess,
  scheduledPlanId,
}: Props) => {
  const { t } = useTranslation();
  const { handleDeleteReport, isLoading } = useDeleteReport({
    onClose: onCancelClick,
    lookerAccessToken,
    onDeleteSuccess,
  });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onCancelClick}
      open
      dialogTitle={`${t('assets.reports.report-delete')}`}
      fullWidth
      contentSx={{ height: '7rem', p: 1 }}
      content={
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" pl={2}>
          <Typography variant="body1" py={1.5} pr={3.5}>
            {t('assets.reports.grid.confirm-delete-scheduled-report')}
          </Typography>
          <Box display="flex" justifyContent="right">
            <Button
              sx={{ mt: 1, ml: 1 }}
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={onCancelClick}
            >
              {t('common.no')}
            </Button>
            <Button
              sx={{ mt: 1, ml: 1 }}
              type="submit"
              variant="outlined"
              color="primary"
              size="medium"
              disabled={isLoading}
              onClick={() => handleDeleteReport(scheduledPlanId)}
            >
              {t('common.delete-confirm')}
            </Button>
          </Box>
          {isLoading && <Loader overlay />}
        </Box>
      }
    />
  );
};
