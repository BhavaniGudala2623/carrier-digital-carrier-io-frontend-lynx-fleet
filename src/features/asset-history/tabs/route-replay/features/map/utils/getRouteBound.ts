import { Feature, Geometry } from 'geojson';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../constants';
import { EdgePointGeoProperties, EventGeoProperties, MultiEventGeoProperties } from '../../../types';

export const getRouteBound = (
  features?:
    | Feature<Geometry, EventGeoProperties | EdgePointGeoProperties | MultiEventGeoProperties>[]
    | Feature[]
): mapboxgl.LngLatBoundsLike | undefined => {
  if (!features || features.length === 0) {
    return undefined;
  }
  let allLongitudes: number[] = [];
  let allLatitudes: number[] = [];

  Array.from(features).forEach((feature) => {
    const { geometry } = feature;
    if (geometry.type === 'Point' && geometry.coordinates) {
      allLongitudes.push(geometry.coordinates[0]);
      allLatitudes.push(geometry.coordinates[1]);
    }
    if (geometry.type === 'LineString' && geometry.coordinates) {
      const routeLatitudes: number[] = geometry.coordinates.map(([, lat]) => lat);
      const routeLongitudes: number[] = geometry.coordinates.map(([lon]) => lon);
      allLongitudes = [...routeLongitudes];
      allLatitudes = [...routeLatitudes];
    }
  });

  const bottomLeft: LngLatLike = [
    allLongitudes.reduce((a, b) => Math.min(a, b), MAX_LONGITUDE),
    allLatitudes.reduce((a, b) => Math.min(a, b), MAX_LATITUDE),
  ];
  const topRight: LngLatLike = [
    allLongitudes.reduce((a, b) => Math.max(a, b), MIN_LONGITUDE),
    allLatitudes.reduce((a, b) => Math.max(a, b), MIN_LATITUDE),
  ];

  if (bottomLeft && topRight) {
    return [bottomLeft, topRight];
  }

  return undefined;
};
