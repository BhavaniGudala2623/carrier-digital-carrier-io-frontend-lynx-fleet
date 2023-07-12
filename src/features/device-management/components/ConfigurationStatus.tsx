import Chip from '@carrier-io/fds-react/Chip';
import Box from '@carrier-io/fds-react/Box';
import { CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { CONFIG_UPDATED, CONFIG_UPDATE_REQUIRED } from '../constants';

import { FotawebTaskStatus } from './FotawebTaskStatus';

interface ConfigurationStatusProps {
  status?: string;
}

export const ConfigurationStatus = ({ status }: ConfigurationStatusProps) => {
  const { t } = useTranslation();

  if (!status) {
    return <Box>-</Box>;
  }

  const isFotawebStatus = status !== CONFIG_UPDATE_REQUIRED || status !== CONFIG_UPDATED;

  return (
    <Box>
      {status === CONFIG_UPDATE_REQUIRED && (
        <Chip
          color="default"
          label={t('device.management.device.commissioning.status.not-configured')}
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {status === CONFIG_UPDATED && (
        <Chip
          color="success"
          icon={<CheckCircle fontSize="inherit" />}
          label={t('device.management.device.commissioning.status.device-configured')}
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {isFotawebStatus && <FotawebTaskStatus status={status} />}
    </Box>
  );
};
