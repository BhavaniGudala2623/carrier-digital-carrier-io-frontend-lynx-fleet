import mapboxgl, { LngLatLike, MapboxOptions, SymbolLayout } from 'mapbox-gl';

/* map sources */
export const SINGLE_EVENT_SOURCE_NAME = 'events';
export const ROUTE_SOURCE_NAME = 'route';
export const EDGE_POINT_SOURCE_NAME = 'edgePoint';
export const MULTI_EVENT_SOURCE_NAME = 'multiEvent';

/* map layers */
export const SINGLE_EVENT_LAYER_ID = 'events';
export const EDGE_POINT_LAYER_ID = 'edgePoint';
export const MULTI_EVENT_LAYER_ID = 'multiEvent';
export const MULTI_EVENT_TEXT_HALO_LAYER_ID = 'multiEventHalo';
export const MULTI_EVENT_TEXT_LAYER_ID = 'multiEventText';
export const MULTI_EVENT_CLUSTER_LAYER_ID = 'multiEventCluster';
export const MULTI_EVENT_CLUSTER_HALO_LAYER_ID = 'multiEventClusterHalo';
export const MULTI_EVENT_CLUSTER_COUNT_LAYER_ID = 'multiEventClusterCount';
export const ROUTE_LAYER_ID = 'route';
export const EVENTS_SATELLITE_LAYER_ID = 'satellite';

/* map properties */
export const MAP_CENTER_DEFAULT: LngLatLike = [0, 50];
export const MIN_LONGITUDE = -180;
export const MAX_LONGITUDE = 180;
export const MIN_LATITUDE = -90;
export const MAX_LATITUDE = 90;
export const MAX_COORDINATES_FOR_API = 200; // API requires up to 200 coordinates[pairs of longitude + latitude] in single request

export const replayMapOptions: Pick<MapboxOptions, 'center' | 'zoom' | 'minZoom' | 'maxZoom'> & {
  zoom: number;
  minZoom: number;
  maxZoom: number;
} = {
  center: [0, 50],
  zoom: 1,
  minZoom: 1,
  maxZoom: 22,
};

/* map events */
export const MAP_HOVER_EVENT = 'mapHoverEvent';
export const MAP_HOVER_OUT_EVENT = 'mapHoverOutEvent';
export const TABLE_HOVER_EVENT = 'tableHoverEvent';
export const TABLE_OUT_EVENT = 'tableOutEvent';
export const MARKER_SELECT_EVENT = 'markerSelectEvent';
export const MARKER_UNSELECT_EVENT = 'markerUnselectEvent';
export const ALL_CUSTOM_EVENTS = [
  MAP_HOVER_EVENT,
  MAP_HOVER_OUT_EVENT,
  TABLE_HOVER_EVENT,
  TABLE_OUT_EVENT,
  MARKER_SELECT_EVENT,
  MARKER_UNSELECT_EVENT,
];

/* map marker style */
export const START_MARKER_IMAGE = 'startMarker';
export const SELECTED_START_MARKER_IMAGE = 'selectedStartMarker';
export const HOVERED_START_MARKER_IMAGE = 'hoveredStartMarker';
export const FINISH_MARKER_IMAGE = 'finishMarker';
export const SELECTED_FINISH_MARKER_IMAGE = 'selectedFinishMarker';
export const HOVERED_FINISH_MARKER_IMAGE = 'hoveredFinishMarker';

export const markerLayout: mapboxgl.SymbolLayout = {
  'icon-ignore-placement': true,
  'icon-allow-overlap': true,
  'icon-padding': 0,
  'icon-anchor': 'bottom',
  'symbol-z-order': 'source',
};

export const multiEventLayout: SymbolLayout = {
  'icon-ignore-placement': true,
  'icon-allow-overlap': true,
  'text-allow-overlap': true,
  'text-ignore-placement': true,
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 0],
  'text-size': 12,
  'text-letter-spacing': 0.25,
  'text-line-height': 18,
  'symbol-z-order': 'source',
};
