import { LngLatLike } from 'mapbox-gl';

import { EnrichedEventData, MultiEvent, TableEventType } from '../../../types';
import { EDGE_POINT_SOURCE_NAME, MULTI_EVENT_SOURCE_NAME, SINGLE_EVENT_SOURCE_NAME } from '../constants';

const getTopRecordEventId = (events: EnrichedEventData[]) => {
  if (events) {
    const sortedEvents = [...events].sort(
      (a, b) => a.time - b.time || a.sourceType.localeCompare(b.sourceType)
    );

    return sortedEvents[0].eventId;
  }

  return null;
};

export const setMapEventData = (
  eventId: string | undefined,
  multiEvents: MultiEvent[],
  edgePoints: EnrichedEventData[],
  regularEvents: EnrichedEventData[],
  isMapEvent: boolean = false
): TableEventType | null => {
  if (!eventId) {
    return null;
  }
  const multiEvent = isMapEvent
    ? multiEvents.find((item) => item.multiEventId === eventId)
    : multiEvents.find((item) => item.events.some((event) => event.eventId === eventId));
  if (multiEvent) {
    const topRecordEventId = isMapEvent ? getTopRecordEventId(multiEvent.events) : eventId;

    return {
      multiEventId: multiEvent.multiEventId,
      eventId: topRecordEventId || eventId,
      layerId: MULTI_EVENT_SOURCE_NAME,
      coordinates: [multiEvent.position_longitude, multiEvent.position_latitude] as LngLatLike,
      events: multiEvent.events,
      isMapEvent,
    };
  }
  const edgePoint = edgePoints.find((item) => item.eventId === eventId);
  if (edgePoint) {
    return {
      eventId: edgePoint.eventId!,
      layerId: EDGE_POINT_SOURCE_NAME,
      coordinates: [edgePoint.position_longitude, edgePoint.position_latitude] as LngLatLike,
    };
  }
  const event = regularEvents.find((item) => item.eventId === eventId);
  if (event) {
    return {
      eventId: event.eventId!,
      layerId: SINGLE_EVENT_SOURCE_NAME,
      coordinates: [event.position_longitude, event.position_latitude] as LngLatLike,
    };
  }

  return null;
};
