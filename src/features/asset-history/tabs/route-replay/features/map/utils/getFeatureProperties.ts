import { EnrichedEventData, EventGeoProperties } from '../../../types';

export const getFeatureProperties = (event: EnrichedEventData): EventGeoProperties => ({
  eventId: event.eventId ?? '',
  longitude: event.position_longitude!,
  latitude: event.position_latitude!,
});
