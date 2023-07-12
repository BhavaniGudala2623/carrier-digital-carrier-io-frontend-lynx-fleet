import mapboxgl from 'mapbox-gl';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import {
  EDGE_POINT_LAYER_ID,
  EDGE_POINT_SOURCE_NAME,
  markerLayout,
  MULTI_EVENT_CLUSTER_COUNT_LAYER_ID,
  MULTI_EVENT_CLUSTER_HALO_LAYER_ID,
  MULTI_EVENT_CLUSTER_LAYER_ID,
  MULTI_EVENT_LAYER_ID,
  MULTI_EVENT_SOURCE_NAME,
  MULTI_EVENT_TEXT_HALO_LAYER_ID,
  MULTI_EVENT_TEXT_LAYER_ID,
  multiEventLayout,
  SINGLE_EVENT_LAYER_ID,
  SINGLE_EVENT_SOURCE_NAME,
} from '../constants';

export const createActiveEffectLayer = (map: mapboxgl.Map) => {
  const index = 'active';
  const active = ['boolean', ['feature-state', 'active'], false];

  map.addLayer({
    id: `${SINGLE_EVENT_LAYER_ID}_${index}`,
    type: 'circle',
    source: SINGLE_EVENT_SOURCE_NAME,
    layout: { visibility: 'visible' },
    paint: {
      'circle-color': ['case', active, fleetThemeOptions.palette.primary.contrastText, 'transparent'],
      'circle-radius': ['case', active, 7, 0],
      'circle-stroke-width': ['case', active, 5, 0],
      'circle-stroke-color': ['case', active, fleetThemeOptions.palette.primary.main, 'transparent'],
    },
  });

  map.addLayer({
    id: `${MULTI_EVENT_LAYER_ID}_${index}`,
    type: 'circle',
    source: MULTI_EVENT_SOURCE_NAME,
    filter: ['!', ['has', 'point_count']],
    layout: { visibility: 'visible' },
    paint: {
      'circle-color': ['case', active, fleetThemeOptions.palette.primary.contrastText, 'transparent'],
      'circle-radius': ['case', active, 15, 0],
      'circle-stroke-width': ['case', active, 3, 0],
      'circle-stroke-color': ['case', active, fleetThemeOptions.palette.primary.main, 'transparent'],
    },
  });

  map.addLayer({
    id: `${MULTI_EVENT_TEXT_HALO_LAYER_ID}_${index}`,
    type: 'circle', // text halo as small circle
    source: MULTI_EVENT_SOURCE_NAME,
    filter: ['!', ['has', 'point_count']],
    layout: { visibility: 'visible' },
    paint: {
      'circle-color': ['case', active, fleetThemeOptions.palette.primary.main, 'transparent'],
      'circle-radius': ['case', active, 12, 0],
    },
  });

  map.addLayer({
    id: `${MULTI_EVENT_TEXT_LAYER_ID}_${index}`,
    source: MULTI_EVENT_SOURCE_NAME,
    filter: ['!', ['has', 'point_count']],
    type: 'symbol',
    layout: { ...multiEventLayout, 'text-field': ['get', 'eventsCounter'] },
    paint: { 'text-color': ['case', active, fleetThemeOptions.palette.primary.contrastText, 'transparent'] },
  });

  map.addLayer({
    id: MULTI_EVENT_CLUSTER_LAYER_ID,
    type: 'circle',
    source: MULTI_EVENT_SOURCE_NAME,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': 'transparent',
      'circle-radius': 0,
      'circle-stroke-width': 0,
      'circle-stroke-color': 'transparent',
    },
  });

  map.addLayer({
    id: MULTI_EVENT_CLUSTER_HALO_LAYER_ID,
    type: 'circle', // text halo as small circle
    source: MULTI_EVENT_SOURCE_NAME,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': 'transparent',
      'circle-radius': 0,
    },
  });

  map.addLayer({
    id: MULTI_EVENT_CLUSTER_COUNT_LAYER_ID,
    source: MULTI_EVENT_SOURCE_NAME,
    filter: ['has', 'point_count'],
    type: 'symbol',
    layout: { ...multiEventLayout, 'text-field': ['get', 'eventsCounterSum'] },
    paint: { 'text-color': fleetThemeOptions.palette.primary.contrastText },
  });

  map.addLayer({
    id: `${EDGE_POINT_LAYER_ID}_${index}`,
    source: EDGE_POINT_SOURCE_NAME,
    type: 'symbol',
    layout: { ...markerLayout, 'icon-image': ['get', 'selectedIconImage'] },
    paint: { 'icon-opacity': ['case', active, 1, 0] },
  });
};
