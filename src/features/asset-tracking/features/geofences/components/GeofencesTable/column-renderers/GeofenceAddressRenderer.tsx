import { Geofence, LanguageType } from '@carrier-io/lynx-fleet-types';
import { ValueFormatterParams } from '@ag-grid-community/core';

import { getGeofenceAddressByLanguage } from '../../../../../utils';

interface Options {
  language: LanguageType;
}

export const GeofenceAddressRenderer = (
  params: ValueFormatterParams<Geofence, string> & {
    options: Options;
  }
) => {
  const { data, options } = params;
  const { language } = options;

  if (!data) {
    return '';
  }

  return getGeofenceAddressByLanguage(data, language) || '';
};
