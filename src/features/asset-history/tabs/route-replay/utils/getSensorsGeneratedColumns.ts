import { AssetDetails } from '@carrier-io/lynx-fleet-types';
import { ValueFormatterParams } from '@ag-grid-community/core';

import { GenerateTimelineTableColumns, RouteHistoryColIdType, RouteHistoryDefaultColIds } from '../types';
import { DEFAULT_SENSOR_COLUMN_MIN_WIDTH } from '../constants';

import { mapCompartmentToAvailableSensors } from './mapCompartmentToAvailableSensors';

import { UserSettings } from '@/providers/UserSettings';
import { TimelineHeaderDef } from '@/types';
import { getSensorFlespiKey } from '@/utils';

export const getSensorsGeneratedColumns = (
  temperatureUnit: UserSettings['temperature'],
  configuredFlespiFields: string[],
  tempFormatter: (params: ValueFormatterParams) => string,
  sensorColumnsConfig: Record<RouteHistoryDefaultColIds, TimelineHeaderDef>,
  visibleColumns: string[],
  deviceSensors?: AssetDetails['sensors']
) => {
  const availableSensors =
    deviceSensors?.filter((sensor) =>
      configuredFlespiFields.includes(getSensorFlespiKey(sensor.flespiKey, sensor.sensorType))
    ) || [];

  const compartmentToSensorFlespiFields = mapCompartmentToAvailableSensors(availableSensors);

  const c1Columns: GenerateTimelineTableColumns = [];
  const c2Columns: GenerateTimelineTableColumns = [];
  const c3Columns: GenerateTimelineTableColumns = [];

  Object.entries(compartmentToSensorFlespiFields).forEach(([compartment, configuredSensorFlespiFields]) => {
    const columns = configuredSensorFlespiFields.map((field) => ({
      colId: field as RouteHistoryColIdType,
      headerComponent: 'headerRenderer',
      headerComponentParams: { options: { temperatureUnit, sensorColumnsConfig } },
      field,
      minWidth: DEFAULT_SENSOR_COLUMN_MIN_WIDTH,
      type: 'numericColumn',
      valueFormatter: tempFormatter,
      hide: !visibleColumns.includes(field),
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    }));

    if (compartment === '1') {
      c1Columns.push(...columns);
    }
    if (compartment === '2') {
      c2Columns.push(...columns);
    }
    if (compartment === '3') {
      c3Columns.push(...columns);
    }
  });

  return {
    c1Columns,
    c2Columns,
    c3Columns,
  };
};
