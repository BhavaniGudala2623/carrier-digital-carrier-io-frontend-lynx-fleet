import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DescriptionItem } from '@carrier-io/fds-react/patterns/Description/DescriptionItem';
import { Description } from '@carrier-io/fds-react/patterns/Description';
import { DescriptionVariants } from '@carrier-io/fds-react/patterns/Description/types';

import { ContentItem } from './ContentItem';
import { getNameByValue } from './helper';

import { getLanguageFlagUrlByLocale, getLanguageNameByLocale } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const PreferencesAdditionalInformation = () => {
  const { t } = useTranslation();
  const { appLanguage } = useApplicationContext();
  const { userSettings } = useUserSettings();
  const { timezone, temperature, distance, volume, speed, dateFormat } = userSettings;

  const languageLabel = useMemo(
    () => (appLanguage ? getLanguageNameByLocale(appLanguage, t) : ''),
    [t, appLanguage]
  );

  return (
    <Description rowIndentCssUnit="rem" rowIndentValue={1.25} variant={DescriptionVariants.HorizontalFixed}>
      <DescriptionItem label={languageLabel}>
        <ContentItem flag={getLanguageFlagUrlByLocale(appLanguage)} />
      </DescriptionItem>
      <DescriptionItem label={t('preferences.timezone')}>
        <ContentItem content={timezone} />
      </DescriptionItem>
      <DescriptionItem label={t('preferences.date-format')}>
        <ContentItem content={dateFormat} />
      </DescriptionItem>
      <DescriptionItem label={t('preferences.temperature')}>
        <ContentItem content={getNameByValue(temperature, 'temperature', t)} />
      </DescriptionItem>
      <DescriptionItem label={t('preferences.distance')}>
        <ContentItem content={getNameByValue(distance, 'distance', t)} />
      </DescriptionItem>
      <DescriptionItem label={t('preferences.volume')}>
        <ContentItem content={getNameByValue(volume, 'volume', t)} />
      </DescriptionItem>
      <DescriptionItem label={t('preferences.speed')}>
        <ContentItem content={getNameByValue(speed, 'speed', t)} />
      </DescriptionItem>
    </Description>
  );
};

PreferencesAdditionalInformation.displayName = 'PreferencesAdditionalInformation';
