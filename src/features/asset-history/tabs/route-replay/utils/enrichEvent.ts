import { TFunction } from 'i18next';

import { StartPointTimeChange, EndPointTimeChange } from '../constants';
import { EnrichedEventData } from '../types';

import { translateEventName } from './translateEventName';

export const enrichEvent = (
  item: EnrichedEventData,
  events: EnrichedEventData[],
  t: TFunction
): EnrichedEventData => {
  let timeChange = 0;
  if (item.sourceType === 'START_POINT') {
    timeChange = StartPointTimeChange;
  } else if (item.sourceType === 'END_POINT') {
    timeChange = EndPointTimeChange;
  }

  const snapshot = events.find((el) => el.sourceType === 'SNAPSHOT' && el.time === item.time);

  return {
    ...(snapshot || {}),
    ...item,
    // +- 1ms to ensure the point is always at the top/bottom sorted by the time
    time: item.time + timeChange,
    name: translateEventName(item.sourceType, t),
  };
};
