import { DeviceSensorType } from '@carrier-io/lynx-fleet-types';

import { TemperatureSensorLocationType } from '@/types';

export function getSensorTranslationKey(
  sensorLocation: TemperatureSensorLocationType,
  sensorType: DeviceSensorType
) {
  if (sensorType === 'BT_EN12830') {
    switch (sensorLocation) {
      case 'RAS1':
      case 'RAS2':
      case 'RAS3':
        return 'common.ras-bt-sensor';

      case 'SAS1':
      case 'SAS2':
      case 'SAS3':
        return 'common.sas-bt-sensor';

      case 'BOX1':
      case 'BOX2':
      case 'BOX3':
        return 'common.box-bt-sensor';

      default:
        return '';
    }
  }

  switch (sensorLocation) {
    case 'RAS1':
    case 'RAS2':
    case 'RAS3':
      return 'assethistory.route.ras-sensor';
    case 'SAS1':
    case 'SAS2':
    case 'SAS3':
      return 'assethistory.route.sas-sensor';
    case 'BOX1':
    case 'BOX2':
    case 'BOX3':
      return 'assethistory.route.box-sensor';
    case 'RAS1_DATACOLD':
    case 'RAS2_DATACOLD':
    case 'RAS3_DATACOLD':
      return 'assethistory.route.ras-datacold';
    case 'SAS1_DATACOLD':
    case 'SAS2_DATACOLD':
    case 'SAS3_DATACOLD':
      return 'assethistory.route.sas-datacold';
    case 'BOX1_DATACOLD':
    case 'BOX3_DATACOLD':
    case 'BOX2_DATACOLD':
      return 'assethistory.route.box-datacold';
    default:
      return '';
  }
}
