import { TaskStatus } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import { formatDuration, intervalToDuration } from 'date-fns';

import { BatchDeviceCommissionPayloadUpdate } from '../../types';
import { CommissioningStatus } from '../CommissioningStatus';
import { AssociatingAssetsStatus } from '../AssociatingAssetsStatus';

import { formatDate } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';

interface BulkCommissionStatsProps {
  state: BatchDeviceCommissionPayloadUpdate;
  companyName: string;
  status: TaskStatus;
}

const FieldToNameDevicesCommissioning = {
  devicesCommissioned: 'device.management.device.commissioning.devices-commissioned',
  errorOrDuplicatedDevices: 'device.management.device.commissioning.devices-errors-duplicates',
};

export const BulkCommissionStats = ({ state, companyName, status }: BulkCommissionStatsProps) => {
  const { t } = useTranslation();
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();

  const timeSpent =
    state && state.bulkDeviceCommissioningEndTime
      ? formatDuration(
          intervalToDuration({
            end: new Date(state.bulkDeviceCommissioningEndTime),
            start: new Date(state.bulkDeviceCommissioningStartTime),
          }),
          { format: ['minutes', 'seconds'] }
        ) || `${t('common.less-than')} ${t('common.second')}`
      : 0;

  const assignedTimeSpent =
    state && state.bulkAssetFleetAssociationEndTime && state.bulkCompanyAssociationStartTime
      ? formatDuration(
          intervalToDuration({
            end: new Date(state.bulkAssetFleetAssociationEndTime),
            start: new Date(state.bulkCompanyAssociationStartTime),
          }),
          { format: ['minutes', 'seconds'] }
        ) || `${t('common.less-than')} ${t('common.second')}`
      : 0;

  const devicesCommissioned = state?.devicesCommissioned || 0;

  const commissioningErrors =
    (state?.invalidRecords || 0) +
    (state?.deviceAssociatedToDiffAsset || 0) +
    (state?.alreadyAssignedToDiffCompany || 0) +
    (state?.deviceAssociatedToDiffTRU || 0) +
    (state?.devicesArleadyCommissioned || 0) +
    (state?.devicesNotFound || 0);

  const deviceCommissioningData = {
    devicesCommissioned: state?.devicesCommissioned || 0,
    assetsAssigned: (state?.assetsAssignedToFleet || 0) + (state?.assetsAssignedToCompany || 0),
    errorOrDuplicatedDevices: commissioningErrors,
  };

  return (
    <>
      <CommissioningStatus devicesCount={devicesCommissioned} errorsCount={commissioningErrors} />
      <ul style={{ paddingLeft: 24 }}>
        <Typography variant="helperText" sx={{ left: '-24px', position: 'relative' }}>
          {t('common.details')}:
        </Typography>
        {Object.entries(FieldToNameDevicesCommissioning).map(([field, translate]) => (
          <li key={translate}>
            <Typography variant="helperText">
              {t(translate)}: {deviceCommissioningData?.[field] || 0}
            </Typography>
          </li>
        ))}
      </ul>
      <Typography variant="helperText">
        {t('common.duration')}: {timeSpent}
      </Typography>
      {status === 'STARTED' &&
        state.bulkCompanyAssociationStartTime &&
        !state.bulkAssetFleetAssociationEndTime && (
          <>
            <Typography mb={3} mt={3} component="div">
              {t('device.management.device.commissioning.assigning-assets')}...
            </Typography>
            <Typography variant="caption" component="div">
              {t('common.started-at')}{' '}
              {formatDate(state.bulkCompanyAssociationStartTime, dateFormat, { timezone })}
            </Typography>
          </>
        )}
      {state.bulkCompanyAssociationStartTime &&
        (state.bulkAssetFleetAssociationEndTime ||
          (state.bulkCompanyAssociationEndTime && status !== 'STARTED')) && (
          <div>
            <AssociatingAssetsStatus
              assetsCount={deviceCommissioningData.assetsAssigned}
              errorsCount={commissioningErrors}
              companyName={companyName}
            />
            <ul style={{ paddingLeft: 24 }}>
              <Typography variant="helperText" sx={{ left: '-24px', position: 'relative' }}>
                {t('common.details')}:
              </Typography>
              <li>
                <Typography variant="helperText">
                  {t('device.management.device.commissioning.assigned-assets')}:{' '}
                  {deviceCommissioningData?.assetsAssigned || 0}
                </Typography>
              </li>
            </ul>
            <Typography variant="helperText">
              {t('common.duration')}: {assignedTimeSpent}
            </Typography>
          </div>
        )}
    </>
  );
};

BulkCommissionStats.displayName = 'BulkCommissionStats';
