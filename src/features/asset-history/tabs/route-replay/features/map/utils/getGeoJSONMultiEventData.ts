import { Feature, FeatureCollection, Geometry } from 'geojson';

import { EventGeoProperties, MultiEvent, MultiEventGeoProperties } from '../../../types';

import { getGeoJsonGeometry } from './getGeoJsonGeometry';

const getMultiEventFeatureProperties = (event: MultiEvent): MultiEventGeoProperties => ({
  eventId: event.multiEventId ?? '',
  longitude: event.position_longitude!,
  latitude: event.position_latitude!,
  eventsCounter: event.eventsCounter,
});

export const getGeoJSONMultiEventData = (
  events: MultiEvent[]
): FeatureCollection<Geometry, EventGeoProperties> => {
  const geoJsonFeatures: FeatureCollection<Geometry, MultiEventGeoProperties>['features'] = events.map(
    (event) => {
      const feature: Feature<Geometry, MultiEventGeoProperties> = {
        type: 'Feature',
        geometry: getGeoJsonGeometry(event),
        properties: getMultiEventFeatureProperties(event),
        id: event.multiEventId,
      };

      return feature;
    }
  );

  return {
    type: 'FeatureCollection' as const,
    features: geoJsonFeatures,
  };
};
