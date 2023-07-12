import { LanguageType, Maybe } from '@carrier-io/lynx-fleet-types';
import { FC } from 'react';
import { TFunction } from 'i18next';

import {
  DeFlagIcon,
  EsFlagIcon,
  FrFlagIcon,
  NlFlagIcon,
  UsFlagIcon,
  PlFlagIcon,
  ITFlagIcon,
  SEFlagIcon,
  NOFlagIcon,
  DKFlagIcon,
  GBFlagIcon,
} from '@/icons/flags';
import { defAppPreferences } from '@/constants';

export type CountryCode = 'US' | 'ES' | 'FR' | 'NL' | 'DE' | 'PL' | 'IT' | 'SE' | 'NO' | 'DK' | 'GB';
interface Language {
  locale: LanguageType;
  countryCode: CountryCode;
  flag: FC;
}

const languages: Language[] = [
  {
    locale: 'en-US',
    countryCode: 'US',
    flag: UsFlagIcon,
  },
  {
    locale: 'es-ES',
    countryCode: 'ES',
    flag: EsFlagIcon,
  },
  {
    locale: 'fr-FR',
    countryCode: 'FR',
    flag: FrFlagIcon,
  },
  {
    locale: 'nl-NL',
    countryCode: 'NL',
    flag: NlFlagIcon,
  },
  {
    locale: 'de-DE',
    countryCode: 'DE',
    flag: DeFlagIcon,
  },
  {
    locale: 'pl-PL',
    countryCode: 'PL',
    flag: PlFlagIcon,
  },
  {
    locale: 'it-IT',
    countryCode: 'IT',
    flag: ITFlagIcon,
  },
  {
    locale: 'sv-SE',
    countryCode: 'SE',
    flag: SEFlagIcon,
  },
  {
    locale: 'nb-NO',
    countryCode: 'NO',
    flag: NOFlagIcon,
  },
  {
    locale: 'da-DK',
    countryCode: 'DK',
    flag: DKFlagIcon,
  },
  {
    locale: 'en-GB',
    countryCode: 'GB',
    flag: GBFlagIcon,
  },
];

export const getLanguageFlagUrlByLocale: (locale?: LanguageType) => FC = (locale) =>
  languages.find((item) => item.locale === locale)?.flag as FC;

const countryToLanguageMap: Record<CountryCode, LanguageType> = {
  US: 'en-US',
  GB: 'en-GB',
  DE: 'de-DE',
  ES: 'es-ES',
  FR: 'fr-FR',
  IT: 'it-IT',
  NL: 'nl-NL',
  PL: 'pl-PL',
  SE: 'sv-SE',
  DK: 'da-DK',
  NO: 'nb-NO',
};

export const countryCodeToLocale = (countryCode: CountryCode): LanguageType =>
  countryToLanguageMap[countryCode] ?? 'en-US';

export const getLanguageNameByLocale = (locale: LanguageType, t: TFunction): string => {
  const foundLanguage = languages.find((item) => item.locale === locale);

  return foundLanguage?.countryCode
    ? t(`company.management.language.${foundLanguage.countryCode}`, {
        lng: countryCodeToLocale(foundLanguage.countryCode),
      })
    : '';
};

export const getLanguageLabels = (t: TFunction) =>
  languages.reduce((labels, lang) => {
    // eslint-disable-next-line no-param-reassign
    labels[lang.countryCode] = t(`company.management.language.${lang.countryCode}`, {
      lng: countryCodeToLocale(lang.countryCode),
    });

    return labels;
  }, {});

export const getAppCountryCodes = () => languages.map((item) => item.countryCode);
export const getAppLocales = () => languages.map((item) => item.locale);

export const isKnownAppLocale = (locale?: Maybe<string>): boolean =>
  locale ? getAppLocales().includes(locale as LanguageType) : false;

export const getAppLocaleOrDefault = (locale?: Maybe<string>): LanguageType =>
  isKnownAppLocale(locale) ? (locale as LanguageType) : defAppPreferences.language;

const languageToCountryMap: Record<LanguageType, CountryCode> = {
  'en-US': 'US',
  'en-GB': 'GB',
  'de-DE': 'DE',
  'es-ES': 'ES',
  'fr-FR': 'FR',
  'it-IT': 'IT',
  'nl-NL': 'NL',
  'pl-PL': 'PL',
  'sv-SE': 'SE',
  'da-DK': 'DK',
  'nb-NO': 'NO',
};

export const localeToCountryCode = (languageType: LanguageType): CountryCode =>
  languageToCountryMap[languageType] ?? 'US';

const languageToLocaleMap: Record<LanguageType, string> = {
  'en-US': 'en',
  'en-GB': 'en',
  'de-DE': 'de',
  'es-ES': 'es',
  'fr-FR': 'fr',
  'it-IT': 'it',
  'nl-NL': 'nl',
  'pl-PL': 'pl',
  'sv-SE': 'sv',
  'da-DK': 'da',
  'nb-NO': 'no',
};

export const localeToLanguageCode = (languageType: LanguageType): string =>
  languageToLocaleMap[languageType] ?? 'en';
