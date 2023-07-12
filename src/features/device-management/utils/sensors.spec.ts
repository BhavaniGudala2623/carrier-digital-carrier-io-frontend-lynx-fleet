import { isFuelLevelSensor, isDoorSensor, isTemperatureSensor } from '.';

describe('Defines correct sensor type', () => {
  it('Check if sensor is fuel level type', async () => {
    expect(isFuelLevelSensor({ dataField: 'freezer_fuel_level' })).toBe(true);
    expect(isFuelLevelSensor({ dataField: 'plugin_fuel_level' })).toBe(true);
    expect(isFuelLevelSensor({ dataField: 'sensor_temperature_5' })).toBe(false);
  });

  it('Check if sensor is door type', async () => {
    expect(isDoorSensor({ dataField: 'plugin_door_closed_1' })).toBe(true);
    expect(isDoorSensor({ dataField: 'plugin_door_closed_2' })).toBe(true);
    expect(isDoorSensor({ dataField: 'freezer_datacold_din_1' })).toBe(true);
    expect(isDoorSensor({ dataField: 'sensor_temperature_1' })).toBe(false);
    expect(isDoorSensor({ dataField: 'freezer_fuel_level' })).toBe(false);
  });

  it('Check if sensor is temperature type', async () => {
    expect(isTemperatureSensor({ dataField: 'sensor_temperature_2' })).toBe(true);
    expect(isTemperatureSensor({ dataField: 'freezer_datacold_sensor_temperature_3' })).toBe(true);
    expect(isTemperatureSensor({ dataField: 'plugin_door_closed_1' })).toBe(false);
  });
});
