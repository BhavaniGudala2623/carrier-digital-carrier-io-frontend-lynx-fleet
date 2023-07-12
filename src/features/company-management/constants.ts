import { ITab, CompanyType } from './types';
import { PrimaryContactProps } from './tabs/Companies/types';

export const preferenceToTranslationMap: { [index: string]: string } = {
  de_DE: 'preferences.german',
  en_US: 'preferences.english',
  es_ES: 'preferences.spanish',
  fr_FR: 'preferences.french',
  nl_NL: 'preferences.dutch',

  KM: 'preferences.kilometers',
  MI: 'preferences.miles',

  L: 'preferences.litres',
  G: 'preferences.gallons',

  C: 'preferences.celsius',
  F: 'preferences.fahrenheit',
};

export const companyManagementTabs: ITab[] = [
  {
    id: 'COMPANIES',
    label: 'company.management.companies',
    disabled: false,
    hide: false,
  },
  {
    id: 'PARENTS',
    label: 'company.management.parents',
    disabled: false,
    hide: false,
  },
  {
    id: 'ASSETS',
    label: 'company.management.assets',
    disabled: false,
    hide: false,
  },
  {
    id: 'FLEETS',
    label: 'assets.management.fleets',
    disabled: false,
    hide: false,
  },
  {
    id: 'USERS',
    label: 'company.management.users',
    disabled: false,
    hide: false,
  },
  {
    id: 'GROUPS',
    label: 'company.management.groups',
    disabled: false,
    hide: false,
  },
];

export const companyTypeEntity = {
  [CompanyType.Customer]: 'company.management.companyType.Customer',
  [CompanyType.Dealer]: 'company.management.companyType.Dealer',
  [CompanyType.Distributor]: 'company.management.companyType.Distributor',
  [CompanyType.ServicePartner]: 'company.management.companyType.Service-partner',
  [CompanyType.CarrierWarehouse]: 'company.management.companyType.Carrier-warehouse',
};

export const preferencesEntity = {
  temperature: {
    celsius: 'C',
    fahrenheit: 'F',
  },
  distance: {
    kilometers: 'KM',
    miles: 'MI',
  },
  volume: {
    litres: 'L',
    gallons: 'G',
  },
  speed: {
    KPH: 'KPH',
    MPH: 'MPH',
  },
};

export const NAME_COL_ID = 'name';

export const ContactFieldToPrimaryContactMap: Record<string, keyof PrimaryContactProps> = {
  'contactInfo.name': 'name',
  'contactInfo.lastName': 'lastName',
  'contactInfo.email': 'email',
  'contactInfo.phone': 'phone',
};
