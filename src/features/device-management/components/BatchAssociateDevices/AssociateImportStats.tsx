import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import { formatDuration, intervalToDuration } from 'date-fns';

import { ImportDevicesState } from '../../types';
import { ImportStatus } from '../ImportStatus';

interface AssociateImportStatsProps {
  state: ImportDevicesState;
}

export const AssociateImportStats = ({ state }: AssociateImportStatsProps) => {
  const { t } = useTranslation();
  const data = state.taskResult;

  const timeSpent =
    state && state.endTime
      ? formatDuration(
          intervalToDuration({ end: new Date(state.endTime), start: new Date(state.startTime) }),
          { format: ['minutes', 'seconds'] }
        ) || `${t('common.less-than')} ${t('common.second')}`
      : 0;

  const updatedDevices = data?.updatedDevices || 0;
  const errors = data?.errors || 0;

  return (
    <>
      <ImportStatus action="update" devicesCount={updatedDevices} errorsCount={errors} />
      <ul style={{ paddingLeft: 24 }}>
        <Typography variant="helperText" sx={{ left: '-24px', position: 'relative' }}>
          {t('common.details')}:
        </Typography>
        <li>
          <Typography variant="helperText">
            {t('device.management.device.provisioning.devices').toLowerCase()} {t('common.updated')}:&nbsp;
            {updatedDevices}
          </Typography>
        </li>
        <li>
          <Typography variant="helperText">
            {t('common.errors')} / {t('common.not-updated')}: {errors}
          </Typography>
        </li>
      </ul>
      <Typography variant="helperText">
        {t('common.duration')}: {timeSpent}
      </Typography>
    </>
  );
};

AssociateImportStats.displayName = 'AssociateImportStats';
