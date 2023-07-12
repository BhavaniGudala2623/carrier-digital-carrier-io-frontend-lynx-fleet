import { MutableRefObject } from 'react';
import {
  ColumnMovedEvent,
  GetMainMenuItemsParams,
  GridReadyEvent,
  MenuItemDef,
  SortChangedEvent,
  GridApi,
} from '@ag-grid-community/core';
import { Maybe, DeviceSensorType, Sensor, BluetoothSensorGrid } from '@carrier-io/lynx-fleet-types';

import { NOT_INSTALLED, ParamsProps } from './deviceCommissioning';

import { Columns } from '@/types';

export type SensorType = {
  value?: string;
  display?: string;
  dataField: string;
  idField?: string | null;
  sensorId?: string | null;
  macId?: Pick<Sensor, 'macId'>;
  flespiKey?: string;
  fixed?: boolean;
  installed?: string | null;
  sensorLocation?: string;
  sensorType?: string;
  connectionLocation?: SensorConnectionLocationType;
  configured?: boolean;
  displayValue?: string;
  datacold?: boolean;
  location?: string;
  compatibleWithEN12830?: boolean | null;
  touched?: boolean;
  lastUpdated?: number | null;
  sensorData?: unknown | null;
  __typename?: string;
};

export type SensorConnectionLocationType = ConnectionLocations | string;

export enum DoorSensorLocationValues {
  NONE = 'NONE',
  SIDE = 'SIDE',
  REAR = 'REAR',
}

export enum ConnectionLocations {
  TELEMATICS_DEVICE = 'Telematics Device',
  TRU_CONTROLLER = 'TRU Controller',
}

export type FlespiDataType = Record<string, string | number>;

export const NONE = 'NONE';

export type SensorValueFormatterTypeParamsProps = Pick<ParamsProps, 'value'> & {
  data: { sensorValue: SensorValueType };
};

export interface SensorsConfigTableProps {
  onGridReady: (params: GridReadyEvent) => void;
  onColumnsChanged?: (params: ColumnMovedEvent | SortChangedEvent, columns: Columns) => void;
  getMainMenuItems: (params: GetMainMenuItemsParams) => (string | MenuItemDef)[];
  isFuelLevelSensor: (sensor: Pick<SensorType, 'dataField'>) => boolean;
  isDoorSensor: (sensor: Pick<SensorType, 'dataField'>) => boolean;
  isTemperatureSensor: (sensor: Pick<SensorType, 'dataField'>) => boolean;
  isTemperatureSensor1WireBLE?: (
    dataField: SensorType['dataField'],
    idField: SensorType['idField']
  ) => boolean;
  handleChangeSensorField: (value: SensorFieldValue, flespiKey: string, field: string) => void;
  handleChangeConfigured: (checked: boolean, flespiKey: string) => void;
  toggleFuelLevelConfiguration: (checked: boolean, flespiKey: string) => void;
  handleChangeCompatibility?: (value: string, flespiKey: string) => void;
  sensorVersion: SensorVersion;
  regularSensorsGridApiRef?: MutableRefObject<GridApi | null>;
}

export type SensorFieldValue = string | null;

export type SensorsConfig = Record<string, SensorType>;
export type SensorValueType = number | string | typeof NOT_INSTALLED | null;

export enum SensorVersion {
  Regular = 'regular',
  Datacold = 'datacold',
}

export interface WirelessSensorsTableParams {
  value?: Maybe<string | number>;
  data: BluetoothSensorGrid;
  deviceViewAllowed?: boolean;
}

export type TemperatureWirelessSensorType = Extract<DeviceSensorType, 'ONE_WIRE' | 'BT_EN12830'>;
export type TemperatureWirelessSensorOption = '1 Wire' | 'BT-EN12830';
export interface ITemperatureWirelessSensorOption {
  value: TemperatureWirelessSensorType;
  title: TemperatureWirelessSensorOption;
}

export type SensorTypeFormatterOptionsType = Pick<SensorsConfigTableProps, 'isTemperatureSensor1WireBLE'>;
