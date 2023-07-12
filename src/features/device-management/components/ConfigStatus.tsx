import Chip from '@carrier-io/fds-react/Chip';
import Box from '@carrier-io/fds-react/Box';
import { Error, CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import {
  CONFIGURATION_STATUS_CONFIGURED,
  CONFIGURATION_STATUS_DEFAULT,
  CONFIGURATION_STATUS_FAILED,
  CONFIGURATION_STATUS_PENDING,
  CONFIGURATION_STATUS_RUNNING,
} from '../constants';

interface ConfigStatusProps {
  configStatus: unknown;
}

export const ConfigStatus = ({ configStatus }: ConfigStatusProps) => {
  const { t } = useTranslation();

  return (
    <Box maxWidth="50%">
      {configStatus === CONFIGURATION_STATUS_FAILED && (
        <Chip
          color="error"
          icon={<Error fontSize="inherit" />}
          label={t('device.management.drawer.configuration-status.error')}
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {configStatus === CONFIGURATION_STATUS_RUNNING && (
        <Chip
          label={t('device.management.drawer.configuration-status.update-running')}
          color="primary"
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {configStatus === CONFIGURATION_STATUS_PENDING && (
        <Chip
          label={t('device.management.drawer.configuration-status.update-pending')}
          color="primary"
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {configStatus === CONFIGURATION_STATUS_CONFIGURED && (
        <Chip
          label={t('device.management.drawer.configuration-status.configured')}
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
      {configStatus === CONFIGURATION_STATUS_DEFAULT && (
        <Chip
          label={t('device.management.drawer.configuration-status.error')}
          color="default"
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

ConfigStatus.displayName = 'ConfigStatus';
