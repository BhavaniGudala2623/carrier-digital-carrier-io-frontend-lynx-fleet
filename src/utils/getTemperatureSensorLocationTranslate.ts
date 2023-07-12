import { TFunction } from 'i18next';

import { TemperatureSensorLocationType } from '@/types';

function getTemperatureSensorLocationTranslationKey(sensorLocation: TemperatureSensorLocationType) {
  switch (sensorLocation) {
    case 'RAS1':
      return 'assets.asset.table.c1-ras-sensor';
    case 'SAS1':
      return 'assets.asset.table.c1-sas-sensor';
    case 'BOX1':
      return 'assets.asset.table.c1-box-sensor';
    case 'RAS1_DATACOLD':
      return 'assets.asset.table.c1-ras-datacold';
    case 'SAS1_DATACOLD':
      return 'assets.asset.table.c1-sas-datacold';
    case 'BOX1_DATACOLD':
      return 'assets.asset.table.c1-box-datacold';
    case 'RAS2':
      return 'assets.asset.table.c2-ras-sensor';
    case 'SAS2':
      return 'assets.asset.table.c2-sas-sensor';
    case 'BOX2':
      return 'assets.asset.table.c2-box-sensor';
    case 'RAS2_DATACOLD':
      return 'assets.asset.table.c2-ras-datacold';
    case 'SAS2_DATACOLD':
      return 'assets.asset.table.c2-sas-datacold';
    case 'BOX3_DATACOLD':
      return 'assets.asset.table.c3-box-datacold';
    case 'RAS3':
      return 'assets.asset.table.c3-ras-sensor';
    case 'SAS3':
      return 'assets.asset.table.c3-sas-sensor';
    case 'BOX3':
      return 'assets.asset.table.c3-box-sensor';
    case 'RAS3_DATACOLD':
      return 'assets.asset.table.c3-ras-datacold';
    case 'SAS3_DATACOLD':
      return 'assets.asset.table.c3-sas-datacold';
    case 'BOX2_DATACOLD':
      return 'assets.asset.table.c2-box-datacold';
    default:
      return null;
  }
}

export function getTemperatureSensorLocationTranslate(
  sensorLocation: TemperatureSensorLocationType,
  t: TFunction
) {
  const key = getTemperatureSensorLocationTranslationKey(sensorLocation);

  return key ? t(key) : sensorLocation;
}
