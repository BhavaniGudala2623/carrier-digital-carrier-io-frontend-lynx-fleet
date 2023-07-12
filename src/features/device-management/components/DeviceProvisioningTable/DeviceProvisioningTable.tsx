import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceFilter, Maybe } from '@carrier-io/lynx-fleet-types';
import { GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { getDeviceSnapshotsLoading } from '../../stores';
import { stopReloadDeviceManagement } from '../../stores/deviceManagement/deviceManagementActions';
import { useTabsState } from '../../providers';
import { tableHeaderProps, tablePaperProps } from '../common';

import { DeviceProvisioningDataSource, LIMIT } from './DeviceProvisioningDataSource';
import { getDefaultColumns } from './columns';
import { DeviceStatusRenderer, DeviceImeiRenderer } from './column-renderers';
import { DeviceProvisioningTableHeader } from './DeviceProvisioningTableHeader';

import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';
import { Table, CountryNameRenderer } from '@/components';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';
import { useInterval } from '@/hooks';
import { useApplicationContext } from '@/providers/ApplicationContext';

const AUTO_REFRESH_INTERVAL = 60 * 1000;

export interface DeviceProvisioningTableProps {
  setRowLoading: (value: boolean) => void;
  setFirstLoading: (value: boolean) => void;
  setReLoading: (value: boolean) => void;
  filter: DeviceFilter;
}

export const DeviceProvisioningTable = ({
  filter,
  setRowLoading,
  setFirstLoading,
  setReLoading,
}: DeviceProvisioningTableProps) => {
  const dispatch = useAppDispatch();
  const isTableReloading = useAppSelector(getDeviceSnapshotsLoading);
  const { t } = useTranslation();
  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);
  const { featureFlags } = useApplicationContext();
  const { setTotalDeviceCount, setTotalDeviceCountLoading } = useTabsState();

  const deviceViewAllowed = hasPermission(companyActionPayload('device.view', tenantId));

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const filterRef = useRef<Maybe<DeviceFilter>>(null);

  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { deviceProvisioningColumns, timezone, dateFormat } = userSettings;

  const [onReloadCallback, setOnReloadCallback] = useState<(() => void) | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsLoading, setTotalItemsLoading] = useState(false);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const onSuccess = useCallback(
    (totalItemsCount: number) => {
      if (featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT) {
        setTotalDeviceCountLoading(false);
        setTotalDeviceCount(totalItemsCount);
      }

      if (!featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT) {
        setTotalItemsLoading(false);
        setTotalItems(totalItemsCount);
      }
      setRowLoading(false);
      setFirstLoading(false);
      setReLoading(false);
      dispatch(stopReloadDeviceManagement());
    },
    [
      setRowLoading,
      setFirstLoading,
      setReLoading,
      setTotalDeviceCount,
      setTotalDeviceCountLoading,
      dispatch,
      featureFlags,
    ]
  );

  const onFail = useCallback(() => {
    setRowLoading(false);
    setFirstLoading(false);
    dispatch(stopReloadDeviceManagement());
  }, [setRowLoading, setFirstLoading, dispatch]);

  const onLoadStarted = useCallback(
    (callback: () => void) => {
      setOnReloadCallback(() => callback);
      setRowLoading(true);
    },
    [setRowLoading]
  );

  const defaultColumns = useMemo(
    () => getDefaultColumns(t, dateFormat, deviceViewAllowed, timezone),
    [t, dateFormat, deviceViewAllowed, timezone]
  );

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, deviceProvisioningColumns),
    [deviceProvisioningColumns, defaultColumns]
  );

  useEffect(() => {
    if (
      gridApi &&
      ((filterRef.current?.field !== filter.field &&
        (filterRef.current?.value !== filter.value || filter.value !== '')) ||
        filterRef.current?.value !== filter.value)
    ) {
      const dataSource = new DeviceProvisioningDataSource(onSuccess, onFail, onLoadStarted, filter, t);
      if (featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT) {
        setTotalDeviceCountLoading(true);
      }
      if (!featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT) {
        setTotalItemsLoading(true);
      }

      gridApi.setDatasource(dataSource);
      filterRef.current = filter;
    }
  }, [
    gridApi,
    onSuccess,
    onFail,
    onLoadStarted,
    filter,
    filterRef,
    t,
    setTotalDeviceCountLoading,
    featureFlags,
  ]);

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'deviceProvisioningColumns',
  });

  const getMainMenuItems = () => [
    'pinSubMenu',
    'separator',
    'autoSizeThis',
    'autoSizeAll',
    'separator',
    {
      name: t('common.reset-columns'),
      action: onResetColumnsState,
    },
  ];

  const handleUpdateData = useCallback(() => {
    setReLoading(true);
    if (onReloadCallback) {
      onReloadCallback();
    }
    gridApi?.refreshInfiniteCache();
  }, [gridApi, onReloadCallback, setReLoading]);

  useEffect(() => {
    if (isTableReloading) {
      handleUpdateData();
    }
  }, [isTableReloading, handleUpdateData]);

  useInterval(() => {
    handleUpdateData();
  }, AUTO_REFRESH_INTERVAL);

  const restProps = featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT
    ? {}
    : {
        headerContent: (
          <DeviceProvisioningTableHeader totalItems={totalItems} totalItemsLoading={totalItemsLoading} />
        ),
      };

  return (
    <Table
      getRowId={({ data }) => data.device?.id || data.asset?.id}
      serverSideInfiniteScroll
      cacheOverflowSize={LIMIT}
      cacheBlockSize={LIMIT}
      columnDefs={savedColumns}
      components={{
        DeviceStatusRenderer,
        DeviceImeiRenderer,
        CountryNameRenderer: (params) => CountryNameRenderer(params, t),
      }}
      onGridReady={onGridReady}
      getMainMenuItems={getMainMenuItems}
      rowModelType="infinite"
      rowSelection="single"
      tooltipShowDelay={0.5}
      onColumnMoved={onColumnsChanged}
      onColumnPinned={onColumnsChanged}
      onColumnVisible={onColumnsChanged}
      onSortChanged={onColumnsChanged}
      onColumnResized={onColumnsChangedDebounced}
      resizeColumnsToFit
      defaultColDef={{
        suppressSizeToFit: true,
      }}
      serverSideSortAllLevels
      suppressCellFocus
      suppressFieldDotNotation={false}
      HeaderProps={tableHeaderProps}
      paperProps={featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT ? tablePaperProps : {}}
      animateRows
      {...restProps}
    />
  );
};
