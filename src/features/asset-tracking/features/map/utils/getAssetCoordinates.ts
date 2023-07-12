import { SnapshotDataEx } from '@/features/common';

export function getAssetCoordinates(asset?: SnapshotDataEx | null) {
  const coordinates = [asset?.flespiData?.position_longitude, asset?.flespiData?.position_latitude];

  if (coordinates[0] && coordinates[1]) {
    return coordinates as number[];
  }

  return null;
}
