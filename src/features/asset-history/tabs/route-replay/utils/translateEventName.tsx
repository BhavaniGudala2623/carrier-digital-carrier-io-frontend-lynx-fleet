import { TFunction } from 'i18next';

import { EnrichedEventData } from '../types';

import { getEventNameTranslationKey } from './getEventNameTranslationKey';
import { getEventSourceTranslationKey } from './getEventSourceTranslationKey';

import { SPACE_GAP } from '@/constants';

export const translateEventName = (sourceType: EnrichedEventData['sourceType'], t: TFunction) =>
  `${t(getEventSourceTranslationKey(sourceType))}:${SPACE_GAP}${t(getEventNameTranslationKey(sourceType))}`;
