import { UNCLUSTERED_POINTS_LAYER, UNCLUSTERED_POINT_LAYER } from '../../../constants';

import { AssetType } from '@/types/common';

export function moveAssetLayersUp(map: mapboxgl.Map, assetTypes: AssetType[]) {
  assetTypes.forEach((_assetType, index) => {
    map.moveLayer(UNCLUSTERED_POINT_LAYER + index.toString());
    map.moveLayer(UNCLUSTERED_POINTS_LAYER + index.toString());
  });
}
