import { Column } from '@ag-grid-community/core';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { RouteHistoryDefaultColIds } from '../types';

import { IColumnData, TimelineHeaderDef } from '@/types';

type TimelineColumnsConfig = Record<string, TimelineHeaderDef>;

export const timelineTableColumnsConfig: TimelineColumnsConfig = {
  event: {
    titleKey: 'assethistory.route.event',
    subTitleKey: 'assethistory.route.location',
  },
  location: {
    titleKey: 'assethistory.route.location',
    subTitleKey: '',
    sortable: true,
  },
  time: {
    titleKey: 'assethistory.route.time',
    subTitleKey: 'assethistory.route.date',
    sortable: true,
  },
  menu: {
    titleKey: '',
  },
  freezer_zone1_temperature_setpoint: {
    titleKey: 'C1',
    subTitleKey: 'common.setpoint',
    isTemperature: true,
  },
  freezer_zone1_supply_air_temperature: {
    titleKey: 'C1',
    subTitleKey: 'common.supply',
    isTemperature: true,
  },
  freezer_zone1_return_air_temperature: {
    titleKey: 'C1',
    subTitleKey: 'common.return',
    isTemperature: true,
  },
  freezer_zone2_temperature_setpoint: {
    titleKey: 'C2',
    subTitleKey: 'common.setpoint',
    isTemperature: true,
  },
  freezer_zone2_supply_air_temperature: {
    titleKey: 'C2',
    subTitleKey: 'common.supply',
    isTemperature: true,
  },
  freezer_zone2_return_air_temperature: {
    titleKey: 'C2',
    subTitleKey: 'common.return',
    isTemperature: true,
  },
  freezer_zone3_temperature_setpoint: {
    titleKey: 'C3',
    subTitleKey: 'common.setpoint',
    isTemperature: true,
  },
  freezer_zone3_supply_air_temperature: {
    titleKey: 'C3',
    subTitleKey: 'common.supply',
    isTemperature: true,
  },
  freezer_zone3_return_air_temperature: {
    titleKey: 'C3',
    subTitleKey: 'common.return',
    isTemperature: true,
  },
};

const lockedVisibleColumns = ['event', 'time', 'menu'];

const getColumnData = (
  colId: string,
  sensorColumnsConfig: Record<RouteHistoryDefaultColIds, TimelineHeaderDef>
): IColumnData | null => {
  if (!colId || lockedVisibleColumns.includes(colId)) {
    return null;
  }
  const colConfig =
    (timelineTableColumnsConfig[colId] as TimelineHeaderDef) ||
    (sensorColumnsConfig[colId] as TimelineHeaderDef) ||
    ({ titleKey: colId } as TimelineHeaderDef);

  if (colConfig.titleKey && colConfig.subTitleKey) {
    return { groupId: colConfig.titleKey, colId, colConfig, isVisible: false };
  }

  return null;
};

export const getAllColumnData = (
  columns: Maybe<Column[]> | undefined,
  sensorColumnsConfig: Record<RouteHistoryDefaultColIds, TimelineHeaderDef>
): Maybe<IColumnData[]> => {
  if (!columns) {
    return null;
  }

  const result: IColumnData[] = [];
  columns.forEach((column: Column) => {
    const columnConfig = getColumnData(column.getColId(), sensorColumnsConfig);
    if (columnConfig) {
      result.push(columnConfig);
    }
  });

  return result;
};
