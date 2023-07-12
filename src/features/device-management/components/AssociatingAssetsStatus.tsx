import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { CheckCircle, Warning, Error } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface CommissioningStatusProps {
  errorsCount: number;
  assetsCount: number;
  companyName: string;
}

function getStatus(errorsCount: number, assetsCount: number): string {
  if (errorsCount > 0 && assetsCount > 0) {
    return 'warning';
  }
  if (errorsCount > 0 && assetsCount === 0) {
    return 'error';
  }

  return 'success';
}

export const AssociatingAssetsStatus = ({
  errorsCount,
  assetsCount = 0,
  companyName,
}: CommissioningStatusProps) => {
  const { t } = useTranslation();
  const status = getStatus(errorsCount, assetsCount);

  return (
    <>
      {status === 'success' && (
        <Box display="inline-flex" alignItems="center" mt={2}>
          <CheckCircle color="success" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.commissioning.assigned-assets-success', {
              value: assetsCount,
              companyName,
            })}
          </Typography>
        </Box>
      )}
      {status === 'warning' && (
        <Box display="inline-flex" alignItems="center" mt={2}>
          <Warning color="warning" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.commissioning.assigned-assets-warning', {
              value: assetsCount,
              companyName,
            })}
          </Typography>
        </Box>
      )}
      {status === 'error' && (
        <Box display="inline-flex" alignItems="center" mt={2}>
          <Error color="error" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.commissioning.assigned-assets-failed', {
              companyName,
            })}
          </Typography>
        </Box>
      )}
    </>
  );
};
