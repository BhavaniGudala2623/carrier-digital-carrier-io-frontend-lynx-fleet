import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColumnGroupOpenedEvent,
  GridApi,
  ICellRendererParams,
  ProcessCellForExportParams,
  ValueFormatterParams,
} from '@ag-grid-community/core';
import { EventHistoryRec, FlespiData, HistoryFrequency, Maybe } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { getFileNameToExport } from '@carrier-io/lynx-fleet-common';

import { useAssetHistoryPageContext, useTabPanelsContext } from '../../../../providers';

import { generateEventHistoryColumns } from './eventHistoryColumns';
import { IEventHistoryParams, IGetRowClassParams } from './types';
import { EventHistoryTableFormatter } from './EventHistoryTableFormatter';
import { getFilteredEvents, getFilteredHistory, isTruOn, localizeHistoryFrequency } from './utils';

import {
  dateTimeFormatter,
  ExportButton,
  Table,
  temperatureFormatter,
  SyntheticTruStatusRenderer,
  truStatusExportFormatter,
} from '@/components';
import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';
import { getAuthTenantId } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { defExcelSheetPageSetup } from '@/constants';
import { ILegendSettings, useApplicationContext } from '@/providers/ApplicationContext';
import { useUserSettings } from '@/providers/UserSettings';
import { ChartConfig } from '@/types';
import { HasPermission } from '@/features/authorization';
import { translateTruStatus } from '@/utils/translateTruStatus';

interface EventHistoryTableProps {
  assetId?: Maybe<number>;
  history?: Maybe<EventHistoryRec[]>;
  listLoading: boolean;
  legendSettings: ILegendSettings;
  chartConfig?: ChartConfig;
  // eslint-disable-next-line react/no-unused-prop-types
  flatChartConfig: ChartConfig;
  isAT52Device: boolean;
  selectedFrequency: Maybe<HistoryFrequency>;
  setSelectedFrequency: (f: HistoryFrequency) => void;
  frequencyButtonDisabled: boolean;
  setSelectedView: (view: Maybe<number | string>) => void;
}

type EventHistoryTableCellRendererProps = Omit<ICellRendererParams, 'data'> & {
  data?: Maybe<EventHistoryRec>;
};

export const EventHistoryTable = ({
  assetId,
  history,
  listLoading,
  legendSettings,
  chartConfig,
  isAT52Device,
  selectedFrequency,
  setSelectedFrequency,
  frequencyButtonDisabled,
  setSelectedView,
}: EventHistoryTableProps) => {
  const { t } = useTranslation();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { temperature, temperatureChartColumns, timezone, dateFormat } = userSettings;
  const { featureFlags } = useApplicationContext();
  const { compartmentConfig } = useAssetHistoryPageContext();

  const isFeatureTemperatureChartAndTableEnabled = featureFlags.REACT_APP_FEATURE_TEMPERATURE_CHART_AND_TABLE;
  const isFeatureCompartmentOnOffModeEnabled = featureFlags.REACT_APP_FEATURE_COMPARTMENT_ON_OFF_MODE;
  const isFeatureAddressColumnEnabled = featureFlags.REACT_APP_FEATURE_ADDRESS_COLUMN;

  const tenantId = useAppSelector(getAuthTenantId);
  const { compartment1GroupOpen, setCompartment1GroupOpen } = useTabPanelsContext();

  const [gridApi, setGridApi] = useState<Maybe<GridApi>>(null);

  const tempFormatter = useCallback(
    (params: ValueFormatterParams) => temperatureFormatter(params, { units: temperature }),
    [temperature]
  );

  const truAwareTempFormatter = useCallback(
    (params: ValueFormatterParams) => {
      const synthetic_tru_status =
        params.data?.synthetic_tru_status || params.node?.data.synthetic_tru_status;

      if (synthetic_tru_status === 'ON') {
        return tempFormatter(params);
      }

      return '';
    },
    [tempFormatter]
  );

  const defaultColumns = useMemo(
    () =>
      generateEventHistoryColumns(
        truAwareTempFormatter,
        tempFormatter,
        dateFormat,
        temperature,
        legendSettings,
        t,
        isAT52Device,
        timezone,
        chartConfig,
        compartment1GroupOpen,
        isFeatureAddressColumnEnabled
      ),
    [
      truAwareTempFormatter,
      tempFormatter,
      dateFormat,
      temperature,
      legendSettings,
      t,
      isAT52Device,
      timezone,
      chartConfig,
      compartment1GroupOpen,
      isFeatureAddressColumnEnabled,
    ]
  );

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, temperatureChartColumns),
    [temperatureChartColumns, defaultColumns]
  );

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'temperatureChartColumns',
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

  const processCellCallback = (params: ProcessCellForExportParams): string => {
    const { column, value, node } = params;
    const powerStatus = isTruOn(node);
    const data = node?.data as Maybe<FlespiData> | undefined;
    switch (column.getColId()) {
      case 'synthetic_tru_status':
        if (!isFeatureCompartmentOnOffModeEnabled) {
          return truStatusExportFormatter({ flespiData: data, compartmentConfig, featureFlags, t });
        }

        return translateTruStatus(t, data?.synthetic_tru_status);
      case 'freezer_trs_comp1_power_status':
      case 'freezer_trs_comp2_power_status':
      case 'freezer_trs_comp3_power_status':
      case 'freezer_comp1_power_status':
      case 'freezer_comp2_power_status':
      case 'freezer_comp3_power_status':
        return value ? t('common.on') : t('common.off');
      case 'freezer_comp1_mode':
        return value ? t('common.on') : t('common.off');

      case 'position_speed':
        return value ? t('assets.asset.table.moving') : t('assets.asset.table.stationary');
      case 'freezer_engine_power_mode':
        if (powerStatus) {
          return value ? t('asset.data.standby') : t('asset.data.engine');
        }

        return '';
      case 'freezer_engine_control_mode':
        if (powerStatus) {
          return value ? t('asset.data.continuous') : t('asset.data.start-stop');
        }

        return '';

      case 'plugin_door_closed_1':
      case 'plugin_door_closed_2':
        return value ? t('assets.door.status.open') : t('assets.door.status.closed');

      case 'timestamp':
        return dateTimeFormatter(value, { dateFormat, timezone });

      case 'freezer_air_temperature':
      case 'freezer_zone1_temperature_setpoint':
      case 'freezer_zone1_return_air_temperature':
      case 'freezer_zone1_supply_air_temperature':
      case 'freezer_zone2_temperature_setpoint':
      case 'freezer_zone2_return_air_temperature':
      case 'freezer_zone2_supply_air_temperature':
      case 'freezer_zone3_temperature_setpoint':
      case 'freezer_zone3_return_air_temperature':
      case 'freezer_zone3_supply_air_temperature':
        return truAwareTempFormatter(params as unknown as ValueFormatterParams);

      case 'freezer_trs_comp1_humidity_setpoint':
      case 'freezer_trs_comp1_humidity':
        return node?.data?.synthetic_tru_status === 'ON' ? value : '';
      case 'freezer_datacold_sensor_temperature_1':
      case 'freezer_datacold_sensor_temperature_2':
      case 'freezer_datacold_sensor_temperature_3':
      case 'freezer_datacold_sensor_temperature_4':
      case 'freezer_datacold_sensor_temperature_5':
      case 'freezer_datacold_sensor_temperature_6':
      case 'sensor_temperature_1':
      case 'sensor_temperature_2':
      case 'sensor_temperature_3':
      case 'sensor_temperature_4':
      case 'sensor_temperature_5':
      case 'sensor_temperature_6':
        return tempFormatter({ value } as ValueFormatterParams);

      default:
        break;
    }

    return value;
  };

  const handleCsvExport = () => {
    if (history && history.length < 1) {
      return;
    }

    gridApi?.exportDataAsCsv({
      fileName: `${getFileNameToExport(t('assets.asset.table.export'))}.csv`,
      processCellCallback,
    });
  };

  const handleExcelExport = () => {
    if (history && history.length < 1) {
      return;
    }

    gridApi?.exportDataAsExcel({
      fileName: `${getFileNameToExport(t('assets.asset.table.export'))}.xlsx`,
      processCellCallback,
      pageSetup: defExcelSheetPageSetup,
      sheetName: `eventHistory-${assetId}`,
    });
  };

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

  const getRowClass = (params: IGetRowClassParams) =>
    params?.data?.synthetic_tru_status === 'ON' ? undefined : 'ag-grid-disabled-row';

  const filteredHistory = useMemo(
    () =>
      isFeatureTemperatureChartAndTableEnabled
        ? getFilteredEvents(history, selectedFrequency, legendSettings, chartConfig)
        : getFilteredHistory(history, selectedFrequency),
    [isFeatureTemperatureChartAndTableEnabled, history, selectedFrequency, legendSettings, chartConfig]
  );

  const frequencies: HistoryFrequency[] = ['1m', '5m', '15m', '1h'];

  const onColumnGroupOpened = useCallback(
    (event: ColumnGroupOpenedEvent) => {
      if (event.columnGroup.getGroupId() === 'compartment1') {
        setCompartment1GroupOpen(event.columnGroup.isExpanded());
      }
    },
    [setCompartment1GroupOpen]
  );

  return (
    <Box
      sx={{
        height: '593px',
      }}
    >
      {typeof temperatureChartColumns !== 'undefined' && (
        <div style={{ height: '100%' }}>
          <Table
            headerProps={{
              sx: {
                justifyContent: 'end',
                borderBottom: 1,
                borderColor: 'addition.divider',
              },
            }}
            headerContent={
              <Box display="flex" justifyContent="space-between" flex={1}>
                <Box>
                  {frequencies.map((frequency) => (
                    <Button
                      disabled={['1m', '5m'].includes(frequency) && frequencyButtonDisabled}
                      key={frequency}
                      variant="text"
                      onClick={() => {
                        setSelectedFrequency(frequency);
                        setSelectedView(null);
                      }}
                      sx={{
                        color: (theme) =>
                          frequency === selectedFrequency ? 'primary' : theme.palette.grey['500'],
                      }}
                    >
                      {`${t('common.every')} ${localizeHistoryFrequency(frequency, t)}`}
                    </Button>
                  ))}
                </Box>
                <HasPermission
                  action="dashboard.eventHistoryExport"
                  subjectType="COMPANY"
                  subjectId={tenantId}
                >
                  <ExportButton
                    disabled={listLoading || !history || history.length === 0}
                    onExportCsv={handleCsvExport}
                    onExportExcel={handleExcelExport}
                  />
                </HasPermission>
              </Box>
            }
            rowData={filteredHistory}
            getRowClass={getRowClass}
            columnDefs={savedColumns}
            suppressFieldDotNotation
            onGridReady={onGridReady}
            onColumnMoved={onColumnsChanged}
            onColumnPinned={onColumnsChanged}
            onColumnVisible={onColumnsChanged}
            onSortChanged={onColumnsChanged}
            onColumnResized={onColumnsChangedDebounced}
            getMainMenuItems={getMainMenuItems}
            getRowId={({ data }) => data.timestamp}
            onColumnGroupOpened={onColumnGroupOpened}
            pivotPanelShow="always"
            resizeColumnsToFit
            tooltipShowDelay={0}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: false,
              suppressSizeToFit: true,
            }}
            components={{
              SyntheticTruStatusRenderer: (params: EventHistoryTableCellRendererProps) =>
                SyntheticTruStatusRenderer({
                  flespiData: params.data,
                  table: 'eventHistory',
                  compartmentConfig,
                }),
              eventHistoryFormatter: (params: IEventHistoryParams) =>
                EventHistoryTableFormatter(params, getRowClass(params), isFeatureCompartmentOnOffModeEnabled),
            }}
          />
        </div>
      )}
    </Box>
  );
};
