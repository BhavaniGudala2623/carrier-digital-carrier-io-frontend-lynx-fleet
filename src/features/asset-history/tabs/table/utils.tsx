import { ColDef, ColumnApi, GridApi } from '@ag-grid-community/core';
import {
  AssetHistoryData,
  Maybe,
  AssetGql,
  Device,
  Command,
  Sensor,
  Units,
  CompartmentConfig,
} from '@carrier-io/lynx-fleet-types';
import Chip from '@carrier-io/fds-react/Chip';
import { get } from 'lodash-es';

import { ParamsProps } from './types';

import { getSensorType } from '@/utils';
import { isColGroupGuard, isColNotGroupGuard } from '@/utils/saved-columns';
import type { SnapshotDataEx } from '@/features/common';
import { ColDefExt, ColGroupDefExt, Columns } from '@/types';

export const TIMESTAMP_COL_ID = 'timestamp';

export const ChipFormatter = (params: ParamsProps, opts?: { highlight?: string }) => {
  const { value } = params;

  if (value) {
    // eslint-disable-next-line react/destructuring-assignment
    const highlightValue = opts?.highlight && opts.highlight === value;

    return <Chip color={highlightValue ? 'primary' : 'secondary'} label={value} />;
  }

  return <span />;
};

const flattenSnapshot = <T extends Record<string, unknown>>(snapshot: T, prefix = '') =>
  Object.keys(snapshot).reduce((acc, key) => {
    const newPrefix = prefix.length ? `${prefix}.` : '';
    if (snapshot[key] && typeof snapshot[key] === 'object' && !Array.isArray(snapshot[key])) {
      Object.assign(acc, flattenSnapshot(snapshot[key] as Record<string, unknown>, newPrefix + key));
    } else if (key !== '__typename') {
      acc[newPrefix + key] = snapshot[key];
    }

    return acc;
  }, {} as Record<string, unknown>);

export const mapHistoryData = (
  data: AssetHistoryData,
  asset?: Maybe<AssetGql>,
  device?: Maybe<Device>,
  units?: Maybe<Units>
) => {
  const item = {
    ...data.item,
    asset,
    device,
    units,
    'flespiData.freezer_serial_number':
      data?.item?.flespiData?.freezer_serial_number || device?.truSerialNumber,
    useRawTimestamp: true,
  };

  const flatItem = flattenSnapshot(item);

  const flatChangedFields = Object.entries(data.changedFields ?? {}).reduce((acc, [key, fields]) => {
    if (!Array.isArray(fields)) {
      return acc;
    }

    return acc.concat(fields.map((field: string) => `${key}.${field}`));
  }, [] as string[]);

  return {
    ...flatItem,
    changedFields: new Set(flatChangedFields),
  };
};

export const getDataColdIncludeStatus = (device?: Device): boolean => {
  if (device?.includeDatacoldSensors !== null && device?.includeDatacoldSensors !== undefined) {
    return device.includeDatacoldSensors;
  }

  return (
    device?.sensors?.some((sensor) => sensor?.configured && getSensorType(sensor)?.includes('DATACOLD')) ??
    false
  );
};

export const getCommandFieldAffected = (data: ParamsProps['data']) =>
  data?.['formattedFields.commands']?.some(
    (command?: Maybe<Command>) => command?.affectedFields && command.affectedFields?.length > 0
  );

export const ignoreCellChangesIn = new Set([TIMESTAMP_COL_ID, 'longitude', 'latitude']);

export const COLUMNS_TO_HIGHLIGHT = new Set([
  'freezer_battery_voltage',
  'freezer_comp3_mode',
  'freezer_comp2_mode',
  'freezer_comp1_mode',
  'freezer_zone3_return_air_temperature',
  'freezer_zone2_return_air_temperature',
  'freezer_zone1_return_air_temperature',
  'freezer_zone3_temperature_setpoint',
  'freezer_zone2_temperature_setpoint',
  'freezer_zone1_temperature_setpoint',
  'freezer_zone3_supply_air_temperature',
  'freezer_zone2_supply_air_temperature',
  'freezer_zone1_supply_air_temperature',
  'rearDoor',
  'sideDoor',
  'engineControlMode',
  'enginePowerMode',
  'datacold_compartment1_ras',
  'datacold_compartment1_sas',
  'datacold_compartment1_box',
  'datacold_compartment2_ras',
  'datacold_compartment2_sas',
  'datacold_compartment2_box',
  'datacold_compartment3_ras',
  'datacold_compartment3_sas',
  'datacold_compartment3_box',
]);

export const COLUMNS_TO_CHECK = new Set([
  'rearDoor',
  'sideDoor',

  'freezer_zone1_temperature_setpoint',
  'freezer_zone1_supply_air_temperature',
  'freezer_zone1_return_air_temperature',
  'temp_compartment1_ras',
  'temp_compartment1_sas',
  'temp_compartment1_box',
  'datacold_compartment1_ras',
  'datacold_compartment1_sas',
  'datacold_compartment1_box',
  'bluetooth_compartment1_ras',
  'bluetooth_compartment1_sas',
  'bluetooth_compartment1_box',
  'freezer_trs_comp1_humidity_setpoint',
  'freezer_trs_comp1_humidity',

  'freezer_zone2_temperature_setpoint',
  'freezer_zone2_supply_air_temperature',
  'freezer_zone2_return_air_temperature',
  'temp_compartment2_ras',
  'temp_compartment2_sas',
  'temp_compartment2_box',
  'datacold_compartment2_ras',
  'datacold_compartment2_sas',
  'datacold_compartment2_box',
  'bluetooth_compartment2_ras',
  'bluetooth_compartment2_sas',
  'bluetooth_compartment2_box',

  'freezer_zone3_temperature_setpoint',
  'freezer_zone3_supply_air_temperature',
  'freezer_zone3_return_air_temperature',
  'temp_compartment3_ras',
  'temp_compartment3_sas',
  'temp_compartment3_box',
  'datacold_compartment3_ras',
  'datacold_compartment3_sas',
  'datacold_compartment3_box',
  'bluetooth_compartment3_ras',
  'bluetooth_compartment3_sas',
  'bluetooth_compartment3_box',
  'runHours',
]);

export const hideColumnsWithoutData = ({
  gridApi,
  columnApi,
}: {
  gridApi: GridApi;
  columnApi: ColumnApi;
}) => {
  const data: ({ changedFields: Set<string> } | Record<string, unknown>)[] = [];
  gridApi.forEachNode((node) => {
    if (node.data) {
      data.push(node.data);
    }
  });

  if (data.length === 0) {
    return;
  }

  const columnDefs = columnApi?.getColumns()?.map((c) => c.getColDef()) ?? [];
  const columnsToCheck = columnDefs.filter((c: ColDef) => COLUMNS_TO_CHECK.has(c.colId!));

  const visibleColumnIds = new Set<string>();
  const isColNotVisibleYet = (c: ColDef) => !visibleColumnIds.has(c.colId!);

  const checkColumn = (snapshot: SnapshotDataEx) => (c: ColDef) => {
    const fieldValue = get(snapshot, c.field!);
    if (fieldValue !== undefined && fieldValue !== null && !(fieldValue instanceof Object)) {
      visibleColumnIds.add(c.colId!);
    }
  };

  data.forEach((snapshot) => {
    columnsToCheck.filter(isColNotVisibleYet).forEach(checkColumn(snapshot));
  });

  const notVisibleColumns = columnsToCheck.filter(isColNotVisibleYet).map((c) => c.colId!);

  columnApi?.setColumnsVisible(notVisibleColumns, false);
};

export const getRowHasAlerts = (data: ParamsProps['data']) =>
  data?.alerts?.some((alert: { triggers?: string[] }) =>
    alert?.triggers?.some((trigger) => COLUMNS_TO_HIGHLIGHT.has(trigger))
  );

type ShowDatacoldSensorsConfig = { [key: string]: boolean };

const TEMPERATURE_SENSORS_TYPES = [
  'BOX1',
  'BOX2',
  'BOX3',
  'RAS1',
  'RAS2',
  'RAS3',
  'SAS1',
  'SAS2',
  'SAS3',
  'BOX1_DATACOLD',
  'BOX2_DATACOLD',
  'BOX3_DATACOLD',
  'RAS1_DATACOLD',
  'RAS2_DATACOLD',
  'RAS3_DATACOLD',
  'SAS1_DATACOLD',
  'SAS2_DATACOLD',
  'SAS3_DATACOLD',
  'BOX1_BT',
  'BOX2_BT',
  'BOX3_BT',
  'RAS1_BT',
  'RAS2_BT',
  'RAS3_BT',
  'SAS1_BT',
  'SAS2_BT',
  'SAS3_BT',
];

const getSensorParamName = (isBluetooth: boolean) =>
  isBluetooth ? 'bluetoothSensorTemperature' : 'sensorTemperature';

const defaultTempSensorConfiguration = TEMPERATURE_SENSORS_TYPES.reduce((acc, type) => {
  const sensorType = type.substring(0, 3);
  const compartmentNumber = type.substring(3, 4);
  const tempType = type.includes('DATACOLD')
    ? 'datacoldTemperature'
    : getSensorParamName(type.includes('BT'));
  acc[`formattedFields.${tempType}.C${compartmentNumber}.${sensorType}`] = true;

  return acc;
}, {} as ShowDatacoldSensorsConfig);

export const getColumnsToHide = (columns: Columns, device?: Maybe<Device>): Columns => {
  if (!device) {
    return columns;
  }

  const configuredTemperatureSensors = device.sensors
    ?.filter((sensor: Maybe<Sensor>) => {
      const sensorType = getSensorType(sensor);

      return sensor && sensor.configured && sensorType && TEMPERATURE_SENSORS_TYPES.includes(sensorType);
    })
    ?.reduce((acc: ShowDatacoldSensorsConfig, sensor: Maybe<Sensor>) => {
      const sensorType = getSensorType(sensor)?.substring(0, 3);
      const compartmentNumber = getSensorType(sensor)?.substring(3, 4);
      const tempType = getSensorType(sensor)?.includes('DATACOLD')
        ? 'datacoldTemperature'
        : getSensorParamName(sensor?.sensorType === 'BT_EN12830');
      acc[`formattedFields.${tempType}.C${compartmentNumber}.${sensorType}`] = false;

      return acc;
    }, defaultTempSensorConfiguration);

  if (!configuredTemperatureSensors) {
    return columns;
  }

  return columns.map((column) => {
    if (isColGroupGuard(column)) {
      const { children } = column;
      // This method will work only with single level of nested children
      // @ts-expect-error
      const newChildren = children.map((childColumn: ColDefExt) => {
        const childColumnField = childColumn?.field;

        if (childColumnField && configuredTemperatureSensors[childColumnField] !== undefined) {
          return {
            ...childColumn,
            hide: configuredTemperatureSensors[childColumnField],
          };
        }

        return childColumn;
      });

      return { ...column, children: newChildren };
    }

    if (
      isColNotGroupGuard(column) &&
      column?.field &&
      configuredTemperatureSensors[column.field] !== undefined
    ) {
      const columnField = column.field;

      return {
        ...column,
        hide: configuredTemperatureSensors[columnField],
      };
    }

    return column;
  });
};

export const hideFields = (columns: Columns, hiddenFields: string[]): Columns => {
  if (!hiddenFields.length) {
    return columns;
  }

  return columns.map((column) => {
    if (isColGroupGuard(column)) {
      const { children } = column;
      // This method will work only with single level of nested children
      // @ts-expect-error
      const newChildren = children.map((childColumn: ColDefExt) => {
        const childColumnField = childColumn?.field;

        if (childColumnField && hiddenFields.includes(childColumnField)) {
          return {
            ...childColumn,
            hide: true,
          };
        }

        return childColumn;
      });

      return { ...column, children: newChildren };
    }

    if (isColNotGroupGuard(column) && column?.field && hiddenFields.includes(column.field)) {
      return {
        ...column,
        hide: true,
      };
    }

    return column;
  });
};

export function removeNotConfiguredCompartmentColumns(
  columns: Columns,
  compartmentConfig: Maybe<CompartmentConfig>
) {
  const notConfiguredCompNumns = ([2, 3] as const).filter(
    (compNum) => !compartmentConfig?.[`comp${compNum}Configured`]
  );

  const columnsAfterGroupRemoval = columns.filter((column) => {
    if (isColNotGroupGuard(column)) {
      return true;
    }

    const compartmentColumnsToRemove = notConfiguredCompNumns.map((compNum) => `compartment${compNum}`);

    if (compartmentColumnsToRemove.includes(column.groupId)) {
      return false;
    }

    return true;
  });

  return columnsAfterGroupRemoval.map((column) => {
    if (isColNotGroupGuard(column)) {
      return column;
    }
    const { children } = column;
    const compartmentChildrenToRemove = notConfiguredCompNumns.map(
      (compNum) => `flespiData.freezer_comp${compNum}_mode`
    );

    return {
      ...column,
      children: children.filter((child: ColDef) => !compartmentChildrenToRemove.includes(child.field!)),
    } as ColGroupDefExt;
  });
}
