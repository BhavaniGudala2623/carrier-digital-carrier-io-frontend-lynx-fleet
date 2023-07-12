import { TFunction } from 'i18next';
import { ITooltipParams, ValueFormatterParams } from '@ag-grid-community/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TIMESTAMP_COL_ID } from '../utils';
import { ParamsProps } from '../types';
import {
  BatteryVoltageFormatterAdapter,
  MovementStatusFormatter,
  SoftwareVersionFormatterAdapter,
  RunHoursFormatterAdapter,
} from '../column-formatters';

import { ColumnsEx } from '@/types';
import { doorStatusFormatter, humiditySetpointFormatter, timestampFormatter } from '@/components';
import { addTemperatureUnit, freezerAlarmComparator } from '@/utils';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';
import { useUserSettings } from '@/providers/UserSettings';
import { useApplicationContext } from '@/providers/ApplicationContext';

type TempFormatterCallback = (
  params: ValueFormatterParams
) => ValueFormatterParams[keyof ValueFormatterParams];

export type AssetHistoryColIdType =
  | 'assetName'
  | 'assetStatus'
  | 'batteryCurrent'
  | 'batteryStatus'
  | 'datacold_compartment1_box'
  | 'datacold_compartment1_ras'
  | 'datacold_compartment1_sas'
  | 'datacold_compartment2_box'
  | 'datacold_compartment2_ras'
  | 'datacold_compartment2_sas'
  | 'datacold_compartment3_box'
  | 'datacold_compartment3_ras'
  | 'datacold_compartment3_sas'
  | 'bluetooth_compartment1_box'
  | 'bluetooth_compartment1_ras'
  | 'bluetooth_compartment1_sas'
  | 'bluetooth_compartment2_box'
  | 'bluetooth_compartment2_ras'
  | 'bluetooth_compartment2_sas'
  | 'bluetooth_compartment3_box'
  | 'bluetooth_compartment3_ras'
  | 'bluetooth_compartment3_sas'
  | 'engineControlMode'
  | 'enginePowerMode'
  | 'engineRunHours'
  | 'freezer_battery_voltage'
  | 'freezer_comp1_mode'
  | 'freezer_comp2_mode'
  | 'freezer_comp3_mode'
  | 'freezer_trs_comp1_humidity_setpoint'
  | 'freezer_trs_comp1_humidity'
  | 'freezer_zone1_return_air_temperature'
  | 'freezer_zone1_supply_air_temperature'
  | 'freezer_zone1_temperature_setpoint'
  | 'freezer_zone2_return_air_temperature'
  | 'freezer_zone2_supply_air_temperature'
  | 'freezer_zone2_temperature_setpoint'
  | 'freezer_zone3_return_air_temperature'
  | 'freezer_zone3_supply_air_temperature'
  | 'freezer_zone3_temperature_setpoint'
  | 'freezerAlarms'
  | 'address'
  | 'latitude'
  | 'longitude'
  | 'movementStatus'
  | 'positionSpeed'
  | 'rearDoor'
  | 'runHours'
  | 'sideDoor'
  | 'softwareVersion'
  | 'standbyHours'
  | 'syntheticTruStatus'
  | 'temp_compartment1_box'
  | 'temp_compartment1_ras'
  | 'temp_compartment1_sas'
  | 'temp_compartment2_box'
  | 'temp_compartment2_ras'
  | 'temp_compartment2_sas'
  | 'temp_compartment3_box'
  | 'temp_compartment3_ras'
  | 'temp_compartment3_sas'
  | 'timestamp'
  | 'totalCommands'
  | 'truControlSystemType'
  | 'truFuelLevel'
  | 'truModelNumber'
  | 'truSerialNumber';

export type AssetHistoryGroupIdType =
  | '2way-commands'
  | 'battery'
  | 'compartment1'
  | 'compartment2'
  | 'compartment3'
  | 'details'
  | 'doors'
  | 'location'
  | 'tru-metrics';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseGetAssetHistoryColumns = ColumnsEx<any, AssetHistoryColIdType, AssetHistoryGroupIdType>;

const assetStatusLabelGetter = (t: TFunction, params: ITooltipParams) => {
  if (params?.value === undefined || params?.value === null) {
    return '';
  }

  return params.value === 'Moving'
    ? t('assets.asset.table.vehicle-moving')
    : t('assets.asset.table.vehicle-not-moving');
};

export const useGetAssetHistoryColumns = (
  tempFormatter: TempFormatterCallback,
  includeDataCold = false
): UseGetAssetHistoryColumns => {
  const { t } = useTranslation();
  const { featureFlags } = useApplicationContext();
  const { userSettings } = useUserSettings();
  const { featureFlags: { REACT_APP_FEATURE_PHYSICAL_ADDRESS: isAddressEnabled } = {} } =
    useApplicationContext();

  const { temperature: temperatureUnit, timezone, dateFormat } = userSettings;
  const isFeatureBluetoothSensorsManagementEnabled =
    featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT;

  return useMemo(() => {
    const columns: UseGetAssetHistoryColumns = [
      {
        colId: TIMESTAMP_COL_ID,
        field: 'flespiData.timestamp',
        pinned: 'left',
        sortable: true,
        lockVisible: true,
        valueFormatter: (params: ParamsProps) =>
          timestampFormatter(params.value, dateFormat, { timezone, dateOptions: { variant: 'dateTime' } }),
        headerName: t('common.timestamp'),
        cellStyle: { textAlign: 'left' },
        minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      },
      {
        groupId: 'details',
        headerName: t('common.details'),
        children: [
          {
            colId: 'assetName',
            headerName: t('assets.asset.table.asset-name'),
            headerTooltip: t('assets.asset.table.asset-name'),
            cellStyle: { textAlign: 'left' },
            field: 'asset.name',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'truSerialNumber',
            headerName: t('assets.asset.table.tru-serial-number'),
            headerTooltip: t('assets.asset.table.tru-serial-number'),
            field: 'device.truSerialNumber',
            cellStyle: { textAlign: 'left' },
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'assetStatus',
            field: 'formattedFields.assetStatus',
            headerName: t('assets.asset.table.asset-status'),
            headerTooltip: t('assets.asset.table.asset-status'),
            cellRenderer: `assetStatusFormatter`,
            cellStyle: { display: 'flex', alignItems: 'center' },
            tooltipValueGetter: (params) => assetStatusLabelGetter(t, params),
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'syntheticTruStatus',
            field: 'flespiData.synthetic_tru_status',
            headerName: t('assets.asset.table.tru-status'),
            headerTooltip: t('assets.asset.table.tru-status'),
            columnGroupShow: 'open',
            width: 230,
            cellRenderer: 'SyntheticTruStatusRenderer',
            resizable: false,
          },
          {
            colId: 'truModelNumber',
            headerName: t('device.management.drawer.TRU-model-number'),
            headerTooltip: t('device.management.drawer.TRU-model-number'),
            field: 'device.truModelNumber',
            cellStyle: { textAlign: 'left' },
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezerAlarms',
            field: 'freezerAlarms',
            headerName: t('common.alarms'),
            headerTooltip: t('common.alarms'),
            cellRenderer: 'freezerAlarmFormatter',
            comparator: (_valueA, _valueB, nodeA, nodeB) => freezerAlarmComparator(nodeA, nodeB),
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'enginePowerMode',
            field: 'computedFields.enginePowerMode',
            headerName: t('assets.asset.table.power-mode'),
            headerTooltip: t('assets.asset.table.power-mode'),
            cellStyle: { textAlign: 'left' },
            cellRenderer: 'cellChipRenderer',
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'engineControlMode',
            field: 'computedFields.engineControlMode',
            headerName: t('assets.asset.table.control-mode'),
            headerTooltip: t('assets.asset.table.control-mode'),
            cellStyle: { textAlign: 'left' },
            cellRenderer: 'cellChipRenderer',
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'truControlSystemType',
            headerName: t('device.management.device.info.TRU-control-system-type'),
            headerTooltip: t('device.management.device.info.TRU-control-system-type'),
            field: 'flespiData.freezer_control_mode',
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'batteryStatus',
            field: 'formattedFields.batteryStatus',
            headerName: t('assets.asset.table.device-battery-level'),
            headerTooltip: t('assets.asset.table.device-battery-level'),
            cellRenderer: 'batteryStatusFormatter',
            cellStyle: { textAlign: 'left' },
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'engineRunHours',
            headerName: t('assethistory.table.freezer-engine-total'),
            headerTooltip: t('assethistory.table.freezer-engine-total'),
            field: 'flespiData.freezer_engine_total',
            cellStyle: { textAlign: 'left' },
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'standbyHours',
            headerName: t('assethistory.table.freezer-standby-total'),
            headerTooltip: t('assethistory.table.freezer-standby-total'),
            field: 'flespiData.freezer_standby_total',
            cellStyle: { textAlign: 'left' },
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'positionSpeed',
            headerName: t('assethistory.table.position-speed'),
            headerTooltip: t('assethistory.table.position-speed'),
            field: 'flespiData.position_speed',
            cellStyle: { textAlign: 'left' },
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'movementStatus',
            headerName: t('assets.asset.table.vehicle-moving'),
            headerTooltip: t('assets.asset.table.vehicle-moving'),
            field: 'formattedFields.movementStatus',
            cellStyle: { textAlign: 'left' },
            columnGroupShow: 'open',
            valueFormatter: (params) => MovementStatusFormatter(t, params?.value),
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
        ],
      },
      {
        groupId: '2way-commands',
        headerName: t('assethistory.table.2way-commands'),
        marryChildren: false,
        children: [
          {
            colId: 'totalCommands',
            field: 'totalCommands',
            headerName: t('assethistory.table.total-commands'),
            headerTooltip: t('assethistory.table.total-commands'),
            cellStyle: { textAlign: 'left' },
            cellRenderer: 'commandsFormatter',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
        ],
      },
      {
        groupId: 'doors',
        headerName: t('assethistory.table.doors'),
        headerTooltip: t('assethistory.table.doors'),
        marryChildren: false,
        children: [
          {
            colId: 'rearDoor',
            headerName: t('assets.asset.table.rearDoor'),
            headerTooltip: t('assets.asset.table.rearDoor'),
            field: 'computedFields.doorStatus.rearDoor',
            valueFormatter: (params) => doorStatusFormatter(params, t),
            cellStyle: { textAlign: 'left' },
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'sideDoor',
            headerName: t('assets.asset.table.sideDoor'),
            field: 'computedFields.doorStatus.sideDoor',
            valueFormatter: (params) => doorStatusFormatter(params, t),
            columnGroupShow: 'open',
            cellStyle: { textAlign: 'left' },
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
        ],
      },
      {
        groupId: 'compartment1',
        headerName: t('asset.compartment1'),
        marryChildren: false,
        children: [
          {
            colId: 'freezer_zone1_temperature_setpoint',
            headerName: addTemperatureUnit(t('assets.asset.table.c1-setpoint'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-setpoint'), temperatureUnit),
            field: 'formattedFields.c1Setpoint',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_zone1_supply_air_temperature',
            headerName: addTemperatureUnit(t('assets.asset.table.c1-supply'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-supply'), temperatureUnit),
            field: 'formattedFields.c1Supply',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_zone1_return_air_temperature',
            hide: true,
            headerName: addTemperatureUnit(t('assethistory.graph.c1-return'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assethistory.graph.c1-return'), temperatureUnit),
            field: 'formattedFields.c1Return',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment1_ras',
            headerName: addTemperatureUnit(t('assets.asset.table.c1-ras-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-ras-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C1.RAS',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment1_sas',
            headerName: addTemperatureUnit(t('assets.asset.table.c1-sas-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-sas-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C1.SAS',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment1_box',
            headerName: addTemperatureUnit(t('assets.asset.table.c1-box-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-box-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C1.BOX',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },

          {
            colId: 'freezer_trs_comp1_humidity_setpoint',
            headerName: t('assets.asset.table.c1-humidity-setpoint'),
            headerTooltip: t('assets.asset.table.c1-humidity-setpoint'),
            field: 'flespiData.freezer_trs_comp1_humidity_setpoint',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: (params) => humiditySetpointFormatter(params, t),
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_trs_comp1_humidity',
            headerName: t('assets.asset.table.c1-humidity'),
            headerTooltip: t('assets.asset.table.c1-humidity'),
            field: 'flespiData.freezer_trs_comp1_humidity',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          ...(includeDataCold
            ? ([
                {
                  colId: 'datacold_compartment1_ras',
                  headerName: addTemperatureUnit(t('assethistory.table.c1-datacold-ras'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c1-datacold-ras'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C1.RAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'datacold_compartment1_sas',
                  headerName: addTemperatureUnit(t('assethistory.table.c1-datacold-sas'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c1-datacold-sas'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C1.SAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'datacold_compartment1_box',
                  headerName: addTemperatureUnit(t('assethistory.table.c1-datacold-box'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c1-datacold-box'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C1.BOX',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
              ] as UseGetAssetHistoryColumns)
            : []),
          ...(isFeatureBluetoothSensorsManagementEnabled
            ? ([
                {
                  colId: 'bluetooth_compartment1_ras',
                  headerName: addTemperatureUnit(t('assethistory.table.c1-bt-ras'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c1-bt-ras'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C1.RAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'bluetooth_compartment1_sas',
                  headerName: addTemperatureUnit(t('assethistory.table.c1-bt-sas'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c1-bt-sas'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C1.SAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'bluetooth_compartment1_box',
                  headerName: addTemperatureUnit(t('assethistory.table.c1-bt-box'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c1-bt-box'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C1.BOX',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
              ] as UseGetAssetHistoryColumns)
            : []),
        ],
      },
      {
        groupId: 'compartment2',
        headerName: t('asset.compartment2'),
        marryChildren: false,
        children: [
          {
            colId: 'freezer_zone2_temperature_setpoint',
            headerName: addTemperatureUnit(t('assets.asset.table.c2-setpoint'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-setpoint'), temperatureUnit),
            field: 'formattedFields.c2Setpoint',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_zone2_supply_air_temperature',
            headerName: addTemperatureUnit(t('assets.asset.table.c2-supply'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-supply'), temperatureUnit),
            field: 'formattedFields.c2Supply',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_zone2_return_air_temperature',
            headerName: addTemperatureUnit(t('assethistory.graph.c2-return'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assethistory.graph.c2-return'), temperatureUnit),
            field: 'formattedFields.c2Return',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment2_ras',
            headerName: addTemperatureUnit(t('assets.asset.table.c2-ras-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-ras-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C2.RAS',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment2_sas',
            headerName: addTemperatureUnit(t('assets.asset.table.c2-sas-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-sas-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C2.SAS',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment2_box',
            headerName: addTemperatureUnit(t('assets.asset.table.c2-box-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-box-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C2.BOX',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          ...(includeDataCold
            ? ([
                {
                  colId: 'datacold_compartment2_ras',
                  headerName: addTemperatureUnit(t('assethistory.table.c2-datacold-ras'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c2-datacold-ras'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C2.RAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'datacold_compartment2_sas',
                  headerName: addTemperatureUnit(t('assethistory.table.c2-datacold-sas'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c2-datacold-sas'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C2.SAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'datacold_compartment2_box',
                  headerName: addTemperatureUnit(t('assethistory.table.c2-datacold-box'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c2-datacold-box'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C2.BOX',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
              ] as UseGetAssetHistoryColumns)
            : []),
          ...(isFeatureBluetoothSensorsManagementEnabled
            ? ([
                {
                  colId: 'bluetooth_compartment2_ras',
                  headerName: addTemperatureUnit(t('assethistory.table.c2-bt-ras'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c2-bt-ras'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C2.RAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'bluetooth_compartment2_sas',
                  headerName: addTemperatureUnit(t('assethistory.table.c2-bt-sas'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c2-bt-sas'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C2.SAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'bluetooth_compartment2_box',
                  headerName: addTemperatureUnit(t('assethistory.table.c2-bt-box'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c2-bt-box'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C2.BOX',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
              ] as UseGetAssetHistoryColumns)
            : []),
        ],
      },
      {
        groupId: 'compartment3',
        headerName: t('asset.compartment3'),
        marryChildren: false,
        children: [
          {
            colId: 'freezer_zone3_temperature_setpoint',
            headerName: addTemperatureUnit(t('assets.asset.table.c3-setpoint'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-setpoint'), temperatureUnit),
            field: 'formattedFields.c3Setpoint',
            hide: true,
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_zone3_supply_air_temperature',
            headerName: addTemperatureUnit(t('assets.asset.table.c3-supply'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-supply'), temperatureUnit),
            field: 'formattedFields.c3Supply',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_zone3_return_air_temperature',
            headerName: addTemperatureUnit(t('assethistory.graph.c3-return'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assethistory.graph.c3-return'), temperatureUnit),
            field: 'formattedFields.c3Return',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment3_ras',
            headerName: addTemperatureUnit(t('assets.asset.table.c3-ras-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-ras-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C3.RAS',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment3_sas',
            headerName: addTemperatureUnit(t('assets.asset.table.c3-sas-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-sas-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C3.SAS',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'temp_compartment3_box',
            headerName: addTemperatureUnit(t('assets.asset.table.c3-box-sensor'), temperatureUnit),
            headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-box-sensor'), temperatureUnit),
            field: 'formattedFields.sensorTemperature.C3.BOX',
            columnGroupShow: 'open',
            type: 'numericColumn',
            cellStyle: { textAlign: 'right' },
            valueFormatter: tempFormatter,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          ...(includeDataCold
            ? ([
                {
                  colId: 'datacold_compartment3_ras',
                  headerName: addTemperatureUnit(t('assethistory.table.c3-datacold-ras'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c3-datacold-ras'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C3.RAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'datacold_compartment3_sas',
                  headerName: addTemperatureUnit(t('assethistory.table.c3-datacold-sas'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c3-datacold-sas'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C3.SAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'datacold_compartment3_box',
                  headerName: addTemperatureUnit(t('assethistory.table.c3-datacold-box'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c3-datacold-box'), temperatureUnit),
                  field: 'formattedFields.datacoldTemperature.C3.BOX',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
              ] as UseGetAssetHistoryColumns)
            : []),
          ...(isFeatureBluetoothSensorsManagementEnabled
            ? ([
                {
                  colId: 'bluetooth_compartment3_ras',
                  headerName: addTemperatureUnit(t('assethistory.table.c3-bt-ras'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c3-bt-ras'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C3.RAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'bluetooth_compartment3_sas',
                  headerName: addTemperatureUnit(t('assethistory.table.c3-bt-sas'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c3-bt-sas'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C3.SAS',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
                {
                  colId: 'bluetooth_compartment3_box',
                  headerName: addTemperatureUnit(t('assethistory.table.c3-bt-box'), temperatureUnit),
                  headerTooltip: addTemperatureUnit(t('assethistory.table.c3-bt-box'), temperatureUnit),
                  field: 'formattedFields.bluetoothSensorTemperature.C3.BOX',
                  columnGroupShow: 'open',
                  type: 'numericColumn',
                  cellStyle: { textAlign: 'right' },
                  valueFormatter: tempFormatter,
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
              ] as UseGetAssetHistoryColumns)
            : []),
        ],
      },
      {
        colId: 'runHours',
        headerName: t('assets.asset.table.runHours'),
        headerTooltip: t('assets.asset.table.runHours'),
        field: 'flespiData.freezer_electric_total',
        cellStyle: { textAlign: 'right' },
        columnGroupShow: 'open',
        type: 'numericColumn',
        valueFormatter: (params) => RunHoursFormatterAdapter(params),
        minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      },
      {
        groupId: 'tru-metrics',
        headerName: t('assethistory.table.tru-metrics'),
        headerTooltip: t('assethistory.table.tru-metrics'),
        marryChildren: false,
        children: [
          {
            colId: 'softwareVersion',
            headerName: t('assets.asset.table.software-version'),
            headerTooltip: t('assets.asset.table.software-version'),
            field: 'flespiData.freezer_software_version',
            valueFormatter: (params) => SoftwareVersionFormatterAdapter(params),
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_comp1_mode',
            headerName: t('assethistory.table.c1-mode'),
            headerTooltip: t('assethistory.table.c1-mode'),
            field: 'flespiData.freezer_comp1_mode',
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: `OperatingModeRenderer`,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_comp2_mode',
            headerName: t('assethistory.table.c2-mode'),
            headerTooltip: t('assethistory.table.c2-mode'),
            field: 'flespiData.freezer_comp2_mode',
            columnGroupShow: 'open',
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: `OperatingModeRenderer`,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'freezer_comp3_mode',
            headerName: t('assethistory.table.c3-mode'),
            headerTooltip: t('assethistory.table.c3-mode'),
            field: 'flespiData.freezer_comp3_mode',
            columnGroupShow: 'open',
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: `OperatingModeRenderer`,
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'truFuelLevel',
            headerName: t('assets.asset.table.tru-fuel-level'),
            headerTooltip: t('assets.asset.table.tru-fuel-level'),
            field: 'formattedFields.truFuelLevel',
            cellStyle: { textAlign: 'right' },
            columnGroupShow: 'open',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
        ],
      },
      {
        groupId: 'battery',
        headerName: t('common.battery'),
        marryChildren: false,
        children: [
          {
            colId: 'freezer_battery_voltage',
            headerName: t('assets.asset.table.battery-voltage'),
            headerTooltip: t('assets.asset.table.battery-voltage'),
            field: 'flespiData.freezer_battery_voltage',
            cellStyle: { textAlign: 'right' },
            type: 'numericColumn',
            valueFormatter: (params) => BatteryVoltageFormatterAdapter(params)?.toString() || '',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'batteryCurrent',
            headerName: t('assets.asset.table.battery-current'),
            headerTooltip: t('assets.asset.table.battery-current'),
            field: 'flespiData.battery_current',
            columnGroupShow: 'open',
            cellStyle: { textAlign: 'right' },
            type: 'numericColumn',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
        ],
      },
      {
        groupId: 'location',
        headerName: t('common.location'),
        marryChildren: false,
        children: [
          ...(isAddressEnabled
            ? ([
                {
                  colId: 'address',
                  headerName: t('assets.asset.table.address'),
                  headerTooltip: t('assets.asset.table.address'),
                  field: 'computedFields.address',
                  columnGroupShow: 'open',
                  cellStyle: { textAlign: 'right' },
                  minWidth: DEFAULT_COLUMN_MIN_WIDTH,
                },
              ] as UseGetAssetHistoryColumns)
            : []),
          {
            colId: 'latitude',
            headerName: t('assets.asset.table.latitude'),
            headerTooltip: t('assets.asset.table.latitude'),
            field: 'flespiData.position_latitude',
            columnGroupShow: 'open',
            cellStyle: { textAlign: 'right' },
            type: 'numericColumn',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
          {
            colId: 'longitude',
            headerName: t('assets.asset.table.longitude'),
            headerTooltip: t('assets.asset.table.longitude'),
            field: 'flespiData.position_longitude',
            columnGroupShow: 'open',
            cellStyle: { textAlign: 'right' },
            type: 'numericColumn',
            minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          },
        ],
      },
      {
        // @ts-ignore
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
      },
    ];

    return columns;
  }, [
    t,
    temperatureUnit,
    tempFormatter,
    includeDataCold,
    dateFormat,
    timezone,
    isAddressEnabled,
    isFeatureBluetoothSensorsManagementEnabled,
  ]);
};
