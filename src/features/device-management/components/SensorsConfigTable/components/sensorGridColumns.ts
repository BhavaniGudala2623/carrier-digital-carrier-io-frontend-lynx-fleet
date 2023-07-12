import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { SensorVersion } from '../../../types';

import { Columns } from '@/types';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';
import { dateTimeFormatter } from '@/components';

export function getSensorGridColumns(
  translate: (val: string) => string,
  editAllowed: boolean | undefined,
  sensorVersion: SensorVersion,
  dateFormat: DateFormatType,
  timezone: string,
  isFeatureDeviceCommissioningSensorTimestampsEnabled: boolean,
  isFeatureDeviceCommissioningSensorBLEnabled: boolean,
  isTemperatureSensor1WireBLE,
  isCommissionedSensor
): Columns {
  const columns: Columns = [
    {
      field: 'display',
      headerName: translate('device.management.sensor.config.sensor-name'),
      pinned: 'left',
      cellRenderer: 'sensorFieldFormatter',
      minWidth: 220,
      cellStyle: (): Record<string, string> => ({
        display: 'flex',
        alignItems: 'center',
      }),
      lockVisible: true,
    },
    {
      field: 'sensorLocation',
      headerName: translate('device.management.sensor.config.sensor-location'),
      cellRenderer: 'sensorLocationFormatter',
      cellStyle: () => ({
        display: 'flex',
      }),
      minWidth: 210,
      cellRendererParams: { editAllowed },
      cellClass: 'cellWithSelect',
      equals: (valueA, valueB) => {
        if (
          valueA.sensorLocationDoor !== valueB.sensorLocationDoor ||
          valueA.sensorLocationTemp !== valueB.sensorLocationTemp
        ) {
          return false;
        }

        return true;
      },
    },
    {
      field: 'compatibleWithEN12830',
      headerName: 'EN12830',
      cellRenderer: 'sensorCompatibleFormatter',
      cellRendererParams: { editAllowed, sensorVersion },
      cellStyle: () => ({
        display: 'flex',
      }),
      cellClass: 'cellWithSelect',
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      field: 'sensorMacId',
      headerName: translate('device.management.sensor.config.sensor-mac-id'),
      headerTooltip: translate('device.management.sensor.config.sensor-mac-id'),
      cellRenderer: 'sensorMacIdFormatter',
      cellStyle: (): Record<string, string> => ({
        display: 'flex',
        alignItems: 'center',
      }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      tooltipValueGetter: (params) => {
        const {
          data: { dataField, idField },
          value,
        } = params;

        return isFeatureDeviceCommissioningSensorBLEnabled &&
          !isCommissionedSensor &&
          isTemperatureSensor1WireBLE?.(dataField, idField)
          ? translate('device.management.sensor.config.sensor-mac-id-double-click')
          : value;
      },
    },
    {
      field: 'sensorValue',
      headerName: translate('device.management.sensor.config.sensor-value'),
      cellRenderer: 'sensorValueFormatter',
      cellStyle: (): Record<string, string> => ({
        display: 'flex',
        alignItems: 'center',
      }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    ...(isFeatureDeviceCommissioningSensorTimestampsEnabled
      ? [
          {
            field: 'lastUpdated',
            headerName: translate('common.last-updated'),
            cellStyle: (): Record<string, string> => ({
              display: 'flex',
              alignItems: 'center',
            }),
            valueFormatter: (params) => dateTimeFormatter(params.value, { dateFormat, timezone }),
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
        ]
      : []),
    {
      field: 'sensorType',
      headerName: translate('device.management.sensor.config.sensor-type'),
      cellRenderer: 'sensorTypeFormatter',
      cellStyle: (): Record<string, string> => ({
        display: 'flex',
        alignItems: 'center',
      }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      field: 'installed',
      headerName: translate('device.management.sensor.config.sensor-time-installed'),
      headerTooltip: translate('device.management.sensor.config.sensor-time-installed'),
      cellRenderer: 'sensorInstalledFormatter',
      cellStyle: (): Record<string, string> => ({
        display: 'flex',
        alignItems: 'flext-start',
      }),
      cellRendererParams: { editAllowed },
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: '',
      field: '',
      headerName: '',
      suppressMenu: true,
      sortable: false,
      lockVisible: true,
      minWidth: 1,
      width: 1,
      suppressSizeToFit: false,
    },
    {
      field: 'configured',
      headerName: translate('device.management.sensor.config.sensor-installation-complete'),
      headerTooltip: translate('device.management.sensor.config.sensor-installation-complete'),
      cellRenderer: 'confirmationFormatter',
      pinned: 'right',
      cellRendererParams: { editAllowed },
      cellClass: 'cellWithDateTimePicker',
      equals: (valueA, valueB) => {
        if (valueA.value !== valueB.value || valueA.isDisabled !== valueB.isDisabled) {
          return false;
        }

        return true;
      },
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
  ];

  if (sensorVersion !== SensorVersion.Datacold) {
    columns.splice(2, 0, {
      field: 'connectionLocation',
      headerName: translate('device.management.sensor.config.sensor-connection-location'),
      headerTooltip: translate('device.management.sensor.config.sensor-connection-location'),
      cellRenderer: 'connectionLocationFormatter',
      cellStyle: () => ({
        display: 'flex',
      }),
      minWidth: 210,
      cellRendererParams: { editAllowed },
      cellClass: 'cellWithSelect',
      equals: (valueA, valueB) => {
        if (valueA.value !== valueB.value || valueA.isDisabled !== valueB.isDisabled) {
          return false;
        }

        return true;
      },
    });
  }

  return columns;
}
