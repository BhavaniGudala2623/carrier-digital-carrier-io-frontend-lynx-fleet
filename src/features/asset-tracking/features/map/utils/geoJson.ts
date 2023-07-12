import { FeatureCollection, Geometry } from 'geojson';

import { AssetFeatureProperties } from '../../../types';

import { getAssetFeatureCollection } from './getAssetFeatureCollection';

import { SnapshotDataEx } from '@/features/common';

// Suppressed for now because it requires refactoring
// TODO: refactor to use redux store as one true source of data like we do for geofence
// eslint-disable-next-line import/no-mutable-exports
export let geoJson = {} as FeatureCollection<Geometry, AssetFeatureProperties>;

export const getGeoJSONAssetData = (snapshots: SnapshotDataEx[], isAssetHealthEnabled: boolean) => {
  geoJson = getAssetFeatureCollection(snapshots, isAssetHealthEnabled);

  return geoJson;
};
