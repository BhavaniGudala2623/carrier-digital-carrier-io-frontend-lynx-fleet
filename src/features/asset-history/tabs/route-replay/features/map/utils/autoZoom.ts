import { FeatureCollection, Geometry, Feature } from 'geojson';
import mapboxgl from 'mapbox-gl';

import { EventGeoProperties } from '../../../types';
import { MAP_CENTER_DEFAULT } from '../constants';

import { refreshZoom } from './refreshZoom';

export const autoZoom = (
  eventData: FeatureCollection<Geometry, EventGeoProperties>,
  edgePointsData: FeatureCollection<Geometry, EventGeoProperties>,
  multiEventData: FeatureCollection<Geometry, EventGeoProperties>,
  map: mapboxgl.Map,
  loadedRoutes?: Feature
) => {
  try {
    refreshZoom(eventData, edgePointsData, multiEventData, map, loadedRoutes);
  } catch (error) {
    map.setCenter(MAP_CENTER_DEFAULT);
  }
};
