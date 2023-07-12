import { Maybe } from '@carrier-io/lynx-fleet-types';
import { RegionType } from '@carrier-io/lynx-fleet-common';
import Box from '@carrier-io/fds-react/Box';
import CountrySelect from '@carrier-io/fds-react/patterns/CountrySelect';
import { useTranslation } from 'react-i18next';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';
import { useMemo } from 'react';

import { useRegion } from '../../../../hooks';

import { FormSelect } from '@/components';
import { regionOptions } from '@/constants';

interface RegionCountrySelectProps {
  region?: Maybe<RegionType>;
  country?: Maybe<string>;
  onRegionChange: (region: RegionType) => void;
  onCountryChange: (country: string) => void;
  regionError?: string;
  allowedRegions: Maybe<string[]>;
  allowedCountries: Maybe<string[]>;
}

export const RegionCountrySelect = ({
  region,
  country,
  onRegionChange,
  onCountryChange,
  regionError,
  allowedRegions,
  allowedCountries,
}: RegionCountrySelectProps) => {
  const { t } = useTranslation();

  const { selectedRegion, setSelectedRegion, countryCodes, countryLabels, disableCountrySelect } = useRegion(
    t,
    region,
    country
  );

  const handleRegionChange = (e) => {
    const { value } = e.target;
    setSelectedRegion(value);
    onRegionChange(value);
    onCountryChange('');
  };

  const handleCountryChange = (countryCode: string) => {
    onCountryChange(countryCode);
  };

  const handleClear = () => {
    onCountryChange('');
  };

  const filteredRegions = useMemo(
    () =>
      allowedRegions && allowedRegions.length > 0
        ? regionOptions.filter((r) => allowedRegions.includes(r.name))
        : regionOptions,
    [allowedRegions]
  );

  const filteredCountries = useMemo(
    () =>
      allowedCountries && allowedCountries.length > 0
        ? countryCodes.filter((c) => allowedCountries.includes(c))
        : countryCodes,
    [countryCodes, allowedCountries]
  );

  return (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
      <Box position="relative" pb={1} display="flex" flexDirection="column">
        <FormSelect
          label={t('company.management.region')}
          labelId="region"
          value={selectedRegion}
          color={regionError ? 'error' : undefined}
          onChange={handleRegionChange}
          required
        >
          {filteredRegions.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {t(option.label)}
            </MenuItem>
          ))}
        </FormSelect>
        {regionError && <FormHelperText error>{regionError}</FormHelperText>}
      </Box>
      <Box position="relative" pb={1}>
        <CountrySelect
          countries={filteredCountries}
          customLabels={countryLabels}
          selected={country || ''}
          onSelect={handleCountryChange}
          label={t('common.components.country')}
          labelId="country"
          disabled={disableCountrySelect}
          size="small"
          fullWidth
          onClear={handleClear}
        />
      </Box>
    </Box>
  );
};
