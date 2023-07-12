import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import { BLUETOOTH_SENSOR_STATUS_COMMISSIONED } from '@carrier-io/lynx-fleet-common';
import { Maybe, BluetoothSensor } from '@carrier-io/lynx-fleet-types';
import { SyntheticEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BluetoothService } from '@carrier-io/lynx-fleet-data-lib';

import { MoreActionsPopover } from '../../../../company-management/components';
import { WirelessSensorsTableParams } from '../../../types';
import { DecommissionSensorDialogView } from '../../DecommissionSensorDialog';
import { useBluetoothState } from '../../../providers';

import { useToggle } from '@/hooks';
import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const SensorActionsRenderer = ({ data }: WirelessSensorsTableParams) => {
  const { t } = useTranslation();
  const { setRefreshStart } = useBluetoothState();

  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Maybe<Element>>(null);
  const [selectedReason, setSelectedReason] = useState<Maybe<string>>(null);
  const [decommissionDeviceSensor, { loading: decommissionLoading }] =
    BluetoothService.useDecommissionDeviceSensor();

  const {
    value: isDecommissionSensorDialogOpen,
    toggleOn: handleOpenDecommissionSensorDialog,
    toggleOff: handleCloseDecommissionSensorDialog,
  } = useToggle(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDecommissionSensor = useCallback(
    async (macId: string, deviceId: BluetoothSensor['deviceId'], decommissionReason: string) => {
      if (!deviceId) {
        return;
      }
      try {
        await decommissionDeviceSensor({
          variables: { input: { macId, deviceId, decommissionReason } },
        });

        showMessage(
          dispatch,
          t('device.management.bluetooth-sensors.sensors-table.actions.decommission-sensor-success')
        );
        setRefreshStart(true);
        handleCloseDecommissionSensorDialog();
      } catch (err) {
        handleCloseDecommissionSensorDialog();
        // eslint-disable-next-line no-console
        console.error(err);
        showError(
          dispatch,
          t('device.management.bluetooth-sensors.sensors-table.actions.decommission-sensor-error')
        );
      }
    },
    [handleCloseDecommissionSensorDialog, decommissionDeviceSensor, dispatch, t, setRefreshStart]
  );

  const handleOkClick = async () => {
    if (selectedReason) {
      await handleDecommissionSensor(data.macId, data.deviceId, selectedReason);
    }
  };

  return (
    <>
      <MoreActionsPopover onClose={handleClose} onOpen={handleOpen} anchorEl={anchorEl}>
        <Box py={1} px={0.5}>
          <Grid direction="column" container>
            <MenuItem>
              {t('device.management.bluetooth-sensors.sensors-table.actions.sensor-details')}
            </MenuItem>
            <MenuItem>
              {t('device.management.bluetooth-sensors.sensors-table.actions.edit-replacement-schedule')}
            </MenuItem>
            <MenuItem
              disabled={data?.status !== BLUETOOTH_SENSOR_STATUS_COMMISSIONED}
              onClick={handleOpenDecommissionSensorDialog}
            >
              {t('device.management.bluetooth-sensors.sensors-table.actions.decommission-sensor')}
            </MenuItem>
          </Grid>
        </Box>
      </MoreActionsPopover>
      {isDecommissionSensorDialogOpen && (
        <DecommissionSensorDialogView
          macId={data.macId}
          open={isDecommissionSensorDialogOpen}
          decommissionLoading={decommissionLoading}
          onClose={handleCloseDecommissionSensorDialog}
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
          handleOkClick={handleOkClick}
        />
      )}
    </>
  );
};
