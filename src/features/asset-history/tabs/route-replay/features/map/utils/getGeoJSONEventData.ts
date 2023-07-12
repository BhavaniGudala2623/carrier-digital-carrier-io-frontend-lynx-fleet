import { Feature, FeatureCollection, Geometry } from 'geojson';

import { EnrichedEventData, EventGeoProperties } from '../../../types';

import { getFeatureProperties } from './getFeatureProperties';
import { getGeoJsonGeometry } from './getGeoJsonGeometry';

export const getGeoJSONEventData = (
  events: EnrichedEventData[]
): FeatureCollection<Geometry, EventGeoProperties> => {
  const geoJsonFeatures: FeatureCollection<Geometry, EventGeoProperties>['features'] = events.map((event) => {
    const feature: Feature<Geometry, EventGeoProperties> = {
      type: 'Feature',
      geometry: getGeoJsonGeometry(event),
      properties: getFeatureProperties(event),
      id: event.eventId,
    };

    return feature;
  });

  return {
    type: 'FeatureCollection' as const,
    features: geoJsonFeatures,
  };
};
