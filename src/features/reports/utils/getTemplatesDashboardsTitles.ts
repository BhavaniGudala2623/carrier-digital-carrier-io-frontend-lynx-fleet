import { TFunction } from 'i18next';

import { DashboardTextType } from '../types';

import { templateNames, dashboardTitles, dashboardDescriptions } from './constants';

export const getTranslatedTextValue = (value: string, t: TFunction, type?: DashboardTextType) => {
  if (!value) {
    return '';
  }

  let map;

  if (type === 'template') {
    map = templateNames;
  } else if (type === 'description') {
    map = dashboardDescriptions;
  } else {
    map = dashboardTitles;
  }

  const key = map.get(value);

  return t(key) || value;
};
