import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';

import { ImportBulkCommissionState } from '../../types';

import { BulkCommissionStats } from './BulkCommissionStats';

import { formatDate } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';

interface BulkCommissionDevicesProps {
  importBulkCommissionDevicesState: ImportBulkCommissionState | null;
  loading: boolean;
  companyName: string;
  actionStartTime: string | null;
}

export const BulkCommissionDevices = ({
  importBulkCommissionDevicesState,
  loading,
  companyName,
  actionStartTime,
}: BulkCommissionDevicesProps) => {
  const { t } = useTranslation();
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();

  if (loading) {
    return (
      <>
        <Box mb={3} mt={1}>
          <Typography variant="body1">
            {t('device.management.device.commissioning.importing-company-and-tru-assoc')}...
          </Typography>
        </Box>
        {actionStartTime && (
          <Typography variant="helperText">
            {t('common.started-at')} {formatDate(actionStartTime, dateFormat, { timezone })}
          </Typography>
        )}
      </>
    );
  }

  return (
    <div>
      {importBulkCommissionDevicesState?.taskResult &&
        importBulkCommissionDevicesState.taskResult?.bulkDeviceCommissioningStartTime &&
        importBulkCommissionDevicesState.taskResult?.bulkDeviceCommissioningEndTime && (
          <BulkCommissionStats
            state={importBulkCommissionDevicesState.taskResult}
            companyName={companyName}
            status={importBulkCommissionDevicesState.status}
          />
        )}
    </div>
  );
};
