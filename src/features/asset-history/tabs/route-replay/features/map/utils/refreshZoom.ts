import { FeatureCollection, Geometry, Feature } from 'geojson';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

import { EventGeoProperties } from '../../../types';
import { MAP_CENTER_DEFAULT } from '../constants';

import { getRouteBound } from './getRouteBound';
import { flyToEvent } from './flyToEvent';

export const refreshZoom = (
  eventData: FeatureCollection<Geometry, EventGeoProperties>,
  edgePointsData: FeatureCollection<Geometry, EventGeoProperties>,
  multiEventData: FeatureCollection<Geometry, EventGeoProperties>,
  map: mapboxgl.Map,
  loadedRoutes?: Feature
) => {
  if (loadedRoutes) {
    const mapBound = getRouteBound([loadedRoutes]);
    if (mapBound) {
      map.fitBounds(mapBound, { padding: 75 });

      return;
    }
  }
  if (eventData?.features && eventData.features.length >= 2) {
    const mapBound = getRouteBound([
      ...eventData.features,
      ...edgePointsData.features,
      ...multiEventData.features,
    ]);
    if (mapBound) {
      map.fitBounds(mapBound, { padding: 75 });

      return;
    }
  } else if (
    eventData?.features &&
    eventData.features[0] &&
    eventData.features[0].geometry?.type === 'Point' &&
    eventData.features[0].geometry.coordinates
  ) {
    const { geometry } = eventData.features[0];
    const { coordinates } = geometry;
    if (coordinates) {
      flyToEvent(null, coordinates as LngLatLike, map);

      return;
    }
  }

  flyToEvent(null, MAP_CENTER_DEFAULT, map);
};
