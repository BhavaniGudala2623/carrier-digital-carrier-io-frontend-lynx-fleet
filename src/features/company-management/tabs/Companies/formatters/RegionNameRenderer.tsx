import { TFunction } from 'i18next';
import { Maybe } from '@carrier-io/lynx-fleet-types';

export const RegionNameRenderer = (params: { value?: Maybe<string> }, t: TFunction) => {
  const region = params.value;

  return region ? t(`company.management.region.${region}`) : '';
};
