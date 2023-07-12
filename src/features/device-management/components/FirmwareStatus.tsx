import Chip from '@carrier-io/fds-react/Chip';
import Box from '@carrier-io/fds-react/Box';
import { CheckCircle, Error } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { FIRMWARE_UPDATE_REQUIRED, FIRMWARE_UPDATED } from '../constants';

import { FotawebTaskStatus } from './FotawebTaskStatus';

interface FirmwareStatusProps {
  status?: string;
}

export const FirmwareStatus = ({ status }: FirmwareStatusProps) => {
  const { t } = useTranslation();

  if (!status) {
    return <Box>-</Box>;
  }

  const isFotawebStatus = status !== FIRMWARE_UPDATE_REQUIRED || status !== FIRMWARE_UPDATED;

  return (
    <Box>
      {status === FIRMWARE_UPDATE_REQUIRED && (
        <Chip
          color="default"
          icon={<Error fontSize="inherit" />}
          label={t('device.management.device.commissioning.status.update-required')}
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {status === FIRMWARE_UPDATED && (
        <Chip
          color="success"
          icon={<CheckCircle fontSize="inherit" />}
          label={t('device.management.device.commissioning.status.up-to-date')}
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {isFotawebStatus && <FotawebTaskStatus status={status} taskType="firmware" />}
    </Box>
  );
};
