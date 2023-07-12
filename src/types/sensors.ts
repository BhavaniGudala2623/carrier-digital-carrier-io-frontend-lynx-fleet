export const temperatureSensorLocations = [
  'RAS1',
  'SAS1',
  'BOX1',
  'RAS1_DATACOLD',
  'SAS1_DATACOLD',
  'BOX1_DATACOLD',
  'RAS2',
  'SAS2',
  'BOX2',
  'RAS2_DATACOLD',
  'SAS2_DATACOLD',
  'BOX2_DATACOLD',
  'RAS3',
  'SAS3',
  'BOX3',
  'RAS3_DATACOLD',
  'SAS3_DATACOLD',
  'BOX3_DATACOLD',
] as const;

export type TemperatureSensorLocationType = (typeof temperatureSensorLocations)[number];
