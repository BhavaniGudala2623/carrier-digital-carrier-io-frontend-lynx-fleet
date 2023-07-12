import mapboxgl from 'mapbox-gl';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import {
  EDGE_POINT_LAYER_ID,
  EDGE_POINT_SOURCE_NAME,
  EVENTS_SATELLITE_LAYER_ID,
  markerLayout,
  MULTI_EVENT_LAYER_ID,
  MULTI_EVENT_SOURCE_NAME,
  MULTI_EVENT_TEXT_LAYER_ID,
  multiEventLayout,
  replayMapOptions,
  ROUTE_LAYER_ID,
  ROUTE_SOURCE_NAME,
  SINGLE_EVENT_LAYER_ID,
  SINGLE_EVENT_SOURCE_NAME,
} from '../constants';

export const createEventStaticLayer = (map: mapboxgl.Map) => {
  map.addLayer({
    id: EVENTS_SATELLITE_LAYER_ID,
    type: 'raster',
    layout: {
      visibility: 'none',
    },
    source: {
      type: 'raster',
      tiles: [
        `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_KEY}`,
      ],
      tileSize: 512,
    },
    'source-layer': 'satellite',
    maxzoom: replayMapOptions.maxZoom,
  });

  map.addLayer({
    id: ROUTE_LAYER_ID,
    type: 'line',
    source: ROUTE_SOURCE_NAME,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': fleetThemeOptions.palette.primary.main,
      'line-width': 4.5,
      'line-opacity': 0.95,
    },
  });

  map.addLayer({
    id: SINGLE_EVENT_LAYER_ID,
    type: 'circle',
    source: SINGLE_EVENT_SOURCE_NAME,
    layout: { visibility: 'visible' },
    paint: {
      'circle-color': fleetThemeOptions.palette.primary.main,
      'circle-radius': 8,
    },
  });

  map.addLayer({
    id: MULTI_EVENT_LAYER_ID,
    type: 'circle',
    source: MULTI_EVENT_SOURCE_NAME,
    layout: { visibility: 'visible' },
    paint: {
      'circle-color': fleetThemeOptions.palette.secondary.main,
      'circle-radius': 15,
      'circle-stroke-width': 3,
      'circle-stroke-color': fleetThemeOptions.palette.primary.main,
    },
  });

  map.addLayer({
    id: MULTI_EVENT_TEXT_LAYER_ID,
    source: MULTI_EVENT_SOURCE_NAME,
    type: 'symbol',
    layout: { ...multiEventLayout, 'text-field': ['get', 'eventsCounter'] },
    paint: { 'text-color': fleetThemeOptions.palette.primary.contrastText },
  });

  map.addLayer({
    id: EDGE_POINT_LAYER_ID,
    source: EDGE_POINT_SOURCE_NAME,
    type: 'symbol',
    layout: { ...markerLayout, 'icon-image': ['get', 'iconImage'] },
  });
};
