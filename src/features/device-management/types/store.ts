import { Maybe } from '@carrier-io/lynx-fleet-types';

export interface DeviceManagementState {
  isLoading: boolean;
  error: Maybe<string>;
}

export interface BluetoothSensorsManagementState {
  isLoading: boolean;
  error: Maybe<string>;
}
