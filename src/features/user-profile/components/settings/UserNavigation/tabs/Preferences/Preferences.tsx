import { MouseEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@carrier-io/fds-react/Grid';
import CountrySelect from '@carrier-io/fds-react/patterns/CountrySelect';
import Box from '@carrier-io/fds-react/Box';
import { dateFormats } from '@carrier-io/lynx-fleet-common';

import { Measurement } from './Measurement';

import { defAppPreferences } from '@/constants';
import { FormSelect } from '@/components';
import {
  CountryCode,
  countryCodeToLocale,
  getAppCountryCodes,
  getLanguageLabels,
  localeToCountryCode,
  timeZonesList,
} from '@/utils';
import { SelectChangeEvent } from '@/types';
import { getMeasurements } from '@/constants/getMeasurements';
import { useUserSettings } from '@/providers/UserSettings';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const Preferences = () => {
  const { t } = useTranslation();
  const { appLanguage, setAppLanguage } = useApplicationContext();

  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { timezone, temperature, distance, volume, speed, dateFormat } = userSettings;

  const measurements = getMeasurements(t);

  const handleLanguageChange = (countryCode: string) => {
    const newLanguage = countryCodeToLocale(countryCode as CountryCode);
    setAppLanguage(newLanguage);
    onUserSettingsChange('language', newLanguage);
  };

  const handleTimezoneChange = (event: SelectChangeEvent<unknown>) => {
    const { name = '', value = '' } = event.target;
    onUserSettingsChange(name, value);
  };

  const handleDateFormatChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value = '' } = event.target;
    onUserSettingsChange(name, value);
  };

  const handleMeasurementChange = (event: MouseEvent<HTMLElement>) => {
    const button = event.target as HTMLButtonElement;
    const { name = '', value = '' } = button;
    onUserSettingsChange(name, value);
  };

  const timezoneOptions = useMemo(() => timeZonesList.map(({ value }) => value), []);
  const timezoneLabels = useMemo(() => timeZonesList.map(({ label }) => label), []);
  const dateFormatOptions = useMemo(() => dateFormats.map((item) => item), []);

  const countryCodes = getAppCountryCodes();
  const countryCodeLabels = getLanguageLabels(t);

  const selectedCountry = appLanguage && localeToCountryCode(appLanguage);

  return (
    <Grid container>
      <form style={{ width: '100%' }}>
        <CountrySelect
          countries={countryCodes}
          customLabels={countryCodeLabels}
          selected={selectedCountry || ''}
          onSelect={handleLanguageChange}
          label={t('common.language')}
          labelId="language"
          size="small"
          fullWidth
          sortingByLabel="asc"
        />
        <FormSelect
          value={timezone ?? defAppPreferences.timezone}
          name="timezone"
          label={t('preferences.timezone')}
          placeholder="preferences.timezone"
          onChange={handleTimezoneChange}
          options={timezoneOptions}
          timeZones={timezoneLabels}
          stylesFormControl={{ mt: 2 }}
          stylesInputLabel={{
            left: -3,
          }}
          stylesMenu={{
            maxHeight: 440,
            maxWidth: 352,
          }}
          stylesMenuItem={{ whiteSpace: 'normal' }}
        />
        <FormSelect
          value={dateFormat}
          name="dateFormat"
          label={t('preferences.date-format')}
          placeholder="preferences.date-format"
          onChange={handleDateFormatChange}
          options={dateFormatOptions}
          stylesFormControl={{ my: 2 }}
          stylesInputLabel={{
            left: -3,
          }}
          stylesMenu={{
            maxHeight: 440,
            maxWidth: 352,
          }}
          stylesMenuItem={{ whiteSpace: 'normal' }}
        />
        <Box>
          <Measurement
            name="temperature"
            label={t('preferences.temperature')}
            value={temperature}
            onChange={handleMeasurementChange}
            metric={measurements.temperature.metric}
            imperial={measurements.temperature.imperial}
          />
          <Measurement
            name="distance"
            label={t('preferences.distance')}
            value={distance}
            onChange={handleMeasurementChange}
            metric={measurements.distance.metric}
            imperial={measurements.distance.imperial}
          />
          <Measurement
            name="volume"
            label={t('preferences.volume')}
            value={volume}
            onChange={handleMeasurementChange}
            metric={measurements.volume.metric}
            imperial={measurements.volume.imperial}
          />
          <Measurement
            name="speed"
            label={t('preferences.speed')}
            value={speed}
            onChange={handleMeasurementChange}
            metric={measurements.speed.metric}
            imperial={measurements.speed.imperial}
          />
        </Box>
      </form>
    </Grid>
  );
};

Preferences.displayName = 'Preferences';
