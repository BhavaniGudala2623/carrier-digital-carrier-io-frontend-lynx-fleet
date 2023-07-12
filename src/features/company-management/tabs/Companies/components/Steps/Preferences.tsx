import { useMemo } from 'react';
import CountrySelect from '@carrier-io/fds-react/patterns/CountrySelect';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import Grid from '@carrier-io/fds-react/Grid';

import { Measurement } from '../../../../components/Measurement';
import {
  distanceOptions,
  getPreferenceName,
  speedOptions,
  temperatureOptions,
  volumeOptions,
} from '../../../../utils';

import { FormSelect } from '@/components';
import { CreateCompanyFormData } from '@/features/company-management/types';
import {
  CountryCode,
  countryCodeToLocale,
  getAppCountryCodes,
  getLanguageLabels,
  localeToCountryCode,
  timeZonesList,
} from '@/utils';
import { defAppPreferences } from '@/constants';

export const Preferences = () => {
  const { t } = useTranslation();

  const { values, handleChange, setFieldValue } = useFormikContext<CreateCompanyFormData>();
  const { companyPreferences } = values;

  const handleSelectLanguage = (countryCode: string) => {
    setFieldValue('companyPreferences.language', countryCodeToLocale(countryCode as CountryCode));
  };

  const timezoneOptions = useMemo(() => timeZonesList.map(({ value }) => value), []);
  const timezoneLabels = useMemo(() => timeZonesList.map(({ label }) => label), []);

  return (
    <Grid container direction="column" sx={{ width: 440 }}>
      <CountrySelect
        customLabels={getLanguageLabels(t)}
        id="companyPreferences.language"
        selected={localeToCountryCode(companyPreferences.language ?? defAppPreferences.language)}
        countries={getAppCountryCodes()}
        onSelect={handleSelectLanguage}
        label={t('common.language')}
        sx={{ mb: 1.5 }}
        size="small"
        required
        sortingByLabel="asc"
      />
      <FormSelect
        value={companyPreferences.timeZone ?? defAppPreferences.timezone}
        name="companyPreferences.timeZone"
        label={t('company.management.timezone')}
        placeholder="company.management.timezone"
        onChange={handleChange}
        options={timezoneOptions}
        timeZones={timezoneLabels}
        stylesSelect={{
          mb: 2,
        }}
        stylesInputLabel={{
          left: -3,
        }}
        stylesMenu={{
          maxHeight: 440,
        }}
        required
      />
      <Measurement
        label="preferences.temperature"
        onChange={handleChange}
        value={companyPreferences.temperature ?? defAppPreferences.temperature}
        name={getPreferenceName(companyPreferences.temperature ?? defAppPreferences.temperature)}
        toggleOptions={temperatureOptions}
        fieldName="companyPreferences.temperature"
      />
      <Measurement
        label="preferences.distance"
        onChange={handleChange}
        value={companyPreferences.distance ?? defAppPreferences.distance}
        name={getPreferenceName(companyPreferences.distance ?? defAppPreferences.distance)}
        toggleOptions={distanceOptions}
        fieldName="companyPreferences.distance"
      />
      <Measurement
        label="preferences.volume"
        onChange={handleChange}
        value={companyPreferences.volume ?? defAppPreferences.volume}
        name={getPreferenceName(companyPreferences.volume ?? defAppPreferences.volume)}
        toggleOptions={volumeOptions}
        fieldName="companyPreferences.volume"
      />
      <Measurement
        label="preferences.speed"
        onChange={handleChange}
        value={companyPreferences.speed ?? defAppPreferences.speed}
        name={getPreferenceName(companyPreferences.speed ?? defAppPreferences.speed)}
        toggleOptions={speedOptions}
        fieldName="companyPreferences.speed"
      />
    </Grid>
  );
};

Preferences.displayName = 'Preferences';
