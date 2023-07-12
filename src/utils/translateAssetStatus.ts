import { TFunction } from 'i18next';

import { MIN_MOVEMENT_SPEED_FOR_STATE_IN_MOTION } from '../constants';

export const translateAssetStatus = (t: TFunction, value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }

  return value >= MIN_MOVEMENT_SPEED_FOR_STATE_IN_MOTION
    ? t('assets.asset.table.in-motion')
    : t('assets.asset.table.stationary');
};
