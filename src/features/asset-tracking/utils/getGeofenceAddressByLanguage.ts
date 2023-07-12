import { Geofence } from '@carrier-io/lynx-fleet-types';
import { LanguageType } from '@carrier-io/lynx-fleet-types/dist/common/types';

import { localeToLanguageCode } from '@/utils';

export const getGeofenceAddressByLanguage = (geofence: Geofence, language: LanguageType) => {
  const languageCode = localeToLanguageCode(language);

  return geofence[`address_${languageCode}`] || geofence.address_en;
};
