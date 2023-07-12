import { AssetDetails } from '@carrier-io/lynx-fleet-types';
import { ValueFormatterParams } from '@ag-grid-community/core';

import { GenerateTimelineTableColumns, RouteHistoryDefaultColIds } from '../types';
import { getSensorsGeneratedColumns, getTemperatureGeneratedColumns } from '../utils';
import { MENU_BUTTON_WIDTH } from '../constants';

import { temperatureFormatter } from '@/components';
import { Columns, TimelineHeaderDef } from '@/types';
import { UserSettings } from '@/providers/UserSettings';

interface GenerateColumnsProps {
  userSettings: UserSettings;
  popupHandler: (popupStatus: boolean, elementTarget) => void;
  isPopupOpen: boolean;
  configuredFlespiFields: string[];
  sensorColumnsConfig: Record<RouteHistoryDefaultColIds, TimelineHeaderDef>;
  visibleColumns: string[];
  deviceSensors?: AssetDetails['sensors'];
}

export const generateColumns = ({
  userSettings,
  popupHandler,
  isPopupOpen,
  configuredFlespiFields,
  sensorColumnsConfig,
  visibleColumns,
  deviceSensors,
}: GenerateColumnsProps): GenerateTimelineTableColumns | Columns => {
  const { dateFormat, timezone, temperature: temperatureUnit } = userSettings;
  const tempFormatter = (params: ValueFormatterParams) =>
    temperatureFormatter(params, { units: temperatureUnit });

  const {
    c1Columns: c1SensorColumns,
    c2Columns: c2SensorColumns,
    c3Columns: c3SensorColumns,
  } = getSensorsGeneratedColumns(
    temperatureUnit,
    configuredFlespiFields,
    tempFormatter,
    sensorColumnsConfig,
    visibleColumns,
    deviceSensors
  );

  const {
    c1Columns: c1TemperatureColumns,
    c2Columns: c2TemperatureColumns,
    c3Columns: c3TemperatureColumns,
  } = getTemperatureGeneratedColumns(
    temperatureUnit,
    configuredFlespiFields,
    tempFormatter,
    sensorColumnsConfig,
    visibleColumns
  );

  return [
    {
      colId: 'event',
      headerComponent: 'headerRenderer',
      field: 'name',
      minWidth: 200,
      initialWidth: 360,
      cellRenderer: 'eventCellRenderer',
    },
    {
      colId: 'time',
      headerComponent: 'headerRenderer',
      field: 'time',

      minWidth: 115,
      cellRenderer: 'dateTimeCellRenderer',
      cellRendererParams: { options: { dateFormat, timezone } },
      sortingOrder: ['asc', 'desc'],
    },
    ...c1TemperatureColumns,
    ...c1SensorColumns,
    ...c2TemperatureColumns,
    ...c2SensorColumns,
    ...c3TemperatureColumns,
    ...c3SensorColumns,
    {
      colId: 'gapColumn',
      field: '',
      headerName: '',
      suppressMenu: true,
      sortable: false,
      lockVisible: true,
      minWidth: 1,
      suppressSizeToFit: false,
      flex: 1,
    },
    {
      colId: 'location',
      field: '',
      hide: true,
      lockPosition: 'left',
    },
    {
      colId: 'menu',
      headerComponent: 'iconButtonHeaderRenderer',
      headerComponentParams: { props: { isPopupOpen, popupHandler } },
      field: 'menu',
      minWidth: MENU_BUTTON_WIDTH,
      maxWidth: MENU_BUTTON_WIDTH,
      suppressMenu: true,
      suppressSizeToFit: true,
      lockVisible: true,
      resizable: false,
      sortable: false,
      pinned: 'right',
      lockPosition: true,
    },
  ];
};
