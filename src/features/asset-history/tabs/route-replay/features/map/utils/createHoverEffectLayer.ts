import mapboxgl from 'mapbox-gl';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import {
  EDGE_POINT_LAYER_ID,
  EDGE_POINT_SOURCE_NAME,
  markerLayout,
  MULTI_EVENT_LAYER_ID,
  MULTI_EVENT_SOURCE_NAME,
  MULTI_EVENT_TEXT_LAYER_ID,
  multiEventLayout,
  SINGLE_EVENT_LAYER_ID,
  SINGLE_EVENT_SOURCE_NAME,
} from '../constants';

export const createHoverEffectLayer = (map: mapboxgl.Map) => {
  const index = 'hover';
  const hover = ['boolean', ['feature-state', 'hover'], false];

  map.addLayer({
    id: `${SINGLE_EVENT_LAYER_ID}_${index}`,
    type: 'circle',
    source: SINGLE_EVENT_SOURCE_NAME,
    layout: { visibility: 'visible' },
    paint: {
      'circle-color': ['case', hover, fleetThemeOptions.palette.primary.contrastText, 'transparent'],
      'circle-radius': ['case', hover, 7, 0],
      'circle-stroke-width': ['case', hover, 5, 0],
      'circle-stroke-color': ['case', hover, fleetThemeOptions.palette.primary.main, 'transparent'],
    },
  });

  map.addLayer({
    id: `${MULTI_EVENT_LAYER_ID}_${index}`,
    type: 'circle',
    source: MULTI_EVENT_SOURCE_NAME,
    layout: { visibility: 'visible' },
    paint: {
      'circle-color': ['case', hover, fleetThemeOptions.palette.primary.contrastText, 'transparent'],
      'circle-radius': ['case', hover, 15, 0],
      'circle-stroke-width': ['case', hover, 3, 0],
      'circle-stroke-color': ['case', hover, fleetThemeOptions.palette.primary.main, 'transparent'],
    },
  });

  map.addLayer({
    id: `${MULTI_EVENT_TEXT_LAYER_ID}_${index}`,
    source: MULTI_EVENT_SOURCE_NAME,
    type: 'symbol',
    layout: { ...multiEventLayout, 'text-field': ['get', 'eventsCounter'] },
    paint: { 'text-color': ['case', hover, fleetThemeOptions.palette.primary.main, 'transparent'] },
  });

  map.addLayer({
    id: `${EDGE_POINT_LAYER_ID}_${index}`,
    source: EDGE_POINT_SOURCE_NAME,
    type: 'symbol',
    layout: { ...markerLayout, 'icon-image': ['get', 'hoveredIconImage'] },
    paint: { 'icon-opacity': ['case', hover, 1, 0] },
  });
};
