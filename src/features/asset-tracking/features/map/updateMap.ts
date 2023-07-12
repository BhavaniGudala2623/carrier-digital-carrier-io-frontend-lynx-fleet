import mapboxgl, { GeoJSONSource } from 'mapbox-gl';

import { AssetLayerFilterType } from '../../types';
import { ASSETS_SOURCE_NAME } from '../../constants';

import { getGeoJSONAssetData } from './utils/geoJson';
import { createMapAssets } from './utils';
import { mapPopup } from './mapPopup';

import type { SnapshotDataEx } from '@/features/common';
import { isAppDebugLogActive } from '@/utils';

export function updateMap(
  map: mapboxgl.Map,
  entities: SnapshotDataEx[],
  filteredTypes: AssetLayerFilterType[],
  onAssetsCreated: () => void,
  handleClusterMouseEnter: (clusterId: number) => void,
  handleClusterMouseLeave: (clusterId: number) => void,
  handleClusterClick: (clusterId: number) => void,
  handleClusterRemoveFromScreen: (clusterId: number) => void,
  isAssetHealthEnabled: boolean
) {
  // filter incoming entities based on map legend filters
  if (map) {
    const filteredEntities = entities
      .filter(
        (entity) =>
          (entity?.activeFreezerAlarms?.length && filteredTypes.includes('Alarm')) ||
          (entity.activeFreezerAlarms?.length === 0 &&
            entity?.computedFields?.movementStatus &&
            filteredTypes.includes('Yes')) ||
          (entity.activeFreezerAlarms?.length === 0 &&
            !entity?.computedFields?.movementStatus &&
            filteredTypes.includes('No'))
      )
      .map((entity) => entity);

    const data = getGeoJSONAssetData(filteredEntities, isAssetHealthEnabled);

    // @ts-ignore
    const source = map.style && (map.getSource(ASSETS_SOURCE_NAME) as GeoJSONSource);

    if (source) {
      if (isAppDebugLogActive()) {
        // eslint-disable-next-line no-console
        console.log('mapbox data', data);
      }

      mapPopup.remove();
      source.setData(data);
    } else {
      createMapAssets(
        map,
        data,
        handleClusterMouseEnter,
        handleClusterMouseLeave,
        handleClusterClick,
        handleClusterRemoveFromScreen
      );
      onAssetsCreated();
    }
  }
}
