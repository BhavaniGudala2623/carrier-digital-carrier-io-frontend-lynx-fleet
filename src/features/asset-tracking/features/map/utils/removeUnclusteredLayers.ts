/* eslint-disable no-underscore-dangle */
import mapboxgl from 'mapbox-gl';

import { UNCLUSTERED_POINTS_LAYER, UNCLUSTERED_POINT_LAYER } from '../../../constants';

import { getAssetTypes } from '@/utils';

export const removeUnclusteredLayers = (map: mapboxgl.Map) => {
  const assetTypes = getAssetTypes();

  assetTypes.forEach((_assetType, index) => {
    // @ts-ignore
    if (map.style && map.style._loaded && map.getLayer(UNCLUSTERED_POINT_LAYER + index)) {
      map.removeLayer(UNCLUSTERED_POINT_LAYER + index);
    }

    // @ts-ignore
    if (map.style && map.style._loaded && map.getLayer(UNCLUSTERED_POINTS_LAYER + index)) {
      map.removeLayer(UNCLUSTERED_POINTS_LAYER + index);
    }
  });
};
