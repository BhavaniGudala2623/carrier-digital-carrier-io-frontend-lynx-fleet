import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridApi, GridReadyEvent } from '@carrier-io/fds-react/AgGrid';
import { useTranslation } from 'react-i18next';

import { AUTO_REFRESH_INTERVAL, ROWS_LIMIT } from '../../../constants';
import { getSelectedFilter } from '../../../stores';

import {
  BatteryLastSeenRenderer,
  BatteryMaxTemparatureRenderer,
  BatteryMinTemparatureRenderer,
  ChargingStatusRenderer,
  PowerModeRenderer,
  StateOfChargeRenderer,
  TruStatusRenderer,
  AssetNameRenderer,
} from './column-renderers';
import { getDefaultColumns } from './columns';
import { ElectricAssetsDataSource } from './ElectricAssetsDataSource';
import { ElectricAssetsTableHeader } from './ElectricAssetsTableHeader';

import { Table } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';
import { useInterval } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/stores';

export interface ElectricAssetsTableProps {
  setRowLoading: (value: boolean) => void;
  setFirstLoading: (value: boolean) => void;
  setReLoading: (value: boolean) => void;
}

export const ElectricAssetsTable = ({
  setFirstLoading,
  setReLoading,
  setRowLoading,
}: ElectricAssetsTableProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [onReloadCallback, setOnReloadCallback] = useState<(() => void) | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsLoading, setTotalItemsLoading] = useState(false);
  const { userSettings } = useUserSettings();
  const { timezone, dateFormat, temperature } = userSettings;
  const selectedFilter = useAppSelector(getSelectedFilter);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

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

  useEffect(() => {
    if (gridApi) {
      const dataSource = new ElectricAssetsDataSource(
        onSuccess,
        onFail,
        onLoadStarted,
        t,
        dispatch,
        selectedFilter
      );
      gridApi.setDatasource(dataSource);
    }
  }, [gridApi, onFail, onSuccess, onLoadStarted, t, dispatch, selectedFilter]);

  const defaultColumns = useMemo(
    () => getDefaultColumns(t, dateFormat, timezone, temperature),
    [t, dateFormat, timezone, temperature]
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

  return (
    <Table
      onGridReady={onGridReady}
      columnDefs={defaultColumns}
      rowSelection="single"
      rowModelType="infinite"
      cacheOverflowSize={ROWS_LIMIT}
      cacheBlockSize={ROWS_LIMIT}
      tooltipShowDelay={0.5}
      resizeColumnsToFit
      // resizeRowsToFit
      suppressFieldDotNotation={false}
      defaultColDef={{
        filter: true,
        sortable: true,
      }}
      components={{
        TruStatusRenderer,
        PowerModeRenderer,
        StateOfChargeRenderer,
        ChargingStatusRenderer,
        BatteryLastSeenRenderer,
        BatteryMinTemparatureRenderer,
        BatteryMaxTemparatureRenderer,
        AssetNameRenderer,
      }}
      headerContent={
        <ElectricAssetsTableHeader totalItems={totalItems} totalItemsLoading={totalItemsLoading} />
      }
      animateRows
    />
  );
};
