import { DeviceFilter, BluetoothSensorFilter } from '@carrier-io/lynx-fleet-types';

import { useTabsState } from '../providers';

import { DeviceProvisioningTableContainer } from './DeviceProvisioningTable/DeviceProvisioningTableContainer';
import { WirelessSensorsTableContainer } from './WirelessSensorsTable';

interface DeviceManagementPageTablesContainerProps {
  deviceFilter: DeviceFilter;
  bluetoothFilter: BluetoothSensorFilter;
}
export const DeviceManagementPageTablesContainer = ({
  deviceFilter,
  bluetoothFilter,
}: DeviceManagementPageTablesContainerProps) => {
  const { selectedTabId } = useTabsState();

  return selectedTabId === 'DEVICES' ? (
    <DeviceProvisioningTableContainer filter={deviceFilter} />
  ) : (
    <WirelessSensorsTableContainer filter={bluetoothFilter} />
  );
};
