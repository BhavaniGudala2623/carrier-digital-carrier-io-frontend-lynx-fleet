import { TFunction } from 'i18next';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { getCountryName } from '@/utils';

export const CountryNameRenderer = (params: { value?: Maybe<string> }, t: TFunction) => {
  const country = params?.value;

  return country ? t(getCountryName(country)) : '';
};
