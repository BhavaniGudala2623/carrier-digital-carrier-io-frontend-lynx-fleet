import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Link from '@carrier-io/fds-react/Link';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@/components';

interface DownloadReportConfirmDialogProps {
  handleResetDialog: () => void;
  reportLink?: string;
}

export const DownloadReportConfirmDialog = ({
  handleResetDialog,
  reportLink,
}: DownloadReportConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open
      onClose={handleResetDialog}
      maxWidth="sm"
      dialogTitle="Download report"
      content={
        <Typography variant="body1">
          {t('device.management.device.provisioning.would-you-download-report')}
        </Typography>
      }
      actions={
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <Button autoFocus onClick={handleResetDialog} color="secondary" variant="outlined" sx={{ mr: 1 }}>
            {t('common.no')}
          </Button>
          <Button color="primary" type="submit" variant="outlined" disabled={!reportLink}>
            <Link underline="none" href={reportLink} color="inherit">
              {t('device.management.device.provisioning.yes-download-report')}
            </Link>
          </Button>
        </Box>
      }
      fullWidth
    />
  );
};
