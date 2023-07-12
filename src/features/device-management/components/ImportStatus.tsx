import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { CheckCircle, Warning, Error } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ImportStatusProps {
  action: 'update' | 'create';
  errorsCount: number;
  devicesCount: number;
}

export const ImportStatus = ({ errorsCount, action, devicesCount = 0 }: ImportStatusProps) => {
  const { t } = useTranslation();
  const actionTranslated = action === 'create' ? t('common.created') : t('common.updated');

  let status = 'success';

  if (errorsCount > 0 && devicesCount > 0) {
    status = 'warning';
  } else if (errorsCount > 0 && devicesCount === 0) {
    status = 'error';
  }

  return (
    <>
      {status === 'success' && (
        <Box display="inline-flex" alignItems="center">
          <CheckCircle color="success" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.import.status-success', {
              value: devicesCount,
              action: actionTranslated,
            })}
          </Typography>
        </Box>
      )}
      {status === 'warning' && (
        <Box display="inline-flex" alignItems="center">
          <Warning color="warning" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.import.status-with-errors', {
              value: devicesCount,
              action: actionTranslated,
            })}
          </Typography>
        </Box>
      )}
      {status === 'error' && (
        <Box display="inline-flex" alignItems="center">
          <Error color="error" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.import.status-error', {
              action: actionTranslated,
            })}
          </Typography>
        </Box>
      )}
    </>
  );
};
