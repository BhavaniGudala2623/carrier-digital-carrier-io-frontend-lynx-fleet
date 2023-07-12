import {
  AlertSummary,
  AlertType,
  AssetStatusType,
  Maybe,
  StatusSummary,
  HealthSummary,
  HealthStatusType,
} from '@carrier-io/lynx-fleet-types';
import { createContext, ReactNode, useMemo, useEffect, useState, useRef } from 'react';

import { filterSnapshots } from '../utils/filterSnapshots';
import { indexSensors } from '../utils/indexSensors';
import { AssetLayerFilterType } from '../types';
import { useAssetsPageData } from '../hooks/useAssetsPageData';

import { SnapshotDataEx, useCompanyHierarchyTenantIds } from '@/features/common';
import { useNullableContext } from '@/hooks/useNullableContext';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchAssetSnapshotsForTenant } from '@/stores/assets/snapshot/actions';
import { getAssetSnapshotsState } from '@/stores/assets';

type AssetsPageDataContextValue = {
  snapshots: Maybe<SnapshotDataEx[]>;
  filteredSnapshots: Maybe<SnapshotDataEx[]>;
  alertSummaries: Maybe<AlertSummary>[];
  statusSummaries: Maybe<StatusSummary>[];
  filteredAlertSummaries: AlertSummary[];
  filteredHealthSummaries: HealthSummary[];
  filteredStatusSummaries: StatusSummary[];
  listLoading: boolean;
  responseCount: Maybe<number>;
};
const AssetsPageDataContext = createContext<Maybe<AssetsPageDataContextValue>>(null);

export const useAssetsPageDataContext = () => useNullableContext(AssetsPageDataContext);

const ASSETS_REFETCH_INTERVAL = 1000 * 60;

export const AssetsPageDataProvider = ({
  children,
  selectedAlarm,
  selectedStatus,
  selectedHealthStatus,
  searchText,
  selectedAssetMapLayers,
  selectedAssetSearchFilterId,
}: {
  children: ReactNode;
  selectedAlarm: Maybe<AlertType>;
  selectedStatus: Maybe<AssetStatusType>;
  selectedHealthStatus: Maybe<HealthStatusType>;
  searchText: Maybe<string>;
  selectedAssetMapLayers: AssetLayerFilterType[];
  selectedAssetSearchFilterId: Maybe<string>;
}) => {
  const {
    applicationState: { selectedCompanyHierarchy },
    appLanguage,
  } = useApplicationContext();

  const { companyHierarchyTenantIds } = useCompanyHierarchyTenantIds();
  const dispatch = useAppDispatch();
  const [language, setLanguage] = useState(appLanguage);
  const timerRef = useRef<NodeJS.Timeout>();

  const { snapshots, alertSummaries, statusSummaries, healthSummaries, isLoading, responseCount } =
    useAppSelector(getAssetSnapshotsState);

  useEffect(() => {
    if (timerRef.current && appLanguage !== language) {
      clearTimeout(timerRef.current);
      setLanguage(appLanguage);
    }

    timerRef.current = setTimeout(function tick() {
      dispatch(fetchAssetSnapshotsForTenant(appLanguage));

      // TODO we should implement better logic for update interval based on previous response
      timerRef.current = setTimeout(tick, ASSETS_REFETCH_INTERVAL);
    }, 0);

    return () => clearTimeout(timerRef.current);
  }, [dispatch, appLanguage, language]);

  const { assetSnapshots } = useMemo(
    () => ({
      assetSnapshots: snapshots?.map(indexSensors) ?? null,
    }),
    [snapshots]
  );

  const { filteredSnapshots, filteredAlertSummaries, filteredStatusSummaries, filteredHealthSummaries } =
    useMemo(
      () =>
        filterSnapshots(
          {
            searchText,
            selectedAlarm,
            selectedStatus,
            selectedHealthStatus,
            selectedAssetMapLayers,
            selectedCompanyHierarchy,
            companyHierarchyTenantIds,
            selectedAssetSearchFilterId,
          },
          { assetSnapshotsEx: assetSnapshots, alertSummaries, statusSummaries, healthSummaries }
        ),
      [
        searchText,
        selectedAlarm,
        selectedStatus,
        selectedHealthStatus,
        selectedAssetMapLayers,
        assetSnapshots,
        alertSummaries,
        statusSummaries,
        healthSummaries,
        selectedCompanyHierarchy,
        companyHierarchyTenantIds,
        selectedAssetSearchFilterId,
      ]
    );

  useAssetsPageData();

  const contextValue: AssetsPageDataContextValue = useMemo(
    () => ({
      filteredSnapshots,
      filteredAlertSummaries,
      filteredStatusSummaries,
      filteredHealthSummaries,
      alertSummaries,
      snapshots: assetSnapshots,
      statusSummaries,
      listLoading: isLoading,
      responseCount,
    }),
    [
      filteredSnapshots,
      filteredAlertSummaries,
      filteredStatusSummaries,
      filteredHealthSummaries,
      assetSnapshots,
      statusSummaries,
      alertSummaries,
      isLoading,
      responseCount,
    ]
  );

  return <AssetsPageDataContext.Provider value={contextValue}>{children}</AssetsPageDataContext.Provider>;
};
