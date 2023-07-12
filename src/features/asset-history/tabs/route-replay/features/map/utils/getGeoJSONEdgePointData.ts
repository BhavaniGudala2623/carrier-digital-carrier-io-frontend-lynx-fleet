import { Feature, FeatureCollection, Geometry } from 'geojson';

import { EdgePointGeoProperties, EnrichedEventData, EventGeoProperties } from '../../../types';
import {
  FINISH_MARKER_IMAGE,
  HOVERED_FINISH_MARKER_IMAGE,
  HOVERED_START_MARKER_IMAGE,
  SELECTED_FINISH_MARKER_IMAGE,
  SELECTED_START_MARKER_IMAGE,
  START_MARKER_IMAGE,
} from '../constants';

import { getGeoJsonGeometry } from './getGeoJsonGeometry';
import { getFeatureProperties } from './getFeatureProperties';

const getEdgePointProperties = (event: EnrichedEventData, pointIndex: number): EdgePointGeoProperties => ({
  ...getFeatureProperties(event),
  iconImage: pointIndex === 0 ? START_MARKER_IMAGE : FINISH_MARKER_IMAGE,
  selectedIconImage: pointIndex === 0 ? SELECTED_START_MARKER_IMAGE : SELECTED_FINISH_MARKER_IMAGE,
  hoveredIconImage: pointIndex === 0 ? HOVERED_START_MARKER_IMAGE : HOVERED_FINISH_MARKER_IMAGE,
});

export const getGeoJSONEdgePointData = (
  events: EnrichedEventData[]
): FeatureCollection<Geometry, EventGeoProperties> => {
  const geoJsonFeatures: FeatureCollection<Geometry, EdgePointGeoProperties>['features'] = events.map(
    (event, index) => {
      const feature: Feature<Geometry, EdgePointGeoProperties> = {
        type: 'Feature',
        geometry: getGeoJsonGeometry(event),
        properties: getEdgePointProperties(event, index),
        id: event.eventId,
      };

      return feature;
    }
  );

  return {
    type: 'FeatureCollection' as const,
    features: [...geoJsonFeatures].reverse(),
  };
};
