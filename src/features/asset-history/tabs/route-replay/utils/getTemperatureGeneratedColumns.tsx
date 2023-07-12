import { ValueFormatterParams } from '@ag-grid-community/core';

import { GenerateTimelineTableColumns, RouteHistoryColIdType, RouteHistoryDefaultColIds } from '../types';
import { DEFAULT_TEMP_COLUMN_MIN_WIDTH } from '../constants';

import { UserSettings } from '@/providers/UserSettings';
import { TimelineHeaderDef } from '@/types';

export const getTemperatureGeneratedColumns = (
  temperatureUnit: UserSettings['temperature'],
  configuredFlespiFields: string[],
  tempFormatter: (params: ValueFormatterParams) => string,
  sensorColumnsConfig: Record<RouteHistoryDefaultColIds, TimelineHeaderDef>,
  visibleColumns: string[]
) => {
  const c1Columns: GenerateTimelineTableColumns = [];
  const c2Columns: GenerateTimelineTableColumns = [];
  const c3Columns: GenerateTimelineTableColumns = [];

  [1, 2, 3].forEach((compartment) => {
    const colIdSetPoint: RouteHistoryColIdType =
      `freezer_zone${compartment}_temperature_setpoint` as RouteHistoryColIdType;

    const colIdSupply: RouteHistoryColIdType =
      `freezer_zone${compartment}_supply_air_temperature` as RouteHistoryColIdType;

    const colIdReturn: RouteHistoryColIdType =
      `freezer_zone${compartment}_return_air_temperature` as RouteHistoryColIdType;

    const cellStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center' };

    const columns = [
      {
        colId: colIdSetPoint,
        headerComponent: 'headerRenderer',
        headerComponentParams: { options: { temperatureUnit, sensorColumnsConfig } },
        field: `freezer_zone${compartment}_temperature_setpoint`,
        minWidth: DEFAULT_TEMP_COLUMN_MIN_WIDTH,
        type: 'numericColumn',
        valueFormatter: tempFormatter,
        hide: !visibleColumns.includes(colIdSetPoint),
        cellStyle,
      },
      {
        colId: colIdSupply,
        headerComponent: 'headerRenderer',
        headerComponentParams: { options: { temperatureUnit, sensorColumnsConfig } },
        field: `freezer_zone${compartment}_supply_air_temperature`,
        minWidth: DEFAULT_TEMP_COLUMN_MIN_WIDTH,
        type: 'numericColumn',
        valueFormatter: tempFormatter,
        hide: !visibleColumns.includes(colIdSupply),
        cellStyle,
      },
      {
        colId: colIdReturn,
        headerComponent: 'headerRenderer',
        headerComponentParams: { options: { temperatureUnit, sensorColumnsConfig } },
        field: `freezer_zone${compartment}_return_air_temperature`,
        minWidth: DEFAULT_TEMP_COLUMN_MIN_WIDTH,
        type: 'numericColumn',
        valueFormatter: tempFormatter,
        hide: !visibleColumns.includes(colIdReturn),
        cellStyle,
      },
    ].filter((column) => configuredFlespiFields.includes(column.colId));

    if (compartment === 1) {
      c1Columns.push(...columns);
    }
    if (compartment === 2) {
      c2Columns.push(...columns);
    }
    if (compartment === 3) {
      c3Columns.push(...columns);
    }
  });

  return {
    c1Columns,
    c2Columns,
    c3Columns,
  };
};
