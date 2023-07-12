import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import { BluetoothService } from '@carrier-io/lynx-fleet-data-lib';
import { BluetoothSensor } from '@carrier-io/lynx-fleet-types';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ColumnRenderer } from './ColumnRenderer';

import { ErrorOverlay, dateTimeFormatter } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';

interface DecommissionSensorDialogTableProps {
  macId: string;
  isLoading: boolean;
  onLoad: () => void;
}

export const DecommissionSensorDialogTable = ({
  macId,
  isLoading,
  onLoad,
}: DecommissionSensorDialogTableProps) => {
  const { t } = useTranslation();
  const { userSettings } = useUserSettings();
  const { timezone, dateFormat } = userSettings;
  const [sensorData, setSensorData] = useState<BluetoothSensor | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    BluetoothService.getBluetoothSensor({ macId })
      .then((response) => {
        const data = response.data.getBluetoothSensor;
        const payload = data?.payload;

        if (data.success && payload && payload !== null) {
          setSensorData(payload);
          onLoad();
        }
      })
      .catch(() => {
        onLoad();
        setIsError(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isGridReady = useMemo(() => !isLoading && !isError, [isError, isLoading]);

  return (
    <Box
      width="100%"
      minHeight="66px"
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      alignItems="center"
      style={{ maxHeight: 'max-content', overflowY: 'hidden' }}
    >
      {isGridReady && (
        <Grid container spacing={1}>
          <ColumnRenderer
            size={3}
            header={t(
              'device.management.bluetooth-sensors.sensors-table.decommission-dialog.sensor-location'
            )}
            value={sensorData?.sensorLocation ?? '-'}
          />
          <ColumnRenderer
            header={t('device.management.bluetooth-sensors.sensors-table.decommission-dialog.mac-address')}
            value={macId}
          />
          <ColumnRenderer size={3} header={t('common.location')} value={sensorData?.sensorLocation ?? '-'} />
          <ColumnRenderer
            header={t(
              'device.management.bluetooth-sensors.sensors-table.decommission-dialog.expiration-date'
            )}
            value={dateTimeFormatter(sensorData?.replacementDate, { dateFormat, timezone }) ?? '-'}
          />
          <ColumnRenderer
            header={t(
              'device.management.bluetooth-sensors.sensors-table.decommission-dialog.decommission-date'
            )}
            value={dateTimeFormatter(Date.now(), { dateFormat, timezone }) ?? '-'}
          />
        </Grid>
      )}
      {isError && (
        <ErrorOverlay
          message={t('device.management.device.info.error-loading-device-data')}
          errorIconFontSize={33}
          variant="alertTitle"
        />
      )}
    </Box>
  );
};
