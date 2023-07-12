import { TFunction } from 'i18next';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { RegionType } from '@carrier-io/lynx-fleet-common';
import { useEffect, useState } from 'react';

import { getCountryCodeLabels, getCountryCodes, getRegionByCountry } from '@/utils';

export const useRegion = (t: TFunction, region?: Maybe<RegionType>, country?: Maybe<string>) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionType | ''>(region || '');
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [countryLabels, setCountryLabels] = useState<Record<string, string>>();

  useEffect(() => {
    if (country) {
      const countryRegion = getRegionByCountry(country);
      setSelectedRegion(countryRegion === 'UDEFINED' ? '' : countryRegion);
    }
  }, [country]);

  useEffect(() => {
    if (selectedRegion) {
      setCountryCodes(getCountryCodes(selectedRegion));
      setCountryLabels(getCountryCodeLabels(selectedRegion, t));
    }
  }, [selectedRegion, t]);

  const disableCountrySelect = !selectedRegion || countryCodes?.length < 2;

  return { selectedRegion, setSelectedRegion, countryCodes, countryLabels, disableCountrySelect };
};
