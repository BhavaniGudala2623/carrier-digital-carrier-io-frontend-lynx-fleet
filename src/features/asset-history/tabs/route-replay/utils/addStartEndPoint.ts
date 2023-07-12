import { EventDataSourceType } from '@carrier-io/lynx-fleet-types';

import { StartPointEventId, EndPointEventId } from '../constants';
import { EnrichedEventData } from '../types';

export const addStartEndPoints = (events: EnrichedEventData[]) => {
  const startPoint = {
    ...events[0],
    eventId: StartPointEventId,
    sourceType: 'START_POINT' as EventDataSourceType,
  };
  events.unshift(startPoint);

  const endPoint = {
    ...events[events.length - 1],
    eventId: EndPointEventId,
    sourceType: 'END_POINT' as EventDataSourceType,
  };

  events.push(endPoint);

  return events;
};
