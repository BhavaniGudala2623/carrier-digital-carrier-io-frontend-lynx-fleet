import { RegionType } from '@carrier-io/lynx-fleet-common';
import { TFunction } from 'i18next';

import { regionCountriesMap } from '@/constants';
import { RegionTypeEx } from '@/types';

export const getRegionByCountry = (country: string | undefined): RegionTypeEx => {
  if (!country) {
    return 'UDEFINED';
  }

  const regions = Object.keys(regionCountriesMap) as RegionType[];

  return regions.find((region: RegionType) => country in regionCountriesMap[region]) ?? 'UDEFINED';
};

export const getCountryCodes = (region: RegionType) => Object.keys(regionCountriesMap[region]);

export const getCountryName = (name: string) => {
  const allCountries = Object.keys(regionCountriesMap).reduce(
    (acc, region) => ({ ...acc, ...regionCountriesMap[region] }),
    {}
  );

  return allCountries[name] || name;
};

export const getCountryCodeLabels = (region: RegionType, t: TFunction) =>
  Object.keys(regionCountriesMap[region]).reduce(
    (labels, country) => ({ ...labels, [country]: t(getCountryName(country)) }),
    {}
  );
