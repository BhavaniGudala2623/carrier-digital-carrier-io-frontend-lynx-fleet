import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import { formatDuration, intervalToDuration } from 'date-fns';

import { ImportDevicesState } from '../../types';
import { ImportStatus } from '../ImportStatus';

interface BulkImportStatsProps {
  state: ImportDevicesState;
}

const FieldToNameMap = {
  createdDevices: 'common.created',
  duplicatedDevices: 'common.duplicated',
  notAssignedToFlespiStream: 'device.management.device.provisioning.not-assigned-flespi-stream',
  notAssignedToFlespiPlugin: 'device.management.device.provisioning.not-assigned-flespi-plugin',
  notCreatedInFlespi: 'device.management.device.provisioning.not-created-flespi',
};

export const BulkImportStats = ({ state }: BulkImportStatsProps) => {
  const { t } = useTranslation();
  const data = state.taskResult;

  const timeSpent =
    state && state.endTime
      ? formatDuration(
          intervalToDuration({ end: new Date(state.endTime), start: new Date(state.startTime) }),
          { format: ['minutes', 'seconds'] }
        ) || `${t('common.less-than')} ${t('common.second')}`
      : 0;

  const createdDevices = data?.createdDevices || 0;
  const errors =
    (data?.duplicatedDevices || 0) +
    (data?.notAssignedToFlespiPlugin || 0) +
    (data?.notAssignedToFlespiStream || 0) +
    (data?.notCreatedInFlespi || 0);

  return (
    <>
      <ImportStatus action="create" devicesCount={createdDevices} errorsCount={errors} />
      <ul style={{ paddingLeft: 24 }}>
        <Typography variant="helperText" sx={{ left: '-24px', position: 'relative' }}>
          {t('common.details')}:
        </Typography>
        {Object.entries(FieldToNameMap).map(([field, translate]) => (
          <li key={translate}>
            <Typography variant="helperText">
              {t(translate)}: {data?.[field] || 0}
            </Typography>
          </li>
        ))}
      </ul>
      <Typography variant="helperText">
        {t('common.duration')}: {timeSpent}
      </Typography>
    </>
  );
};

BulkImportStats.displayName = 'BulkImportStats';
