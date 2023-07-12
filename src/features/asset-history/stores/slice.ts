import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEqual } from 'lodash-es';

import { AssetHistoryState } from '../types';

export interface IError {
  clientMessage?: string;
  err?: {
    clientMessage?: string;
  };
}

export interface IAssetError extends IError {
  type?: string;
}

const initialAssetHistoryState: AssetHistoryState = {
  eventHistoryLoaded: false,
  eventHistoryError: null,
  assetViewsLoaded: false,
  assetViewsError: null,
  assetsLoaded: false,
  assetsError: null,
  exportAssetHistoryError: null,
  totalCount: 0,
  emptyDataMessageShown: false,
};

export const assetHistorySlice = createSlice({
  name: 'assetHistory',
  initialState: initialAssetHistoryState,
  reducers: {
    startFetchEventHistoryCall: (state: AssetHistoryState) => ({
      ...state,
      eventHistoryError: null,
      eventHistoryLoaded: false,
      history: [],
      tenant: null,
      fleet: null,
      device: null,
      flespiData: null,
      timelineEvents: null,
      totalCount: 0,
      emptyDataMessageShown: false,
    }),
    eventHistoryFetched: (state: AssetHistoryState, action: PayloadAction<AssetHistoryState>) => {
      const {
        tenant,
        fleets,
        history,
        asset,
        flespiData,
        availableColumns,
        device,
        timelineEvents,
        chartConfig,
        totalCount,
        binTimeMinutes,
      } = action.payload;

      const newState: AssetHistoryState = {
        ...state,
        eventHistoryLoaded: true,
        eventHistoryError: null,
        history,
        tenant,
        fleets,
        asset,
        device,
        flespiData,
        timelineEvents,
        totalCount,
        binTimeMinutes,
      };

      if (
        !state.availableColumns ||
        state.asset?.id !== asset?.id ||
        !isEqual(state.availableColumns, availableColumns)
      ) {
        newState.availableColumns = availableColumns;
      }

      if (!state.chartConfig || state.asset?.id !== asset?.id || !isEqual(state.chartConfig, chartConfig)) {
        newState.chartConfig = chartConfig;
      }

      return newState;
    },
    catchFetchEventHistoryError: (state: AssetHistoryState, action: PayloadAction<IError>) => ({
      ...state,
      asset: null,
      eventHistoryError: `${action.payload.err?.clientMessage}`,
      eventHistoryLoaded: true,
    }),
    // fetchAssetViews actions
    startFetchAssetViewsCall: (state: AssetHistoryState) => ({
      ...state,
      assetViewsError: null,
      assetViewsLoaded: false,
    }),
    assetViewsFetched: (
      state: AssetHistoryState,
      { payload }: PayloadAction<Pick<AssetHistoryState, 'assetViews'>>
    ) => {
      const { assetViews } = payload;

      return {
        ...state,
        assetViewsError: null,
        assetViews,
        assetViewsLoaded: true,
      };
    },
    catchFetchAssetViewsError: (state: AssetHistoryState, action: PayloadAction<IError>) => ({
      ...state,
      assetViewsError: `${action.payload.err?.clientMessage}`,
      assetViewsLoaded: true,
    }),
    // fetchAssets actions
    startFetchAssetsCall: (state: AssetHistoryState) => ({
      ...state,
      assetLoaded: false,
      assetsError: null,
    }),
    assetsFetched: (
      state: AssetHistoryState,
      { payload }: PayloadAction<Pick<AssetHistoryState, 'assets'>>
    ) => {
      const { assets } = payload;

      return {
        ...state,
        assets: assets?.slice().sort((a, b) => (a.asset?.name ?? '').localeCompare(b.asset?.name ?? '')),
        assetsLoaded: true,
      };
    },
    catchAssetsError: (state: AssetHistoryState, action: PayloadAction<IAssetError>) => ({
      ...state,
      assetsError: `${action.type}: ${action.payload.err?.clientMessage}`,
      assetsLoaded: true,
    }),
    catchExportAssetHistoryError: (state: AssetHistoryState, action: PayloadAction<IAssetError>) => ({
      ...state,
      exportAssetHistoryError: `${action.type}: ${action.payload.err?.clientMessage}`,
    }),
    setEmptyDataMessageShown: (state: AssetHistoryState, action: PayloadAction<boolean>) => ({
      ...state,
      emptyDataMessageShown: action.payload,
    }),
  },
});
