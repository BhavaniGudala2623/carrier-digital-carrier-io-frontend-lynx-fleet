import Chip from '@carrier-io/fds-react/Chip';
import Box from '@carrier-io/fds-react/Box';
import { Error, CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import {
  FOTAWEB_TASK_STATUS_CANCELLED,
  FOTAWEB_TASK_STATUS_COMPLETE,
  FOTAWEB_TASK_STATUS_FAILED,
  FOTAWEB_TASK_STATUS_PENDING,
  FOTAWEB_TASK_STATUS_RUNNING,
} from '../constants';

interface FotawebTaskStatusProps {
  status: string;
  taskType?: 'firmware' | 'config';
}

export const FotawebTaskStatus = ({ status, taskType = 'config' }: FotawebTaskStatusProps) => {
  const { t } = useTranslation();

  return (
    <Box>
      {status === FOTAWEB_TASK_STATUS_FAILED && (
        <Chip
          color="error"
          icon={<Error fontSize="inherit" />}
          label={t('device.management.device.commissioning.status.failed')}
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {status === FOTAWEB_TASK_STATUS_CANCELLED && (
        <Chip
          label={t('device.management.device.commissioning.status.cancelled')}
          color="default"
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {status === FOTAWEB_TASK_STATUS_PENDING && (
        <Chip
          label={t('device.management.device.commissioning.status.pending')}
          color="primary"
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {status === FOTAWEB_TASK_STATUS_RUNNING && (
        <Chip
          label={t('device.management.device.commissioning.status.running')}
          color="primary"
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {status === FOTAWEB_TASK_STATUS_COMPLETE && (
        <Chip
          label={
            taskType === 'config'
              ? t('device.management.device.commissioning.status.device-configured')
              : t('device.management.device.commissioning.status.up-to-date')
          }
          color="success"
          icon={<CheckCircle fontSize="inherit" />}
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
    </Box>
  );
};
