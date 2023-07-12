import {
  Device,
  Maybe,
  FlespiData,
  SnapshotDataGql,
  Alert,
  CompartmentConfig,
  FreezerAlarm,
} from '@carrier-io/lynx-fleet-types';

export interface DeviceSensors extends Record<string, unknown> {
  pluginFuelLevelConfigured: boolean;
  freezerFuelLevelConfigured: boolean;
  sideDoorConfigured: boolean;
  rearDoorConfigured: boolean;
  pluginFuelLevel?: Maybe<string>;
  freezerFuelLevel?: Maybe<string>;
}

export interface SnapshotDataEx extends Record<string, unknown>, Omit<SnapshotDataGql, 'device'> {
  flespiData?: Maybe<Partial<FlespiData>>;
  alerts?: Maybe<Maybe<Alert>[]>;
  device?: Omit<Device, 'sensors'> & {
    sensors?: DeviceSensors;
    compartmentConfig?: Maybe<CompartmentConfig>;
  };
}
export type FreezerAlarmWithRecommendedAction = FreezerAlarm & { recommendation?: string };
