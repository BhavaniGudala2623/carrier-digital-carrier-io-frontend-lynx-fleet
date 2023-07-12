import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CellClassParams,
  ColDef,
  GridApi,
  GridReadyEvent,
  ColumnApi,
  ICellRendererParams,
  ValueFormatterParams,
} from '@ag-grid-community/core';
import { useTranslation } from 'react-i18next';
import {
  Device,
  FlespiData,
  FreezerControlType,
  Maybe,
  TemperatureType,
  TruStatusType,
} from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { zonedTimeToUtc } from 'date-fns-tz';

import { useAssetHistoryPageContext, useTabPanelsContext } from '../../../providers';
import { AssetHistoryTabs } from '../../../types';
import {
  ChipFormatter,
  getColumnsToHide,
  hideFields,
  removeNotConfiguredCompartmentColumns,
  hideColumnsWithoutData,
} from '../utils';
import { useCellHighlighting, useTimestampCellHighlighting, useGetAssetHistoryColumns } from '../hooks';
import { useStyles } from '../styles';
import { ParamsProps } from '../types';
import {
  BatteryStatusFormatter,
  AssetStatusFormatter,
  CommandsFormatter,
  FreezerAlarmFormatter,
} from '../column-formatters';

import { AssetHistoryTabDatasource, LIMIT } from './AssetHistoryTabDataSource';

import { showError, showMessage } from '@/stores/actions';
import {
  cellChipRenderer,
  OperatingModeRenderer,
  SyntheticTruStatusRenderer,
  Table,
  temperatureFormatter,
  Loader,
} from '@/components';
import { FreezerAlarmModal } from '@/features/common';
import { applyComposedColumnsUserSettings } from '@/utils/saved-columns';
import { AgGridCellProps } from '@/types';
import { useUserSettings } from '@/providers/UserSettings';
import { useAppDispatch } from '@/stores';
import type { SnapshotDataEx } from '@/features/common';
import { toCelsius, useTableSaveColumns } from '@/utils';
import { useApplicationContext } from '@/providers/ApplicationContext';

type AssetsHistoryCellRendererProps = Omit<ICellRendererParams, 'data'> & {
  data?: {
    'flespiData.synthetic_tru_status'?: Maybe<TruStatusType>;
    'flespiData.freezer_control_mode'?: Maybe<FreezerControlType>;
    'flespiData.freezer_trs_comp1_power_status'?: Maybe<boolean>;
    'flespiData.freezer_trs_comp2_power_status'?: Maybe<boolean>;
    'flespiData.freezer_trs_comp3_power_status'?: Maybe<boolean>;
  };
};

interface IGetRowClassParams {
  data?: {
    'flespiData.synthetic_tru_status'?: TruStatusType;
  };
}

interface AssetHistoryTableTabProps {
  assetId: string;
  startDate: Date;
  endDate: Date;
  flespiData?: Maybe<Partial<FlespiData>>;
  onExportAvailable: (available: boolean) => void;
}

const getExportAvailableFlag = (gridApi: Maybe<GridApi>) =>
  (gridApi && gridApi?.getModel()?.getRowCount() > 0) || false;

const getFieldsToHide = (freezerControlMode: string | undefined | null): string[] => {
  if (freezerControlMode === 'AT52') {
    return ['flespiData.freezer_engine_total', 'flespiData.freezer_standby_total'];
  }

  return [];
};

const defaultCellRenderer = (params: ParamsProps & { valueFormatted: never; colDef: ColDef }) => {
  const value = params.valueFormatted ?? params.value;
  const canBeRendered = value !== null && value !== undefined;

  return canBeRendered ? <span className="cell-value">{value}</span> : null;
};

const getTRUStatusData = (props: AssetsHistoryCellRendererProps): FlespiData => {
  const { data } = props;

  return {
    synthetic_tru_status: data?.['flespiData.synthetic_tru_status'],
    freezer_control_mode: data?.['flespiData.freezer_control_mode'],
    freezer_trs_comp1_power_status: data?.['flespiData.freezer_trs_comp1_power_status'],
    freezer_trs_comp2_power_status: data?.['flespiData.freezer_trs_comp2_power_status'],
    freezer_trs_comp3_power_status: data?.['flespiData.freezer_trs_comp3_power_status'],
  };
};

export const AssetHistoryTable = ({
  assetId,
  startDate,
  endDate,
  flespiData,
  onExportAvailable,
}: AssetHistoryTableTabProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedTab } = useTabPanelsContext();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { temperature, assetHistoryColumns, timezone } = userSettings;
  const { compartmentConfig } = useAssetHistoryPageContext();
  const { featureFlags, appLanguage } = useApplicationContext();

  const [gridApi, setGridApi] = useState<Maybe<GridApi>>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [modalSelectedAsset, setModalSelectedAsset] = useState<SnapshotDataEx | null>(null);
  const [device, setDevice] = useState<Device>();
  const [error, setError] = useState<Maybe<string>>(null);
  const [info, setInfo] = useState<Maybe<string>>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const includeDatacoldSensors = device?.includeDatacoldSensors || false;
  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  const onFail = useCallback(
    (data: { message: Maybe<string>; isError?: Maybe<boolean> }) => {
      if (data.isError) {
        setError(data.message);
      } else {
        setInfo(data.message);
      }
      setIsLoading(false);
      onExportAvailable(getExportAvailableFlag(gridApi));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridApi]
  );

  const onLoadStarted = useCallback(() => {
    onExportAvailable(false);
    setInfo(null);
    setIsLoading(true);
    gridApi?.showNoRowsOverlay();
  }, [onExportAvailable, setIsLoading, gridApi]);

  const onSuccess = useCallback(
    (result: { device: Device }) => {
      if (gridApi && columnApi) {
        hideColumnsWithoutData({ gridApi, columnApi });
      }

      if (result.device.flespiId !== device?.flespiId) {
        setDevice(result.device);
      }
      setIsLoading(false);
      gridApi?.hideOverlay();

      onExportAvailable(getExportAvailableFlag(gridApi));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [device, gridApi]
  );

  const isRowDisabled = (params: IGetRowClassParams) =>
    params.data?.['flespiData.synthetic_tru_status'] === 'OFF';

  const getRowClass = (params: IGetRowClassParams) => (isRowDisabled(params) ? classes.grayRow : undefined);

  const tempFormatter = useCallback(
    (params: ValueFormatterParams) => {
      if (!params.value) {
        return '';
      }
      const serverTemperatureUnit = params.data?.['units.temperature'] as TemperatureType | undefined;
      const value = serverTemperatureUnit === 'F' ? toCelsius(params.value) : params.value;

      return temperatureFormatter({ value }, { units: temperature });
    },
    [temperature]
  );

  const columns = useGetAssetHistoryColumns(tempFormatter, includeDatacoldSensors);

  const customizeColumns = useCallback(
    (cols) => {
      const columnsToHide = getColumnsToHide(cols, device);
      const fieldsToHide = getFieldsToHide(flespiData?.freezer_control_mode);
      const columnsWithHideApplied = hideFields(columnsToHide, fieldsToHide);

      return removeNotConfiguredCompartmentColumns(columnsWithHideApplied, compartmentConfig);
    },
    [compartmentConfig, device, flespiData?.freezer_control_mode]
  );

  const defaultColumns = useMemo(() => (device ? columns : []), [device, columns]);

  const columnDefs = useMemo(() => {
    const columnsByUserSettings = applyComposedColumnsUserSettings(defaultColumns, assetHistoryColumns);

    return featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE
      ? customizeColumns(columnsByUserSettings)
      : columnsByUserSettings;
  }, [
    defaultColumns,
    assetHistoryColumns,
    featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE,
    customizeColumns,
  ]);

  useEffect(() => {
    if (gridApi) {
      const dataSource = new AssetHistoryTabDatasource(
        assetId,
        startDate && zonedTimeToUtc(startDate.setSeconds(0, 0), timezone).toISOString(),
        endDate && zonedTimeToUtc(endDate.setSeconds(59, 999), timezone).toISOString(),
        onSuccess,
        onFail,
        onLoadStarted,
        t,
        appLanguage
      );
      gridApi.setDatasource(dataSource);
    }
  }, [gridApi, startDate, endDate, assetId, onSuccess, onFail, onLoadStarted, t, timezone, appLanguage]);

  useEffect(() => {
    if (info && selectedTab === AssetHistoryTabs.AssetHistoryTableTabView) {
      showMessage(dispatch, info);
    }
  }, [selectedTab, dispatch, t, info]);

  useEffect(() => {
    if (selectedTab === AssetHistoryTabs.AssetHistoryTableTabView && error) {
      showError(dispatch, error);
    }
  }, [error, dispatch, selectedTab]);

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns: customizeColumns(defaultColumns),
    columnsSettingKey: 'assetHistoryColumns',
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

  const formatSensorTemperature = (field: string): string => {
    const fieldParts = field.split('.');

    return `computedFields.${fieldParts[2]?.toLowerCase()}Temp${fieldParts[3]?.toUpperCase()}`;
  };

  const formatDatacoldTemperature = (field: string): string => {
    const datacoldFieldParts = field.split('.');

    return `computedFields.${datacoldFieldParts[2]?.toLowerCase()}Datacold${datacoldFieldParts[3]?.toUpperCase()}`;
  };

  const hasCellValueChanged = useCallback((params: CellClassParams & { data: ParamsProps['data'] }) => {
    const { field } = params.colDef;

    if (field === 'computedFields.address') {
      return false;
    }

    const compareWithField = (() => {
      if (field && field.startsWith('formattedFields.datacoldTemperature')) {
        return formatDatacoldTemperature(field);
      }
      if (field && field.startsWith('formattedFields.sensorTemperature')) {
        return formatSensorTemperature(field);
      }

      return field;
    })();

    return params.data?.changedFields?.has(compareWithField);
  }, []);

  const { causedAlert, affectedBy2WayCom } = useCellHighlighting();

  const { hasAffectedBy2WayComField, hasAffectedBy2WayComFieldAndAlerts, hasAlerts } =
    useTimestampCellHighlighting();

  const defaultColDef: ColDef = useMemo(
    () => ({
      resizable: true,
      minWidth: 150,
      cellRenderer: 'defaultCellRenderer',
      suppressSizeToFit: true,
      cellClassRules: {
        [classes.cellValueChanged]: hasCellValueChanged,
        [classes.hasAffectedBy2WayComFieldAndAlerts]: hasAffectedBy2WayComFieldAndAlerts,
        [classes.hasAlerts]: hasAlerts,
        [classes.hasAffectedBy2WayComField]: hasAffectedBy2WayComField,
        [classes.causedAlert]: causedAlert,
        [classes.affectedBy2WayCom]: affectedBy2WayCom,
      },
    }),
    [
      classes,
      hasCellValueChanged,
      hasAffectedBy2WayComFieldAndAlerts,
      hasAlerts,
      hasAffectedBy2WayComField,
      causedAlert,
      affectedBy2WayCom,
    ]
  );

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          height: '100%',
        }}
      >
        {isLoading && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Loader />
          </Box>
        )}
        <Table
          defaultColDef={defaultColDef}
          rowBuffer={0}
          serverSideInfiniteScroll
          cacheOverflowSize={LIMIT}
          cacheBlockSize={LIMIT}
          components={{
            cellChipRenderer: (params: AgGridCellProps) => cellChipRenderer(params, t),
            SyntheticTruStatusRenderer: (params: AssetsHistoryCellRendererProps) =>
              SyntheticTruStatusRenderer({
                flespiData: getTRUStatusData(params),
                table: 'assetHistory',
                compartmentConfig,
              }),
            assetStatusFormatter: AssetStatusFormatter,
            freezerAlarmFormatter: (params: ParamsProps) =>
              FreezerAlarmFormatter(params, setModalSelectedAsset),
            commandsFormatter: CommandsFormatter,
            freezerEngineStandbyStatusFormatter: (params: ParamsProps) =>
              ChipFormatter(params, { highlight: 'Standby' }),
            freezerEngineControlFormatter: (params: ParamsProps) =>
              ChipFormatter(params, { highlight: 'Continuous' }),
            batteryStatusFormatter: (params: ParamsProps) => BatteryStatusFormatter(params, t),
            defaultCellRenderer: (params: ParamsProps) =>
              defaultCellRenderer(params as ParamsProps & { valueFormatted: never; colDef: ColDef }),
            OperatingModeRenderer: (params) => OperatingModeRenderer(params),
          }}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          onColumnMoved={onColumnsChanged}
          onColumnPinned={onColumnsChanged}
          onSortChanged={onColumnsChanged}
          onColumnResized={onColumnsChangedDebounced}
          getMainMenuItems={getMainMenuItems}
          getRowId={({ data }) => data['flespiData.timestamp']}
          getRowClass={getRowClass}
          rowModelType="infinite"
          serverSideSortAllLevels
          animateRows
          suppressFieldDotNotation
          suppressDragLeaveHidesColumns
          resizeColumnsToFit
          overlayNoRowsTemplate="<span />"
        />
      </Box>

      {modalSelectedAsset && (
        <FreezerAlarmModal selectedAsset={modalSelectedAsset} setModalSelectedAsset={setModalSelectedAsset} />
      )}
    </Box>
  );
};
