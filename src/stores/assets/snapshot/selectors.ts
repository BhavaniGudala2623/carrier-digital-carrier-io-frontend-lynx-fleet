import { createSelector } from '@reduxjs/toolkit';

import type { AppState } from '../../store';

export const getAssetSnapshotsState = (state: AppState) => state.assetSnapshots;

export const getAssetSnapshots = createSelector(getAssetSnapshotsState, (state) => state.snapshots);

export const getAlertSummaries = createSelector(getAssetSnapshotsState, (state) => state.alertSummaries);

export const getStatusSummaries = createSelector(getAssetSnapshotsState, (state) => state.statusSummaries);
