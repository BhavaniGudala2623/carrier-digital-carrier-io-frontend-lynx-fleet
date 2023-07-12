import { colors } from '@mui/material';
import { MapboxOptions } from 'mapbox-gl';

const { indigo } = colors;

export const ASSETS_SOURCE_NAME = 'devices';
export const GEOFENCES_SOURCE_NAME = 'geofences';
export const GEOFENCE_POINTS_SOURCE_NAME = 'geofencePoints';

export const GEOFENCE_LAYER_ID = 'geofencePolygon';
export const GEOFENCE_MARKERS_LAYER_ID = 'geofenceMarkers';
export const GEOFENCE_NAMES_LAYER_ID = 'geofenceNames';
export const SATELLITE_LAYER_ID = 'satellite';
export const UNCLUSTERED_POINT_LAYER = 'unclustered-point';
export const UNCLUSTERED_POINTS_LAYER = 'unclustered-points';

export const UNASSIGNED_GROUP_ID = '0';

export const mapOptions: Pick<MapboxOptions, 'center' | 'zoom' | 'minZoom' | 'maxZoom'> = {
  center: [0, 50],
  zoom: 1,
  minZoom: 1,
  maxZoom: 20,
};

export const mapboxDrawStyles = [
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': indigo[500],
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': indigo[500],
      'fill-outline-color': indigo[500],
      'fill-opacity': 0.5,
    },
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 0,
      'circle-color': indigo[500],
    },
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 0,
      'circle-color': '#FFF',
    },
  },
];
