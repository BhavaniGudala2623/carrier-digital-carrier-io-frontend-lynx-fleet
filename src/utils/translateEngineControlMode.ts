import { EngineControlModeType, Maybe } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

export const translateEngineControlMode = (
  t: TFunction,
  value: Maybe<EngineControlModeType> | undefined
): string => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  switch (value) {
    case 'Continuous':
      return t('asset.data.continuous');

    case 'Start/Stop':
      return t('asset.data.start-stop');

    default:
      return value;
  }
};
