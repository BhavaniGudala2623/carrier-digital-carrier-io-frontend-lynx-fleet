import { Maybe } from '@carrier-io/lynx-fleet-types';

import { SnapshotDataEx } from '@/features/common';

export const getAssetCoordinatesFromSnapshotData = (
  snapshots?: Maybe<SnapshotDataEx[]>,
  id?: Maybe<string>
): Maybe<{ latitude: number; longitude: number }> => {
  const selectedAsset = snapshots?.find((item) => item.asset?.id === id);
  if (selectedAsset) {
    const { position_latitude, position_longitude } = selectedAsset.flespiData || {};

    return position_latitude && position_longitude
      ? { latitude: position_latitude, longitude: position_longitude }
      : null;
  }

  return null;
};
