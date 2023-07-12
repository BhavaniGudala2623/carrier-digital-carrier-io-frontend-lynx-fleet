import { Maybe, TruStatusType } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

export const translateTruStatus = (t: TFunction, value: Maybe<TruStatusType> | undefined): string => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  switch (value) {
    case 'ON':
      return t('asset.data.on');

    case 'OFF':
      return t('asset.data.off');

    default:
      return value;
  }
};
