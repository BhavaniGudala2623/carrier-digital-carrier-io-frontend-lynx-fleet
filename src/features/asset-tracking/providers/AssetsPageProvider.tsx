import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react';
import { AlertType, Maybe, AssetStatusType, HealthStatusType } from '@carrier-io/lynx-fleet-types';

import { AssetLayerFilterType, AssetListFilter, AssetListView, AssetsPageState, TableTab } from '../types';

import { AssetsPageDataProvider } from './AssetsPageDataProvider';

import { useNullableContext } from '@/hooks/useNullableContext';
import { ExportTaskType } from '@/types';
import { useSessionPersistedState } from '@/hooks';

export type AssetsPageContextValue = AssetsPageState & {
  setPageView: (view: AssetListView) => void;
  setFilterSettings: (settings: Partial<AssetListFilter>) => void;
  setSelectedAlarm: (alarm: AlertType | null) => void;
  setSelectedStatus: (status: AssetStatusType | null) => void;
  setSelectedAssetHealthStatus: (status: HealthStatusType | null) => void;
  setTableTab: (tab: TableTab) => void;
  toogletAssetLayerFilter: (layer: AssetLayerFilterType) => void;
  setSelectedAssetSearchFilterId: (assetId: Maybe<string>) => void;
  setSelectedAssetRowId: (assetId: Maybe<string>) => void;
  taskToExport: ExportTaskType;
  setTaskToExport: Dispatch<SetStateAction<ExportTaskType>>;
  assetDetailsDialogAssetId: Maybe<string>;
  setAssetDetailsDialogAssetId: (assetId: Maybe<string>) => void;
};

export const AssetsPageContext = createContext<AssetsPageContextValue | null>(null);

const initialState: AssetsPageState = {
  filter: {
    searchText: '',
    selectedAssetLayers: ['Alarm', 'Yes', 'No'],
  },
  selectedAlarm: null,
  selectedStatus: null,
  selectedHealthStatus: null,
  selectedView: 'SplitView',
  selectedAssetSearchFilterId: null,
  selectedAssetRowId: null,
  tableTab: 'assets',
};

export const useAssetsPageContext = () => useNullableContext(AssetsPageContext);

export const AssetsPageProvider = ({ children }: { children: ReactNode }) => {
  const [assetsPageState, setAssetsPageState] = useSessionPersistedState<AssetsPageState>(
    initialState,
    'assetTracking.state'
  );
  const [tableTab, setTableTab] = useSessionPersistedState<TableTab>('assets', 'assetTracking.tableTab');
  const [selectedAssetSearchFilterId, setSelectedAssetSearchFilterId] = useSessionPersistedState<
    Maybe<string>
  >(null, 'assetTracking.selectedAssetSearchFilterId');
  const [selectedAssetRowId, setSelectedAssetRowId] = useSessionPersistedState<Maybe<string>>(
    null,
    'assetTracking.selectedAssetRowId'
  );
  const [taskToExport, setTaskToExport] = useState<ExportTaskType>('NONE');
  const [assetDetailsDialogAssetId, setAssetDetailsDialogAssetId] = useState<Maybe<string>>(null);

  const setFilterSettings = useCallback(
    (filterSettings: Partial<AssetListFilter>) => {
      setAssetsPageState((prevState) => ({
        ...prevState,
        filter: {
          ...prevState.filter,
          ...filterSettings,
        },
      }));
    },
    [setAssetsPageState]
  );

  const setPageView = useCallback(
    (newView: AssetListView) => {
      setAssetsPageState((prevState) => ({
        ...prevState,
        selectedView: newView,
      }));
    },
    [setAssetsPageState]
  );

  const setSelectedAlarm = useCallback(
    (alarm: AlertType | null) => {
      setAssetsPageState((prevState) => ({
        ...prevState,
        selectedAlarm: alarm,
      }));
    },
    [setAssetsPageState]
  );

  const setSelectedStatus = useCallback(
    (status: AssetStatusType | null) => {
      setAssetsPageState((prevState) => ({
        ...prevState,
        selectedStatus: status,
      }));
    },
    [setAssetsPageState]
  );

  const setSelectedAssetHealthStatus = useCallback(
    (status: HealthStatusType | null) => {
      setAssetsPageState((prevState) => ({
        ...prevState,
        selectedHealthStatus: status,
      }));
    },
    [setAssetsPageState]
  );

  const toogletAssetLayerFilter = useCallback(
    (assetLayer: AssetLayerFilterType) => {
      setAssetsPageState((prevState) => ({
        ...prevState,
        filter: {
          ...prevState.filter,
          selectedAssetLayers: prevState.filter.selectedAssetLayers.includes(assetLayer)
            ? prevState.filter.selectedAssetLayers.filter((layer) => layer !== assetLayer)
            : [...prevState.filter.selectedAssetLayers, assetLayer],
        },
      }));
    },
    [setAssetsPageState]
  );

  const contextValue = useMemo(
    () => ({
      ...assetsPageState,
      tableTab,
      selectedAssetSearchFilterId,
      selectedAssetRowId,
      taskToExport,
      setSelectedAlarm,
      setSelectedStatus,
      setSelectedAssetHealthStatus,
      setFilterSettings,
      setPageView,
      setTableTab,
      toogletAssetLayerFilter,
      setSelectedAssetSearchFilterId,
      setSelectedAssetRowId,
      setTaskToExport,
      assetDetailsDialogAssetId,
      setAssetDetailsDialogAssetId,
    }),
    [
      assetsPageState,
      selectedAssetSearchFilterId,
      selectedAssetRowId,
      tableTab,
      taskToExport,
      setSelectedAlarm,
      setSelectedStatus,
      setSelectedAssetHealthStatus,
      setFilterSettings,
      setPageView,
      setTableTab,
      toogletAssetLayerFilter,
      setSelectedAssetSearchFilterId,
      setSelectedAssetRowId,
      setTaskToExport,
      assetDetailsDialogAssetId,
      setAssetDetailsDialogAssetId,
    ]
  );

  return (
    <AssetsPageContext.Provider value={contextValue}>
      <AssetsPageDataProvider
        searchText={assetsPageState.filter.searchText}
        selectedAlarm={assetsPageState.selectedAlarm}
        selectedStatus={assetsPageState.selectedStatus}
        selectedHealthStatus={assetsPageState.selectedHealthStatus}
        selectedAssetMapLayers={assetsPageState.filter.selectedAssetLayers}
        selectedAssetSearchFilterId={selectedAssetSearchFilterId}
      >
        {children}
      </AssetsPageDataProvider>
    </AssetsPageContext.Provider>
  );
};
