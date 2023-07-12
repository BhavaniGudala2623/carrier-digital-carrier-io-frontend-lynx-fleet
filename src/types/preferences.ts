import { DistanceType, SpeedType, TemperatureType, VolumeType } from '@carrier-io/lynx-fleet-types';

export type MeasurementUnit = {
  value: TemperatureType | DistanceType | VolumeType | SpeedType;
  name: string;
  shortName: string;
};

export type MeasurementItem = {
  metric: MeasurementUnit;
  imperial: MeasurementUnit;
};

export type Measurements = {
  temperature: MeasurementItem;
  distance: MeasurementItem;
  volume: MeasurementItem;
  speed: MeasurementItem;
};

export type MeasurementsKeys = keyof Measurements;
