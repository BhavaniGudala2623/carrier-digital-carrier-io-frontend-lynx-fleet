import { GetDeviceSnapshotResponse, FotawebDevice, FotawebGroup, Maybe } from '@carrier-io/lynx-fleet-types';
import { createContext } from 'react';

export interface DeviceCommissioningContextInterface {
  isLoading: boolean;
  error: unknown;
  permissions: {
    assetEditAllowed?: boolean;
    deviceEditAllowed?: boolean;
  };
  snapshot: GetDeviceSnapshotResponse;
  fotawebGroups?: Maybe<FotawebGroup[]>;
  fotawebDevice?: Maybe<FotawebDevice>;
  updateSnapshotFlespiData: () => void;
  refreshingSnapshot?: boolean;
}

export const DeviceCommissioningContext = createContext<DeviceCommissioningContextInterface>({
  isLoading: false,
  error: '',
  permissions: {
    assetEditAllowed: false,
    deviceEditAllowed: false,
  },
  snapshot: {},
  fotawebDevice: null,
  fotawebGroups: null,
  updateSnapshotFlespiData: () => {},
  refreshingSnapshot: false,
});
