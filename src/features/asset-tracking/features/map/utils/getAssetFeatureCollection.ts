import { Feature, FeatureCollection, Geometry } from 'geojson';

import { getAssetState } from '../../../utils/getAssetState';
import { AssetFeatureProperties } from '../../../types';

import type { SnapshotDataEx } from '@/features/common';

const getFeatureProperties = (
  snapshot: SnapshotDataEx,
  isAssetHealthEnabled: boolean
): AssetFeatureProperties => ({
  assetId: snapshot.asset?.id,
  assetState: getAssetState(snapshot, isAssetHealthEnabled),
  latitude: snapshot.flespiData?.position_latitude,
  longitude: snapshot.flespiData?.position_longitude,
});

export const getAssetFeatureCollection = (
  snapshots: SnapshotDataEx[],
  isAssetHealthEnabled: boolean
): FeatureCollection<Geometry, AssetFeatureProperties> => {
  const geoJsonFeatures: FeatureCollection<Geometry, AssetFeatureProperties>['features'] = snapshots
    .filter((snapshot) => snapshot?.flespiData?.position_longitude || snapshot?.flespiData?.position_latitude)
    .map((snapshot) => {
      const feature: Feature<Geometry, AssetFeatureProperties> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [snapshot.flespiData!.position_longitude!, snapshot.flespiData!.position_latitude!],
        },
        properties: getFeatureProperties(snapshot, isAssetHealthEnabled),
      };

      return feature;
    });

  const geoJson = {
    type: 'FeatureCollection' as const,
    features: geoJsonFeatures,
  };

  return geoJson;
};
