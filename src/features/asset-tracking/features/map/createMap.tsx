import mapboxgl, { MapboxOptions } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { RadiusMode } from '../../utils/radiusMode';
import {
  ASSETS_SOURCE_NAME,
  GEOFENCES_SOURCE_NAME,
  GEOFENCE_POINTS_SOURCE_NAME,
  mapboxDrawStyles,
  mapOptions,
} from '../../constants';

import { MapStyleControl } from '@/components';

export function createMap(
  container: MapboxOptions['container'],
  onMapLoaded: (map: mapboxgl.Map, draw: MapboxDraw) => void
) {
  const isGeofenceEnabled = true;
  const map = new mapboxgl.Map({
    ...mapOptions,
    accessToken: process.env.REACT_APP_MAPBOX_KEY,
    container,
    style: 'mapbox://styles/mapbox/streets-v11',
    attributionControl: false,
    logoPosition: 'top-left',
  });

  const NewDirectSelect = {
    // @ts-ignore
    ...MapboxDraw.modes.direct_select,
    dragMove() {
      return undefined;
    },
    startDragging() {
      return undefined;
    },
  };

  const draw = new MapboxDraw({
    userProperties: true,
    modes: {
      ...MapboxDraw.modes,
      draw_circle: RadiusMode,
      direct_select: NewDirectSelect,
    },
    displayControlsDefault: false,
    styles: mapboxDrawStyles,
  });

  if (isGeofenceEnabled) {
    map.addControl(draw, 'top-right');
  }

  map.addControl(new mapboxgl.GeolocateControl(), 'bottom-right');
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.addControl(new MapStyleControl(), 'bottom-left');

  map.on('load', () => {
    onMapLoaded(map, draw);
  });

  return map;
}

export const removeSources = (map: mapboxgl.Map) => {
  [ASSETS_SOURCE_NAME, GEOFENCES_SOURCE_NAME, GEOFENCE_POINTS_SOURCE_NAME].forEach((id) => {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    if (map.style && map.style._loaded && map.getSource(id)) {
      const allLayers = map.getStyle()?.layers;
      if (allLayers) {
        for (const layer of allLayers) {
          // @ts-ignore
          if (layer.source === id) {
            map.removeLayer(layer.id);
          }
        }
      }
      map.removeSource(id);
    }
  });
};
