import {
  StatusSummary,
  AlertSummary,
  Maybe,
  AlertType,
  AssetStatusType,
  NavigationTreeItemType,
  HealthSummary,
  HealthStatusType,
} from '@carrier-io/lynx-fleet-types';

import { AssetLayerFilterType } from '../types';

import type { SnapshotDataEx } from '@/features/common';
import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';
import { debugLog, isDevStage } from '@/utils';

const filterSnapshotsBySelectedCompanyHierarchy = (
  companyHierarchy: SelectedCompanyHierarchy,
  snapshots: Maybe<SnapshotDataEx[]>,
  companyHierarchyTenantIds: string[] | undefined
) => {
  if (!companyHierarchy || !snapshots) {
    return snapshots;
  }

  const { type, id } = companyHierarchy;

  const snapshotsFilterByNodeType: Record<NavigationTreeItemType, () => SnapshotDataEx[]> = {
    NONE: () => snapshots,
    ALL: () => snapshots,
    GLOBAL: () => snapshots,
    COMPANY: () =>
      snapshots.filter((snapshot) => companyHierarchyTenantIds?.includes(snapshot?.tenant?.id ?? '')),
    COUNTRY: () => snapshots.filter((snapshot) => snapshot?.tenant?.contactInfo?.country === id),
    FLEET: () => snapshots.filter((snapshot) => snapshot.asset?.fleetIds?.includes(id)),
    REGION: () => snapshots.filter((snapshot) => snapshot.tenant?.contactInfo?.region === id),
  };

  return snapshotsFilterByNodeType[type]();
};

const filterSummaries = (
  snapshots: Maybe<SnapshotDataEx[]>,
  {
    alertSummaries,
    statusSummaries,
    healthSummaries,
  }: {
    statusSummaries: Maybe<StatusSummary>[];
    alertSummaries: Maybe<AlertSummary>[];
    healthSummaries: Maybe<HealthSummary>[];
  }
) => {
  const assetIds = snapshots?.map((fs) => fs?.asset?.id) ?? [];

  const filteredAlertSummaries = alertSummaries.map(
    (item) =>
      ({
        ...item,
        assetIds: item?.assetIds.filter((assetId) => assetIds.includes(assetId)) ?? [],
      } as AlertSummary)
  );

  const filteredStatusSummaries = statusSummaries.map(
    (item) =>
      ({
        ...item,
        assetIds: item?.assetIds.filter((assetId) => assetIds.includes(assetId)) ?? [],
      } as StatusSummary)
  );

  const filteredHealthSummaries = healthSummaries.map(
    (item) =>
      ({
        ...item,
        assetIds: item?.assetIds.filter((assetId) => assetIds.includes(assetId)) ?? [],
      } as HealthSummary)
  );

  return { filteredStatusSummaries, filteredAlertSummaries, filteredHealthSummaries };
};

const filterSnapshotsBySelectedAlarm = (
  selectedAlarm: Maybe<AlertType>,
  filteredAlertSummaries: Maybe<AlertSummary[]> | undefined,
  snapshots: Maybe<SnapshotDataEx[]>
) => {
  // filter out inactive alarms if an alarm widget is selected
  if (!selectedAlarm || !snapshots) {
    return snapshots;
  }

  const alertSummary = filteredAlertSummaries?.find((item) => item?.type === selectedAlarm);
  if (!alertSummary) {
    return snapshots;
  }

  return snapshots.filter((snapshot) => alertSummary.assetIds.includes(snapshot?.asset?.id as string));
};

const filterSnapshotsBySelectedStatus = (
  selectedStatus: Maybe<AssetStatusType>,
  filteredStatusSummaries: Maybe<StatusSummary[]> | undefined,
  snapshots: Maybe<SnapshotDataEx[]>
) => {
  // filter out statuses if an status value is clicked
  if (!selectedStatus || !snapshots) {
    return snapshots;
  }

  const statusSummary = filteredStatusSummaries?.find((item) => item?.type === selectedStatus);

  if (!statusSummary) {
    return snapshots;
  }

  return snapshots.filter((snapshot) => statusSummary.assetIds.includes(snapshot?.asset?.id as string));
};

const filterSnapshotsBySelectedHealthStatus = (
  selectedHealthStatus: Maybe<HealthStatusType>,
  filteredHealthSummaries: Maybe<HealthSummary[]> | undefined,
  snapshots: Maybe<SnapshotDataEx[]>
) => {
  // filter out statuses if an status value is clicked
  if (!selectedHealthStatus || !snapshots) {
    return snapshots;
  }

  const healthStatusSummary = filteredHealthSummaries?.find((item) => item?.type === selectedHealthStatus);

  if (!healthStatusSummary) {
    return snapshots;
  }

  return snapshots
    .filter((snapshot) => healthStatusSummary.assetIds.includes(snapshot?.asset?.id as string))
    .sort((a, b) => Number(b.flespiData?.timestamp || 0) - Number(a.flespiData?.timestamp || 0));
};

const applySeachBarFilter = (searchText: string, snapshots: Maybe<SnapshotDataEx[]>) =>
  searchText
    ? snapshots?.filter((snapshot) =>
        (snapshot?.asset?.name as string)?.toUpperCase().includes(searchText.toUpperCase())
      ) ?? null
    : snapshots;

const filterByAssetMapLayers = (
  layers: AssetLayerFilterType[] | undefined,
  snapshots: Maybe<SnapshotDataEx[]>
) =>
  layers
    ? snapshots?.filter(
        (entity) =>
          (entity?.activeFreezerAlarms?.length && layers.includes('Alarm')) ||
          (entity?.activeFreezerAlarms?.length === 0 &&
            entity?.computedFields?.movementStatus &&
            layers.includes('Yes')) ||
          (entity.activeFreezerAlarms?.length === 0 &&
            !entity?.computedFields?.movementStatus &&
            layers.includes('No'))
      ) ?? null
    : snapshots;

export const filterSnapshots = (
  queryParams: {
    searchText: Maybe<string>;
    selectedAlarm: Maybe<AlertType>;
    selectedStatus: Maybe<AssetStatusType>;
    selectedHealthStatus: Maybe<HealthStatusType>;
    selectedAssetMapLayers: AssetLayerFilterType[];
    selectedCompanyHierarchy: SelectedCompanyHierarchy;
    companyHierarchyTenantIds?: string[];
    selectedAssetSearchFilterId: Maybe<string>;
  },
  {
    assetSnapshotsEx,
    alertSummaries,
    statusSummaries,
    healthSummaries,
  }: {
    assetSnapshotsEx: Maybe<SnapshotDataEx[]>;
    alertSummaries: Maybe<AlertSummary>[];
    statusSummaries: Maybe<StatusSummary>[];
    healthSummaries: Maybe<HealthSummary>[];
  }
) => {
  let filteredSnapshots = filterSnapshotsBySelectedCompanyHierarchy(
    queryParams.selectedCompanyHierarchy,
    assetSnapshotsEx,
    queryParams.companyHierarchyTenantIds
  );

  // TODO
  if (isDevStage() && process.env.REACT_FILTER_ASSETS_WITHOUT_DATA === 'true') {
    filteredSnapshots = filteredSnapshots?.filter((item) => item.flespiData?.timestamp) ?? filteredSnapshots;
  }

  const { filteredAlertSummaries, filteredStatusSummaries, filteredHealthSummaries } = filterSummaries(
    filteredSnapshots,
    {
      alertSummaries,
      statusSummaries,
      healthSummaries,
    }
  );

  filteredSnapshots = filterSnapshotsBySelectedAlarm(
    queryParams?.selectedAlarm,
    filteredAlertSummaries,
    filteredSnapshots
  );

  filteredSnapshots = filterSnapshotsBySelectedStatus(
    queryParams?.selectedStatus,
    filteredStatusSummaries,
    filteredSnapshots
  );

  filteredSnapshots = filterSnapshotsBySelectedHealthStatus(
    queryParams?.selectedHealthStatus,
    filteredHealthSummaries,
    filteredSnapshots
  );

  if (queryParams.searchText) {
    const selectedAsset =
      queryParams.selectedAssetSearchFilterId &&
      filteredSnapshots?.find((snapshot) => snapshot?.asset?.id === queryParams.selectedAssetSearchFilterId);

    if (selectedAsset && selectedAsset.asset?.name?.toLowerCase() === queryParams.searchText.toLowerCase()) {
      filteredSnapshots = [selectedAsset];
    } else {
      filteredSnapshots = applySeachBarFilter(queryParams.searchText, filteredSnapshots);
    }
  }

  filteredSnapshots = filterByAssetMapLayers(queryParams.selectedAssetMapLayers, filteredSnapshots);

  debugLog('filterSnapshots', {
    filteredSnapshots,
    filteredAlertSummaries,
    filteredStatusSummaries,
    filteredHealthSummaries,
  });

  return { filteredSnapshots, filteredAlertSummaries, filteredStatusSummaries, filteredHealthSummaries };
};
