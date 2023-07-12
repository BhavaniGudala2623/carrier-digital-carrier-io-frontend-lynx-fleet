import { EnrichedEventData } from '../types';

export const getEventSourceTranslationKey = (sourceType: EnrichedEventData['sourceType']) => {
  if (sourceType.startsWith('NOTIFICATION')) {
    return 'assethistory.route.notification';
  }

  if (sourceType.startsWith('ALARM')) {
    return 'assethistory.route.alarm';
  }

  return 'assethistory.route.event';
};
