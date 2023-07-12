import { EnginePowerModeType } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

export const translateEnginePowerMode = (t: TFunction, value: EnginePowerModeType | null): string => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  switch (value) {
    case 'Engine':
      return t('asset.data.engine');

    case 'Standby':
      return t('asset.data.standby');

    default:
      return value;
  }
};
