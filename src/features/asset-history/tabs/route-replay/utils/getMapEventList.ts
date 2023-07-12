import { AllMapEvents, EnrichedEventData, MultiEvent } from '../types';

const isLocationMatch = (
  firstItem: EnrichedEventData | MultiEvent,
  secondItem: EnrichedEventData | MultiEvent
): boolean =>
  firstItem.position_longitude === secondItem.position_longitude &&
  firstItem.position_latitude === secondItem.position_latitude;

const getMultiEvent = (events: EnrichedEventData[]): MultiEvent => ({
  multiEventId: `MULTI-${events[0].eventId}`,
  events,
  position_latitude: events[0].position_latitude,
  position_longitude: events[0].position_longitude,
  eventsCounter: events.length,
});

export const getMapEventList = (eventDataArr: EnrichedEventData[]): AllMapEvents => {
  const multiEvents: MultiEvent[] = [];
  const regularEvents: EnrichedEventData[] = [];

  for (const eventItem of eventDataArr) {
    if (multiEvents.find((multiEvent) => isLocationMatch(eventItem, multiEvent))) {
      continue;
    }
    const matchedLocationEvents = eventDataArr.filter((item) => isLocationMatch(item, eventItem));
    if (matchedLocationEvents.length <= 1) {
      regularEvents.push(eventItem);
    } else {
      multiEvents.push(getMultiEvent(matchedLocationEvents));
    }
  }

  return { multiEvents, regularEvents };
};
