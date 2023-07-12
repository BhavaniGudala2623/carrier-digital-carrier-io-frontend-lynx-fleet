import mapboxgl from 'mapbox-gl';

import {
  EDGE_POINT_SOURCE_NAME,
  MULTI_EVENT_SOURCE_NAME,
  ROUTE_SOURCE_NAME,
  SINGLE_EVENT_SOURCE_NAME,
} from '../constants';

export const removeReplayMapLayers = (map: mapboxgl.Map) => {
  [ROUTE_SOURCE_NAME, SINGLE_EVENT_SOURCE_NAME, EDGE_POINT_SOURCE_NAME, MULTI_EVENT_SOURCE_NAME].forEach(
    (id) => {
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
    }
  );
};
