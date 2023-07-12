import { GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { BluetoothSensorFilter, Maybe } from '@carrier-io/lynx-fleet-types';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBluetoothState, useTabsState } from '../../providers';
import { getBluetoothSensorsLoading } from '../../stores';
import { stopReloadBluetoothSensorsManagement } from '../../stores/bluetoothSensorsManagement/bluetoothSensorsManagementActions';
import { tableHeaderProps, tablePaperProps } from '../common';

import {
  AssetNameRenderer,
  CertificateLinkRenderer,
  DeviceImeiRenderer,
  SensorActionsRenderer,
  SensorLocationRenderer,
  SensorStatusRenderer,
} from './column-renderers';
import { getDefaultColumns } from './columns';
import { LIMIT, WirelessSensorsDataSource } from './WirelessSensorsDataSource';

import { Table } from '@/components';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';
import { useInterval } from '@/hooks';
import { useUserSettings } from '@/providers/UserSettings';
import { useAppDispatch, useAppSelector } from '@/stores';
import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';

const AUTO_REFRESH_INTERVAL = 60 * 1000;

export interface WirelessSensorsTableProps {
  setRowLoading: (value: boolean) => void;
  setFirstLoading: (value: boolean) => void;
  setReLoading: (value: boolean) => void;
  filter: BluetoothSensorFilter;
}
export const WirelessSensorsTable = ({
  setRowLoading,
  setFirstLoading,
  setReLoading,
  filter,
}: WirelessSensorsTableProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { hasPermission } = useRbac();
  const isTableReloading = useAppSelector(getBluetoothSensorsLoading);
  const tenantId = useAppSelector(getAuthTenantId);
  const { setTotalBluetoothSensorsCount, setTotalBluetoothSensorsCountLoading } = useTabsState();
  const { refreshStart, setRefreshStart } = useBluetoothState();

  const deviceViewAllowed = hasPermission(companyActionPayload('device.view', tenantId));

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const filterRef = useRef<Maybe<BluetoothSensorFilter>>(null);
  const { field: filterField, value: filterValue } = filter;

  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { wirelessSensorsColumns, timezone, dateFormat } = userSettings;

  const [onReloadCallback, setOnReloadCallback] = useState<(() => void) | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const onSuccess = useCallback(
    (totalItemsCount: number) => {
      setTotalBluetoothSensorsCountLoading(false);
      setTotalBluetoothSensorsCount(totalItemsCount);

      setRowLoading(false);
      setFirstLoading(false);
      setReLoading(false);
      dispatch(stopReloadBluetoothSensorsManagement());
    },
    [
      setTotalBluetoothSensorsCountLoading,
      setTotalBluetoothSensorsCount,
      setRowLoading,
      setFirstLoading,
      setReLoading,
      dispatch,
    ]
  );

  const onFail = useCallback(() => {
    setRowLoading(false);
    setFirstLoading(false);
    dispatch(stopReloadBluetoothSensorsManagement());
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
    () => applyComposedColumnsUserSettings(defaultColumns, wirelessSensorsColumns),
    [wirelessSensorsColumns, defaultColumns]
  );

  useEffect(() => {
    if (
      gridApi &&
      ((filterRef.current?.field !== filterField &&
        (filterRef.current?.value !== filterValue || filterValue !== '')) ||
        filterRef.current?.value !== filterValue)
    ) {
      const newFilter = {
        field: filterField,
        value: filterValue,
      };

      const dataSource = new WirelessSensorsDataSource(onSuccess, onFail, onLoadStarted, newFilter, t);
      setTotalBluetoothSensorsCountLoading(true);

      gridApi.setDatasource(dataSource);
      filterRef.current = newFilter;
    }
  }, [
    gridApi,
    onSuccess,
    onFail,
    onLoadStarted,
    filterField,
    filterValue,
    filterRef,
    t,
    setTotalBluetoothSensorsCountLoading,
  ]);

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'wirelessSensorsColumns',
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

  useEffect(() => {
    if (gridApi) {
      const dataSource = new WirelessSensorsDataSource(
        onSuccess,
        onFail,
        onLoadStarted,
        {
          field: filterField,
          value: filterValue,
        },
        t
      );
      setTotalBluetoothSensorsCountLoading(true);

      gridApi.setDatasource(dataSource);
    }
    setRefreshStart(false);
  }, [
    filterField,
    filterValue,
    gridApi,
    onFail,
    onLoadStarted,
    onSuccess,
    refreshStart,
    setRefreshStart,
    setTotalBluetoothSensorsCountLoading,
    t,
  ]);

  useInterval(() => {
    handleUpdateData();
  }, AUTO_REFRESH_INTERVAL);

  return (
    <Table
      getRowId={({ data }) => data.macId}
      sortingOrder={['asc', 'desc']}
      serverSideInfiniteScroll
      cacheOverflowSize={LIMIT}
      cacheBlockSize={LIMIT}
      columnDefs={savedColumns}
      components={{
        SensorStatusRenderer,
        DeviceImeiRenderer,
        CertificateLinkRenderer,
        SensorLocationRenderer,
        SensorActionsRenderer,
        AssetNameRenderer,
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
      paperProps={tablePaperProps}
      animateRows
    />
  );
};
