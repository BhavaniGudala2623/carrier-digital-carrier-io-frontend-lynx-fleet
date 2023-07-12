import { useEffect, useState, useMemo, useCallback } from 'react';
import { GridApi, GridReadyEvent } from '@carrier-io/fds-react/AgGrid';
import { useTranslation } from 'react-i18next';

import { AUTO_REFRESH_INTERVAL, ROWS_LIMIT } from '../../../constants';
import { getBatteryNotificationListDateRange } from '../../../stores';
import { useGetBatteryNotificationColumns } from '../../../hooks';

import { BatteryNotificationsDataSource } from './BatteryNotificationsDataSource';
import { BatteryNotificationsHeader } from './BatteryNotificationsHeader';
import {
  NotificationsRenderer,
  AssetNameRenderer,
  DetailsRenderer,
  RecommendedStepsRenderer,
  CriticalityRenderer,
} from './column-renderers';

import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';
import { useInterval } from '@/hooks';
import { Table } from '@/components';
import { useAppDispatch, useAppSelector } from '@/stores';
import { useUserSettings } from '@/providers/UserSettings';

export interface BatteryNotificationsTableProps {
  setRowLoading: (value: boolean) => void;
  setFirstLoading: (value: boolean) => void;
  setReLoading: (value: boolean) => void;
}

export const BatteryNotificationsTable = ({
  setFirstLoading,
  setReLoading,
  setRowLoading,
}: BatteryNotificationsTableProps) => {
  const { t } = useTranslation();
  const dateRangeFilter = useAppSelector(getBatteryNotificationListDateRange);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsLoading, setTotalItemsLoading] = useState(false);
  const [onReloadCallback, setOnReloadCallback] = useState<(() => void) | null>(null);
  const dispatch = useAppDispatch();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { batteryNotificationsColumns } = userSettings;

  const onFail = useCallback(() => {
    setRowLoading(false);
    setFirstLoading(false);
  }, [setRowLoading, setFirstLoading]);

  const onLoadStarted = useCallback(
    (callback: () => void) => {
      setOnReloadCallback(() => callback);
      setRowLoading(true);
    },
    [setRowLoading]
  );

  const handleUpdateData = useCallback(() => {
    setReLoading(true);
    if (onReloadCallback) {
      onReloadCallback();
    }
    gridApi?.refreshInfiniteCache();
  }, [gridApi, onReloadCallback, setReLoading]);

  useInterval(() => {
    handleUpdateData();
  }, AUTO_REFRESH_INTERVAL);
  const onSuccess = useCallback(
    (totalItemsCount: number) => {
      setTotalItemsLoading(false);
      setTotalItems(totalItemsCount);
      setRowLoading(false);
      setFirstLoading(false);
      setReLoading(false);
    },
    [setRowLoading, setFirstLoading, setReLoading]
  );
  useEffect(() => {
    if (gridApi) {
      const dataSource = new BatteryNotificationsDataSource(
        onSuccess,
        onFail,
        onLoadStarted,
        t,
        dispatch,
        dateRangeFilter
      );
      gridApi.setDatasource(dataSource);
    }
  }, [gridApi, onFail, onSuccess, onLoadStarted, t, dispatch, dateRangeFilter]);

  useEffect(() => {
    if (gridApi) {
      if (totalItems === 0) {
        gridApi?.showNoRowsOverlay();
      } else {
        gridApi?.hideOverlay();
      }
    }
  }, [gridApi, totalItems]);

  const defaultColumns = useGetBatteryNotificationColumns();

  const columnDefs = useMemo(
    () =>
      (() => {
        if (!batteryNotificationsColumns) {
          return defaultColumns;
        }

        return applyComposedColumnsUserSettings(defaultColumns, batteryNotificationsColumns);
      })(),
    [batteryNotificationsColumns, defaultColumns]
  );
  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'batteryNotificationsColumns',
  });

  const getMainMenuItems = () => [
    'pinSubMenu',
    'separator',
    'autoSizeThis',
    'autoSizeAll',
    'separator',
    {
      name: t('common.reset-columns'),
      action: () => {
        onResetColumnsState();
      },
    },
  ];

  return (
    <Table
      onGridReady={onGridReady}
      columnDefs={columnDefs}
      defaultColDef={{
        filter: true,
        sortable: true,
      }}
      rowSelection="single"
      rowModelType="infinite"
      cacheOverflowSize={ROWS_LIMIT}
      cacheBlockSize={ROWS_LIMIT}
      tooltipShowDelay={0.5}
      resizeColumnsToFit
      onColumnMoved={onColumnsChanged}
      onColumnPinned={onColumnsChanged}
      onSortChanged={onColumnsChanged}
      onColumnVisible={onColumnsChanged}
      onColumnResized={onColumnsChangedDebounced}
      getMainMenuItems={getMainMenuItems}
      suppressFieldDotNotation={false}
      components={{
        NotificationsRenderer,
        AssetNameRenderer,
        DetailsRenderer,
        RecommendedStepsRenderer,
        CriticalityRenderer,
      }}
      headerContent={
        <BatteryNotificationsHeader totalItems={totalItems} totalItemsLoading={totalItemsLoading} />
      }
      animateRows
    />
  );
};
