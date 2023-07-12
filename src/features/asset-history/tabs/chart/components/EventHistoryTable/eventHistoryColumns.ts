import { TFunction } from 'i18next';
import { ValueFormatterParams } from '@ag-grid-community/core';
import { TemperatureType } from '@carrier-io/lynx-fleet-types';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { runHoursFormatter, dateTimeFormatter, truAwareHumiditySetpointFormatter } from '@/components';
import { ILegendSettings } from '@/providers/ApplicationContext';
import { Columns, ChartConfig, ColumnsEx, ChartConfigChildrenData } from '@/types';
import { IColumnsToDisplay } from '@/features/asset-history/types';
import { addTemperatureUnit, isI18nKeyForTemperatureColumn } from '@/utils';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';

type TempFormatterCallback = (
  params: ValueFormatterParams
) => ValueFormatterParams[keyof ValueFormatterParams];

export type EventHistoryColIdType =
  | 'timestamp'
  | 'freezer_air_temperature'
  | 'runHours'
  | 'freezer_zone1_temperature_setpoint'
  | 'freezer_zone1_return_air_temperature'
  | 'freezer_zone1_supply_air_temperature'
  | 'freezer_trs_comp1_humidity_setpoint'
  | 'freezer_trs_comp1_humidity'
  | 'freezer_zone2_temperature_setpoint'
  | 'freezer_zone2_return_air_temperature'
  | 'freezer_zone2_supply_air_temperature'
  | 'freezer_zone3_temperature_setpoint'
  | 'freezer_zone3_return_air_temperature'
  | 'freezer_zone3_supply_air_temperature'
  | 'address';

export type EventHistoryGroupIdType = 'compartment1' | 'compartment2' | 'compartment3' | 'events';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHistoryColumns = ColumnsEx<any, EventHistoryColIdType, EventHistoryGroupIdType>;

function removeUnavailableColumns(columns: EventHistoryColumns, availableColumns: IColumnsToDisplay = []) {
  return columns.filter((column) => {
    if ('field' in column && (column.field === 'timestamp' || column.field === 'address')) {
      return true;
    }

    // @ts-ignore
    if (!column.children) {
      return (
        // @ts-ignore
        availableColumns?.includes(column.field as never) ||
        // @ts-ignore
        availableColumns?.includes(column.eventName as never)
      );
    }

    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    column.children = removeUnavailableColumns(column.children, availableColumns);

    // @ts-ignore
    return column.children.length !== 0;
  });
}

export const generateEventHistoryColumns = (
  truAwareTempFormatter: TempFormatterCallback,
  tempFormatter: TempFormatterCallback,
  dateFormat: DateFormatType,
  temperatureUnit: TemperatureType,
  legendSettings: ILegendSettings,
  t: TFunction<'translation'>,
  isAT52Device: boolean,
  timezone: string,
  chartConfig: ChartConfig | undefined,
  compartment1GroupOpen: boolean,
  isFeatureAddressColumnEnabled: boolean
): EventHistoryColumns => {
  if (!chartConfig) {
    return [];
  }

  const getColumnHeaderName = (childrenData: ChartConfigChildrenData) => {
    const { i18nKey, label } = childrenData;

    if (!i18nKey) {
      return label;
    }

    return isI18nKeyForTemperatureColumn(i18nKey)
      ? addTemperatureUnit(t(i18nKey), temperatureUnit)
      : t(i18nKey);
  };

  const columns: EventHistoryColumns = [
    {
      colId: 'timestamp',
      field: 'timestamp',
      suppressSizeToFit: true,
      width: 200,
      minWidth: 200,
      headerName: t('assethistory.table.date-time'),
      headerTooltip: t('assethistory.table.date-time'),
      cellStyle: { textAlign: 'left' },
      pinned: 'left',
      lockPosition: true,
      lockVisible: true,
      valueFormatter: (params: ValueFormatterParams) =>
        dateTimeFormatter(params.value, {
          dateFormat,
          timezone,
        }),
    },
    {
      colId: 'freezer_air_temperature',
      field: 'freezer_air_temperature',
      type: 'numericColumn',
      headerName: addTemperatureUnit(t('assethistory.table.freezer-air-temperature'), temperatureUnit),
      headerTooltip: addTemperatureUnit(t('assethistory.table.freezer-air-temperature'), temperatureUnit),
      valueFormatter: truAwareTempFormatter,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'runHours',
      headerName: t('assets.asset.table.runHours'),
      headerTooltip: t('assets.asset.table.runHours'),
      field: 'freezer_electric_total',
      columnGroupShow: 'open',
      type: 'numericColumn',
      valueFormatter: (params) => runHoursFormatter(params),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      groupId: 'compartment1',
      headerName: t('assets.asset.table.c1'),
      headerTooltip: t('assets.asset.table.c1'),
      marryChildren: true,
      openByDefault: compartment1GroupOpen,
      children: [
        {
          colId: 'freezer_zone1_temperature_setpoint',
          field: 'freezer_zone1_temperature_setpoint',
          headerName: addTemperatureUnit(t('assethistory.graph.c1-setpoint'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c1-setpoint'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'freezer_zone1_return_air_temperature',
          field: 'freezer_zone1_return_air_temperature',
          headerName: addTemperatureUnit(t('assethistory.graph.c1-return'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c1-return'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          columnGroupShow: 'open',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'freezer_zone1_supply_air_temperature',
          field: 'freezer_zone1_supply_air_temperature',
          headerName: addTemperatureUnit(t('assethistory.graph.c1-supply'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c1-supply'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          columnGroupShow: 'open',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        ...(Object.keys(chartConfig?.c1?.children || {})
          .filter(
            (key) =>
              ![
                'freezer_zone1_temperature_setpoint',
                'freezer_zone1_return_air_temperature',
                'freezer_zone1_supply_air_temperature',
              ].includes(key)
          )
          .map((key) => {
            const headerName = getColumnHeaderName(chartConfig.c1.children[key]);

            return {
              colId: key,
              field: key,
              headerName,
              headerTooltip: headerName,
              valueFormatter: tempFormatter,
              type: 'numericColumn',
              columnGroupShow: 'open',
              minWidth: DEFAULT_COLUMN_MIN_WIDTH,
            };
          }) as EventHistoryColumns),
        {
          colId: 'freezer_trs_comp1_humidity_setpoint',
          field: 'freezer_trs_comp1_humidity_setpoint',
          headerName: t('assets.asset.table.c1-humidity-setpoint'),
          headerTooltip: t('assets.asset.table.c1-humidity-setpoint'),
          type: 'numericColumn',
          columnGroupShow: 'open',
          valueFormatter: (params) => truAwareHumiditySetpointFormatter(params, t),
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'freezer_trs_comp1_humidity',
          field: 'freezer_trs_comp1_humidity',
          headerName: t('assets.asset.table.c1-humidity'),
          headerTooltip: t('assets.asset.table.c1-humidity'),
          valueFormatter: (params) => (params.data?.synthetic_tru_status === 'ON' ? params.value : ''),
          type: 'numericColumn',
          columnGroupShow: 'open',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
      ],
    },
    {
      groupId: 'compartment2',
      headerName: t('assets.asset.table.c2'),
      headerTooltip: t('assets.asset.table.c2'),
      marryChildren: true,
      children: [
        {
          colId: 'freezer_zone2_temperature_setpoint',
          field: 'freezer_zone2_temperature_setpoint',
          headerName: addTemperatureUnit(t('assethistory.graph.c2-setpoint'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c2-setpoint'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'freezer_zone2_return_air_temperature',
          field: 'freezer_zone2_return_air_temperature',
          headerName: addTemperatureUnit(t('assethistory.graph.c2-return'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c2-return'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          columnGroupShow: 'open',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'freezer_zone2_supply_air_temperature',
          field: 'freezer_zone2_supply_air_temperature',
          headerName: addTemperatureUnit(t('assethistory.graph.c2-supply'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c2-supply'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          columnGroupShow: 'open',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        ...(Object.keys(chartConfig?.c2?.children || {})
          .filter(
            (key) =>
              ![
                'freezer_zone2_temperature_setpoint',
                'freezer_zone2_return_air_temperature',
                'freezer_zone2_supply_air_temperature',
              ].includes(key)
          )
          .map((key) => {
            const headerName = getColumnHeaderName(chartConfig.c2.children[key]);

            return {
              colId: key,
              field: key,
              headerName,
              headerTooltip: headerName,
              valueFormatter: tempFormatter,
              type: 'numericColumn',
              columnGroupShow: 'open',
              minWidth: DEFAULT_COLUMN_MIN_WIDTH,
            };
          }) as EventHistoryColumns),
      ],
    },
    {
      groupId: 'compartment3',
      headerName: t('assets.asset.table.c3'),
      headerTooltip: t('assets.asset.table.c3'),
      marryChildren: true,
      children: [
        {
          colId: 'freezer_zone3_temperature_setpoint',
          field: 'freezer_zone3_temperature_setpoint',
          headerName: addTemperatureUnit(t('assethistory.graph.c3-setpoint'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c3-setpoint'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'freezer_zone3_return_air_temperature',
          field: 'freezer_zone3_return_air_temperature',
          headerName: addTemperatureUnit(t('assethistory.graph.c3-return'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c3-return'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          columnGroupShow: 'open',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'freezer_zone3_supply_air_temperature',
          field: 'freezer_zone3_supply_air_temperature',
          headerName: addTemperatureUnit(t('assethistory.graph.c3-supply'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assethistory.graph.c3-supply'), temperatureUnit),
          valueFormatter: truAwareTempFormatter,
          type: 'numericColumn',
          columnGroupShow: 'open',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        ...(Object.keys(chartConfig?.c3?.children || {})
          .filter(
            (key) =>
              ![
                'freezer_zone3_temperature_setpoint',
                'freezer_zone3_return_air_temperature',
                'freezer_zone3_supply_air_temperature',
              ].includes(key)
          )
          .map((key) => {
            const headerName = getColumnHeaderName(chartConfig.c3.children[key]);

            return {
              colId: key,
              field: key,
              headerName,
              headerTooltip: headerName,
              valueFormatter: tempFormatter,
              type: 'numericColumn',
              columnGroupShow: 'open',
              minWidth: DEFAULT_COLUMN_MIN_WIDTH,
            };
          }) as EventHistoryColumns),
      ],
    },
    {
      groupId: 'events',
      headerName: t('assethistory.graph.events'),
      headerTooltip: t('assethistory.graph.events'),
      marryChildren: true,
      children: Object.keys(chartConfig?.events?.children || {})
        .filter((c) => chartConfig?.events?.children[c].available)
        .map((child, i) => {
          const field = chartConfig.events.children[child].dataKey || `no_field_${i}`;

          const cellRenderer =
            field === 'synthetic_tru_status' ? 'SyntheticTruStatusRenderer' : 'eventHistoryFormatter';

          const headerName = chartConfig.events.children[child].i18nKey
            ? t(chartConfig.events.children[child].i18nKey!)
            : chartConfig.events.children[child].label;

          const column: Columns[number] & { eventName: string } = {
            colId: field,
            field,
            headerName,
            headerTooltip: headerName,
            eventName: child,
            tooltipValueGetter: ({ value }) =>
              value ? chartConfig.events.children[child].tooltipValueGetter?.(value) : undefined,
            cellStyle: { textAlign: 'left' },
            minWidth: cellRenderer === 'SyntheticTruStatusRenderer' ? 230 : DEFAULT_COLUMN_MIN_WIDTH,
            cellRenderer,
          };

          if (i !== 0) {
            column.columnGroupShow = 'open';
          }

          return column;
        }) as EventHistoryColumns,
    },
    ...((isFeatureAddressColumnEnabled
      ? [
          {
            colId: 'address',
            field: 'address',
            headerName: t('assets.asset.table.address'),
            headerTooltip: t('assets.asset.table.address'),
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
        ]
      : []) as EventHistoryColumns),
  ];

  const gapColumn = {
    colId: '',
    field: '',
    headerName: '',
    suppressMenu: true,
    sortable: false,
    lockVisible: true,
    minWidth: 1,
    width: 1,
    suppressSizeToFit: false,
    suppressColumnsToolPanel: true,
  };

  const isC1Active = legendSettings?.columnsToDisplay?.includes('c1');
  const c1ActiveAT52AvailableColumns = ['freezer_trs_comp1_humidity_setpoint', 'freezer_trs_comp1_humidity'];

  let availableColumns: string[] = isC1Active && isAT52Device ? c1ActiveAT52AvailableColumns : [];

  if (legendSettings?.columnsToDisplay) {
    availableColumns = availableColumns.concat(legendSettings.columnsToDisplay);
  }

  // @ts-ignore
  return [...removeUnavailableColumns(columns, availableColumns), gapColumn];
};
