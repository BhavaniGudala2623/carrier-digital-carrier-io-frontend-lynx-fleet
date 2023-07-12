import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import CountrySelect from '@carrier-io/fds-react/patterns/CountrySelect';

import { Measurement } from '../../../../components/Measurement';
import { AddUserInput } from '../../types';
import {
  distanceOptions,
  getPreferenceName,
  speedOptions,
  temperatureOptions,
  volumeOptions,
} from '../../../../utils';

import { StepContainer } from './styles';

import { defAppPreferences } from '@/constants';
import { FormSelect } from '@/components';
import { timeZonesList } from '@/utils/timezonesList';
import {
  CountryCode,
  countryCodeToLocale,
  getAppCountryCodes,
  getLanguageLabels,
  localeToCountryCode,
} from '@/utils';
import { useAppSelector } from '@/stores';
import { getAuthUser } from '@/features/authentication';

export const PreferencesStep = ({ action }: { action?: 'edit' | 'add' }) => {
  const { t } = useTranslation();

  const { values, handleChange, setFieldValue } = useFormikContext<AddUserInput>();
  const { preferences } = values;

  const authUser = useAppSelector(getAuthUser);
  const isDisabled = action === 'edit' && authUser?.email !== values?.email;

  const timezoneOptions = useMemo(() => timeZonesList.map(({ value }) => value), []);
  const timezoneLabels = useMemo(() => timeZonesList.map(({ label }) => label), []);

  const handleSelectLanguage = (countryCode: string) =>
    setFieldValue('preferences.language', countryCodeToLocale(countryCode as CountryCode));

  return (
    <StepContainer>
      <CountrySelect
        disabled={isDisabled}
        customLabels={getLanguageLabels(t)}
        id="companyPreferences.language"
        selected={localeToCountryCode(preferences.language)}
        countries={getAppCountryCodes()}
        onSelect={handleSelectLanguage}
        label={t('common.language')}
        size="small"
        sx={{ mb: 1.5 }}
        required
        sortingByLabel="asc"
      />
      <FormSelect
        value={preferences.timezone ?? defAppPreferences.timezone}
        name="preferences.timezone"
        label={t('company.management.timezone')}
        placeholder="company.management.timezone"
        onChange={handleChange}
        options={timezoneOptions}
        timeZones={timezoneLabels}
        disabled={values.isCompanyPreferenceLoading || isDisabled}
        stylesSelect={{
          mb: 2,
        }}
        stylesMenu={{
          maxHeight: 440,
        }}
        required
      />
      <Measurement
        label="preferences.temperature"
        onChange={handleChange}
        value={preferences.temperature}
        name={getPreferenceName(preferences.temperature)}
        toggleOptions={temperatureOptions}
        fieldName="preferences.temperature"
        disabled={isDisabled}
      />
      <Measurement
        label="preferences.distance"
        onChange={handleChange}
        value={preferences.distance}
        name={getPreferenceName(preferences.distance)}
        toggleOptions={distanceOptions}
        fieldName="preferences.distance"
        disabled={isDisabled}
      />
      <Measurement
        label="preferences.volume"
        onChange={handleChange}
        value={preferences.volume}
        name={getPreferenceName(preferences.volume)}
        toggleOptions={volumeOptions}
        fieldName="preferences.volume"
        disabled={isDisabled}
      />
      <Measurement
        label="preferences.speed"
        onChange={handleChange}
        value={preferences.speed}
        name={getPreferenceName(preferences.speed)}
        toggleOptions={speedOptions}
        fieldName="preferences.speed"
        disabled={isDisabled}
      />
    </StepContainer>
  );
};

PreferencesStep.displayName = 'PreferencesStep';
