import {
  AlertSummary,
  Maybe,
  StatusSummary,
  HealthSummary,
  SnapshotDataGql,
} from '@carrier-io/lynx-fleet-types';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export interface AssetSnapshotsState {
  isLoading: boolean;
  snapshots: Maybe<SnapshotDataGql>[];
  alertSummaries: Maybe<AlertSummary>[];
  statusSummaries: Maybe<StatusSummary>[];
  healthSummaries: Maybe<HealthSummary>[];
  error: Maybe<string>;
  responseCount: Maybe<number>;
}

const initialState: AssetSnapshotsState = {
  isLoading: false,
  snapshots: [],
  alertSummaries: [],
  statusSummaries: [],
  healthSummaries: [],
  error: null,
  responseCount: 0,
};

export const assetSnapshotsSlice = createSlice<AssetSnapshotsState, SliceCaseReducers<AssetSnapshotsState>>({
  name: 'assetSnapshots',
  initialState,
  reducers: {
    catchError: (state, action) => ({
      ...state,
      error: `${action.type}: ${action.payload.error}`,
      isLoading: false,
    }),
    startCall: (state) => ({
      ...state,
      error: null,
      isLoading: true,
    }),
    assetSnapshotsFetched: (state, action) => {
      const { snapshots, alertSummaries, statusSummaries, healthSummaries } = action.payload;

      return {
        ...state,
        isLoading: false,
        error: null,
        snapshots: snapshots ?? [],
        alertSummaries: alertSummaries ?? [],
        statusSummaries: statusSummaries ?? [],
        healthSummaries: healthSummaries ?? [],
        responseCount: (state.responseCount ?? 0) + 1,
      };
    },
  },
});
