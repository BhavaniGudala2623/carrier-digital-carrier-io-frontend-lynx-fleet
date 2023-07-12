import type { SnapshotDataEx } from '@/features/common';
import { AssetState } from '@/types';

export const getAssetState = (snapshot: SnapshotDataEx, isAssetHealthEnabled: boolean): AssetState => {
  if (isAssetHealthEnabled) {
    const activeFreezerAlarms = snapshot?.activeFreezerAlarms || [];
    if (
      activeFreezerAlarms.length &&
      activeFreezerAlarms.some((alarm) => alarm?.healthStatus === 'CRITICAL')
    ) {
      return 'Alarm';
    }
  } else if (snapshot.activeFreezerAlarms?.length) {
    return 'Alarm';
  }

  return snapshot.computedFields?.movementStatus ? 'Yes' : 'No';
};
