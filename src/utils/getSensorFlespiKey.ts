import { DeviceSensorType } from '@carrier-io/lynx-fleet-types';

export function getSensorFlespiKey(dataField: string, sensorType: string | undefined): string {
  if ((sensorType as DeviceSensorType) === 'BT_EN12830' && !dataField.startsWith('bluetooth_')) {
    return `bluetooth_${dataField}`;
  }

  return dataField;
}
