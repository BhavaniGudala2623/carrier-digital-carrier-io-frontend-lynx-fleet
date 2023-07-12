import Chip from '@carrier-io/fds-react/Chip';
import Box from '@carrier-io/fds-react/Box';
import { CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import {
  FOTAWEB_TASK_STATUS_CANCELLED,
  FOTAWEB_TASK_STATUS_COMPLETE,
  FIRMWARE_UPDATED,
  CONFIG_UPDATED,
} from '../constants';

interface GeneralStatusProps {
  firmwareStatus: string;
  configStatus: string;
  isSameGroup: boolean;
}

export const GeneralStatus = ({ firmwareStatus, configStatus, isSameGroup }: GeneralStatusProps) => {
  const { t } = useTranslation();
  const isFirmwareUpdated = [
    FOTAWEB_TASK_STATUS_CANCELLED,
    FIRMWARE_UPDATED,
    FOTAWEB_TASK_STATUS_COMPLETE,
  ].includes(firmwareStatus);
  const isConfigUpdated = [
    FOTAWEB_TASK_STATUS_CANCELLED,
    CONFIG_UPDATED,
    FOTAWEB_TASK_STATUS_COMPLETE,
  ].includes(configStatus);
  const isConfigured = isFirmwareUpdated && isConfigUpdated && isSameGroup;

  return (
    <Box>
      {isConfigured && (
        <Chip
          color="success"
          icon={<CheckCircle fontSize="inherit" />}
          label={t('device.management.device.commissioning.status.configured')}
          size="small"
          variant="filled"
          style={{
            borderRadius: 4,
          }}
          lightBackground
        />
      )}
      {!isConfigured && (
        <Chip
          label={t('device.management.device.commissioning.status.not-configured')}
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
