export function getDoorSensorDataKey(sensorConfig, door) {
  if (!sensorConfig) {
    return null;
  }
  const sensor = sensorConfig.find((s) => s.configured && s.sensorLocation === door);

  return sensor ? sensor.flespiKey : null;
}
