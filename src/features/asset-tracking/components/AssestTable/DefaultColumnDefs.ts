import { TFunction } from 'i18next';
import { CellClassParams, ValueFormatterParams } from '@ag-grid-community/core';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';
import { TemperatureType } from '@carrier-io/lynx-fleet-types';

import { truFuelLevelFormatter as truFuelLevelGetter } from './column-formatters';

import { ColumnsEx } from '@/types';
import {
  humiditySetpointFormatter,
  doorStatusFormatter,
  sideRearDoorStatusFormatter,
  dateTimeFormatter,
  truBatteryVoltageFormatter,
  truSoftwareVersionFormatter,
  runHoursFormatter,
  temperatureFormatter,
  percentFormatter,
} from '@/components';
import { addTemperatureUnit, freezerAlarmComparator } from '@/utils';
import { SnapshotDataEx } from '@/features/common';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';

const getBackgroundColor = (row: CellClassParams['data'], dataField: string) =>
  row?.alerts?.filter((alert) => alert.triggers.includes(dataField)).length > 0 ? '#F8DCD5' : '';

const truFuelLevelComparator = (valueA: string, valueB: string, t: TFunction) => {
  const valueMappings = {
    '': -3,
    [t('common.n-a')]: -2,
    '-': -1,
  };
  const mappedValueA = valueMappings[valueA] || parseFloat(valueA) || 0;
  const mappedValueB = valueMappings[valueB] || parseFloat(valueB) || 0;

  if (mappedValueA === mappedValueB) {
    return 0;
  }

  return mappedValueA > mappedValueB ? 1 : -1;
};

export type AssetTrackingColIdType =
  | 'alarms'
  | 'activeAlarmDetails'
  | 'assetHealth'
  | 'assetName'
  | 'assetStatus'
  | 'batteryCurrent'
  | 'batteryVoltage'
  | 'c1BoxDatacold'
  | 'c1BoxSensor'
  | 'c1BoxBTSensor'
  | 'c1Humidity'
  | 'c1HumiditySetpoint'
  | 'c1RasDatacold'
  | 'c1RasSensor'
  | 'c1RasBTSensor'
  | 'c1Return'
  | 'c1SasDatacold'
  | 'c1SasSensor'
  | 'c1SasBTSensor'
  | 'c1Setpoint'
  | 'c1Supply'
  | 'c2BoxDatacold'
  | 'c2BoxSensor'
  | 'c2BoxBTSensor'
  | 'c2RasDatacold'
  | 'c2RasSensor'
  | 'c2RasBTSensor'
  | 'c2Return'
  | 'c2SasDatacold'
  | 'c2SasSensor'
  | 'c2SasBTSensor'
  | 'c2Setpoint'
  | 'c2Supply'
  | 'c3BoxDatacold'
  | 'c3BoxSensor'
  | 'c3BoxBTSensor'
  | 'c3RasDatacold'
  | 'c3RasSensor'
  | 'c3RasBTSensor'
  | 'c3Return'
  | 'c3SasDatacold'
  | 'c3SasSensor'
  | 'c3SasBTSensor'
  | 'c3Setpoint'
  | 'c3Supply'
  | 'controlMode'
  | 'datacoldDoorRear1'
  | 'datacoldDoorRear2'
  | 'datacoldDoorRear3'
  | 'datacoldDoorRear4'
  | 'datacoldDoorSide1'
  | 'datacoldDoorSide2'
  | 'datacoldDoorSide3'
  | 'datacoldDoorSide4'
  | 'datacoldFuelLevel1'
  | 'datacoldFuelLevel2'
  | 'datacoldFuelLevel3'
  | 'deviceBatteryLevel'
  | 'deviceFirmwareVersion'
  | 'deviceName'
  | 'engineRunHours'
  | 'freezerAirTemperature'
  | 'freezerComp1Mode'
  | 'freezerComp2Mode'
  | 'freezerComp3Mode'
  | 'freezerDoor'
  | 'lastUpdated'
  | 'address'
  | 'latitude'
  | 'longitude'
  | 'powerMode'
  | 'rearDoor'
  | 'runHours'
  | 'sideDoor'
  | 'standbyRunHours'
  | 'syntheticTruStatus'
  | 'truControlSystemType'
  | 'truFuelLevel'
  | 'truSerialNumber'
  | 'truSoftwareVersion';

export type AssetTrackingGroupIdType =
  | 'battery'
  | 'compartment1'
  | 'compartment2'
  | 'compartment3'
  | 'details'
  | 'doors'
  | 'location'
  | 'operating_mode'
  | 'utilization';

export type AssetTrackingColumns = ColumnsEx<
  SnapshotDataEx,
  AssetTrackingColIdType,
  AssetTrackingGroupIdType
>;

/**
 * Get column definitions for AG Grid.
 * @param {TemperatureType} temperatureUnit temperature unit.
 * @param {DateFormatType} dateFormat date format
 * @param {TFunction} t locale string generator
 * @param {string} timezone locale string generator
 * @returns column definitions.
 */
export function getColumns(
  temperatureUnit: TemperatureType,
  dateFormat: DateFormatType,
  t: TFunction,
  timezone: string,
  isFeatureAssetHealthEnabled: boolean,
  isFeatureAssetAddressColumnEnabled: boolean,
  isFeatureBluetoothSensorsManagementEnabled: boolean
): AssetTrackingColumns {
  const tempFormatter = (params: ValueFormatterParams) =>
    temperatureFormatter(params, { units: temperatureUnit });
  const humiditySetpointFormatterHandler = (params: ValueFormatterParams) =>
    humiditySetpointFormatter(params, t);

  return [
    {
      colId: 'assetName',
      field: 'asset.name',
      headerName: t('assets.asset.table.asset-name'),
      pinned: 'left',
      lockPosition: true,
      lockVisible: true,
      cellStyle: (params) => {
        const hasCriticalAlarm = params.data?.activeFreezerAlarms?.find(
          (alarm) => alarm?.healthStatus === 'CRITICAL'
        );

        const hasAlerts = params.data?.alerts && params.data?.alerts?.length > 0;

        const hasBorder = isFeatureAssetHealthEnabled ? hasCriticalAlarm : hasAlerts;

        return {
          borderLeftColor: hasBorder ? '#FF0000' : '#FFFFFF00',
          borderLeftWidth: '3px',
        };
      },
      cellRenderer: 'AssetIdRenderer',
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      groupId: 'details',
      headerName: t('common.details'),
      marryChildren: true,
      children: [
        {
          colId: 'deviceName',
          field: 'device.serialNumber',
          headerName: t('assets.asset.table.device-name'),
          headerTooltip: t('assets.asset.table.device-name'),
          hide: true,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'truSerialNumber',
          field: 'flespiData.freezer_serial_number',
          headerName: t('assets.asset.table.tru-serial-number'),
          headerTooltip: t('assets.asset.table.tru-serial-number'),
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'assetStatus',
          field: 'flespiData.position_speed',
          headerName: t('assets.asset.table.asset-status'),
          headerTooltip: t('assets.asset.table.asset-status'),
          cellRenderer: `AssetStatusRenderer`,
          cellStyle: { display: 'flex', alignItems: 'center' },
          width: 150,
        },
        {
          colId: 'syntheticTruStatus',
          field: 'flespiData.synthetic_tru_status',
          headerName: t('assets.asset.table.tru-status'),
          minWidth: 250,
          cellStyle: (params) => ({
            backgroundColor: getBackgroundColor(params.data, 'truStatus'),
            overflow: 'hidden',
          }),
          cellRenderer: 'SyntheticTruStatusRenderer',
        },
        ...(isFeatureAssetHealthEnabled
          ? ([
              {
                colId: 'assetHealth',
                field: 'freezerActiveAlarms',
                headerName: t('assets.widgets.alarm.widget.asset-health'),
                cellRenderer: 'AssetHealthRenderer',
                cellStyle: { display: 'flex', alignItems: 'center' },
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
            ] as AssetTrackingColumns)
          : []),
        {
          colId: 'alarms',
          field: 'freezerActiveAlarms',
          headerName: t('common.alarms'),
          cellRenderer: 'FreezerAlarmRenderer',
          filter: 'AlarmFilter',
          comparator: (_valueA, _valueB, nodeA, nodeB) => freezerAlarmComparator(nodeA, nodeB),
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'powerMode',
          field: 'computedFields.enginePowerMode',
          headerName: t('assets.asset.table.power-mode'),
          headerTooltip: t('assets.asset.table.power-mode'),
          width: 150,
          cellRenderer: 'CellChipRenderer',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'controlMode',
          field: 'computedFields.engineControlMode',
          headerName: t('assets.asset.table.control-mode'),
          headerTooltip: t('assets.asset.table.control-mode'),
          width: 160,
          cellRenderer: 'CellChipRenderer',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'truControlSystemType',
          field: 'flespiData.freezer_control_mode',
          headerName: t('assets.asset.table.tru-control-system-type'),
          headerTooltip: t('assets.asset.table.tru-control-system-type'),
          hide: true,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
      ],
    },

    {
      colId: 'freezerAirTemperature',
      field: 'flespiData.freezer_air_temperature',
      headerName: addTemperatureUnit(t('assets.asset.table.freezer-air-temperature'), temperatureUnit),
      headerTooltip: addTemperatureUnit(t('assets.asset.table.freezer-air-temperature'), temperatureUnit),
      type: 'numericColumn',
      width: 180,
      hide: true,
      cellStyle: (params) => ({
        backgroundColor: getBackgroundColor(params.data, 'freezer_air_temperature'),
      }),
      valueFormatter: tempFormatter,
    },
    {
      groupId: 'doors',
      headerName: t('common.doors'),
      marryChildren: true,
      children: [
        {
          colId: 'rearDoor',
          field: 'computedFields.doorStatus.rearDoor',
          headerName: t('assets.asset.table.rearDoor'),
          cellStyle: (params) => ({
            textAlign: 'center',
            backgroundColor: getBackgroundColor(params.data, 'rearDoor'),
          }),
          valueFormatter: (params) => sideRearDoorStatusFormatter(params, 'rearDoor', t),
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'sideDoor',
          field: 'computedFields.doorStatus.sideDoor',
          headerName: t('assets.asset.table.sideDoor'),
          cellStyle: (params) => ({
            textAlign: 'center',
            backgroundColor: getBackgroundColor(params.data, 'sideDoor'),
          }),
          valueFormatter: (params) => sideRearDoorStatusFormatter(params, 'sideDoor', t),
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
      ],
    },

    {
      groupId: 'compartment1',
      headerName: t('assets.asset.table.c1'),
      marryChildren: true,
      children: [
        {
          colId: 'c1Setpoint',
          field: 'flespiData.freezer_zone1_temperature_setpoint',
          headerName: addTemperatureUnit(t('assets.asset.table.c1-setpoint'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-setpoint'), temperatureUnit),
          type: 'numericColumn',
          width: 160,
          cellStyle: (params) => ({
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone1_temperature_setpoint'),
          }),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'freezerComp1Mode',
          field: 'flespiData.freezer_comp1_mode',
          headerName: t('assets.asset.table.freezer-comp1-mode'),
          headerTooltip: t('assets.asset.table.freezer-comp1-mode'),
          cellRenderer: `OperatingModeRenderer`,
          cellStyle: { display: 'flex', alignItems: 'center' },
          width: 150,
        },
        {
          colId: 'c1Supply',
          columnGroupShow: 'open',
          field: 'flespiData.freezer_zone1_supply_air_temperature',
          headerName: addTemperatureUnit(t('assets.asset.table.c1-supply'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-supply'), temperatureUnit),
          type: 'numericColumn',
          width: 160,
          cellStyle: (params) => ({
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone1_supply_air_temperature'),
          }),
          valueFormatter: tempFormatter,
        },
        {
          colId: 'c1Return',
          columnGroupShow: 'open',
          field: 'flespiData.freezer_zone1_return_air_temperature',
          headerName: addTemperatureUnit(t('assets.asset.table.c1-return'), temperatureUnit),
          width: 150,
          type: 'numericColumn',
          cellStyle: (params) => ({
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone1_return_air_temperature'),
          }),
          valueFormatter: tempFormatter,
        },
        {
          colId: 'c1BoxSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.BOX1',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c1-box-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-box-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c1RasSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.RAS1',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c1-ras-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-ras-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c1SasSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.SAS1',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c1-sas-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-sas-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        ...(isFeatureBluetoothSensorsManagementEnabled
          ? ([
              {
                colId: 'c1BoxBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.BOX1_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c1-box-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-box-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
              {
                colId: 'c1RasBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.RAS1_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c1-ras-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-ras-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
              {
                colId: 'c1SasBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.SAS1_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c1-sas-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-sas-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
            ] as AssetTrackingColumns)
          : []),
        {
          colId: 'c1BoxDatacold',
          columnGroupShow: 'open',
          field: 'device.sensors.BOX1_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c1-box-datacold'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-box-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c1RasDatacold',
          columnGroupShow: 'open',
          field: 'device.sensors.RAS1_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c1-ras-datacold'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-ras-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c1SasDatacold',
          columnGroupShow: 'open',
          field: 'device.sensors.SAS1_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c1-sas-datacold'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c1-sas-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c1HumiditySetpoint',
          columnGroupShow: 'open',
          field: 'flespiData.freezer_trs_comp1_humidity_setpoint',
          cellStyle: { textAlign: 'right' },
          headerName: t('assets.asset.table.c1-humidity-setpoint'),
          headerTooltip: t('assets.asset.table.c1-humidity-setpoint'),
          valueFormatter: humiditySetpointFormatterHandler,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c1Humidity',
          columnGroupShow: 'open',
          field: 'flespiData.freezer_trs_comp1_humidity',
          cellStyle: { textAlign: 'right' },
          headerName: t('assets.asset.table.c1-humidity'),
          headerTooltip: t('assets.asset.table.c1-humidity'),
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
      ],
    },
    {
      groupId: 'compartment2',
      headerName: t('assets.asset.table.c2'),
      marryChildren: true,
      children: [
        {
          colId: 'c2Setpoint',
          field: 'flespiData.freezer_zone2_temperature_setpoint',
          headerName: addTemperatureUnit(t('assets.asset.table.c2-setpoint'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-setpoint'), temperatureUnit),
          width: 160,
          type: 'numericColumn',
          cellStyle: (params) => ({
            textAlign: 'right',
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone2_temperature_setpoint'),
          }),
          valueFormatter: tempFormatter,
        },
        {
          colId: 'freezerComp2Mode',
          field: 'flespiData.freezer_comp2_mode',
          headerName: t('assets.asset.table.freezer-comp2-mode'),
          headerTooltip: t('assets.asset.table.freezer-comp2-mode'),
          cellRenderer: `OperatingModeRenderer`,
          cellStyle: { display: 'flex', alignItems: 'center' },
          width: 150,
        },
        {
          colId: 'c2Supply',
          columnGroupShow: 'open',
          field: 'flespiData.freezer_zone2_supply_air_temperature',
          headerName: addTemperatureUnit(t('assets.asset.table.c2-supply'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-supply'), temperatureUnit),
          width: 150,
          type: 'numericColumn',
          cellStyle: (params) => ({
            textAlign: 'right',
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone2_supply_air_temperature'),
          }),
          valueFormatter: tempFormatter,
        },
        {
          colId: 'c2Return',
          columnGroupShow: 'open',
          field: 'flespiData.freezer_zone2_return_air_temperature',
          headerName: addTemperatureUnit(t('assets.asset.table.c2-return'), temperatureUnit),
          width: 150,
          type: 'numericColumn',
          cellStyle: (params) => ({
            textAlign: 'right',
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone2_return_air_temperature'),
          }),
          valueFormatter: tempFormatter,
        },
        {
          colId: 'c2BoxSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.BOX2',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c2-box-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-box-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c2RasSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.RAS2',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c2-ras-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-ras-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c2SasSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.SAS2',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c2-sas-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-sas-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        ...(isFeatureBluetoothSensorsManagementEnabled
          ? ([
              {
                colId: 'c2BoxBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.BOX2_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c2-box-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-box-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
              {
                colId: 'c2RasBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.RAS2_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c2-ras-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-ras-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
              {
                colId: 'c2SasBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.SAS2_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c2-sas-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-sas-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
            ] as AssetTrackingColumns)
          : []),
        {
          colId: 'c2BoxDatacold',
          columnGroupShow: 'open',
          field: 'device.sensors.BOX2_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c2-box-datacold'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-box-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c2RasDatacold',
          columnGroupShow: 'open',
          // todo: this field returns object { SIDE: null }. Need to check `indexSensors` function
          field: 'device.sensors.RAS2_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c2-ras-datacold'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c2-ras-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c2SasDatacold',
          columnGroupShow: 'open',
          field: 'device.sensors.SAS2_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c2-sas-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
      ],
    },
    {
      groupId: 'compartment3',
      headerName: t('assets.asset.table.c3'),
      marryChildren: true,
      children: [
        {
          colId: 'c3Setpoint',
          field: 'flespiData.freezer_zone3_temperature_setpoint',
          headerName: addTemperatureUnit(t('assets.asset.table.c3-setpoint'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-setpoint'), temperatureUnit),
          width: 160,
          type: 'numericColumn',
          cellStyle: (params) => ({
            textAlign: 'right',
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone3_temperature_setpoint'),
          }),
          valueFormatter: tempFormatter,
        },
        {
          colId: 'freezerComp3Mode',
          field: 'flespiData.freezer_comp3_mode',
          headerName: t('assets.asset.table.freezer-comp3-mode'),
          headerTooltip: t('assets.asset.table.freezer-comp3-mode'),
          cellRenderer: `OperatingModeRenderer`,
          cellStyle: { display: 'flex', alignItems: 'center' },
          width: 150,
        },
        {
          colId: 'c3Supply',
          columnGroupShow: 'open',
          field: 'flespiData.freezer_zone3_supply_air_temperature',
          headerName: addTemperatureUnit(t('assets.asset.table.c3-supply'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-supply'), temperatureUnit),
          type: 'numericColumn',
          cellStyle: (params) => ({
            textAlign: 'right',
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone3_supply_air_temperature'),
          }),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c3Return',
          columnGroupShow: 'open',
          field: 'flespiData.freezer_zone3_return_air_temperature',
          headerName: addTemperatureUnit(t('assets.asset.table.c3-return'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-return'), temperatureUnit),
          type: 'numericColumn',
          cellStyle: (params) => ({
            textAlign: 'right',
            backgroundColor: getBackgroundColor(params.data, 'freezer_zone3_return_air_temperature'),
          }),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c3BoxSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.BOX3',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c3-box-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-box-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c3RasSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.RAS3',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c3-ras-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-ras-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c3SasSensor',
          columnGroupShow: 'open',
          field: 'device.sensors.SAS3',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c3-sas-sensor'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-sas-sensor'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        ...(isFeatureBluetoothSensorsManagementEnabled
          ? ([
              {
                colId: 'c3BoxBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.BOX3_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c3-box-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-box-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
              {
                colId: 'c3RasBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.RAS3_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c3-ras-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-ras-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
              {
                colId: 'c3SasBTSensor',
                columnGroupShow: 'open',
                field: 'device.sensors.SAS3_BT',
                type: 'numericColumn',
                cellStyle: { textAlign: 'right' },
                headerName: addTemperatureUnit(t('assets.asset.table.c3-sas-bt-sensor'), temperatureUnit),
                headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-sas-bt-sensor'), temperatureUnit),
                valueFormatter: tempFormatter,
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
            ] as AssetTrackingColumns)
          : []),
        {
          colId: 'c3BoxDatacold',
          columnGroupShow: 'open',
          field: 'device.sensors.BOX3_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c3-box-datacold'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-box-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c3RasDatacold',
          columnGroupShow: 'open',
          field: 'device.sensors.RAS3_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c3-ras-datacold'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-ras-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'c3SasDatacold',
          columnGroupShow: 'open',
          field: 'device.sensors.SAS3_DATACOLD',
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          headerName: addTemperatureUnit(t('assets.asset.table.c3-sas-datacold'), temperatureUnit),
          headerTooltip: addTemperatureUnit(t('assets.asset.table.c3-sas-datacold'), temperatureUnit),
          valueFormatter: tempFormatter,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
      ],
    },

    {
      colId: 'truFuelLevel',
      field: 'device.sensors.AIN4',
      headerName: t('assets.asset.table.tru-fuel-level'),
      headerTooltip: t('assets.asset.table.tru-fuel-level'),
      width: 150,
      cellStyle: (params) => ({
        textAlign: 'center',
        backgroundColor: getBackgroundColor(params.data, 'plugin_fuel_level'),
      }),
      valueGetter: (params) => truFuelLevelGetter(params, t),
      comparator: (valueA, valueB) => truFuelLevelComparator(valueA, valueB, t),
    },
    {
      colId: 'batteryVoltage',
      field: 'flespiData.freezer_battery_voltage',
      headerName: t('assets.asset.table.battery-voltage'),
      headerTooltip: t('assets.asset.table.battery-voltage'),
      type: 'numericColumn',
      cellStyle: (params) => ({
        backgroundColor: getBackgroundColor(params.data, 'freezer_battery_voltage'),
      }),
      valueFormatter: (params) => truBatteryVoltageFormatter(params)?.toString() || '',
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'truSoftwareVersion',
      field: 'flespiData.freezer_software_version',
      headerName: t('assets.asset.table.tru-software-version'),
      headerTooltip: t('assets.asset.table.tru-software-version'),
      valueFormatter: truSoftwareVersionFormatter,
      hide: true,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },

    {
      colId: 'datacoldDoorRear1',
      field: 'device.sensors.DIN1_DATACOLD.REAR',
      headerName: t('assets.asset.table.datacold-door-rear-1'),
      headerTooltip: t('assets.asset.table.datacold-door-rear-1'),
      valueFormatter: (params) => doorStatusFormatter(params, t),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldDoorSide1',
      field: 'device.sensors.DIN1_DATACOLD.SIDE',
      headerName: t('assets.asset.table.datacold-door-side-1'),
      headerTooltip: t('assets.asset.table.datacold-door-side-1'),
      valueFormatter: (params) => doorStatusFormatter(params, t),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldDoorRear2',
      field: 'device.sensors.DIN2_DATACOLD.REAR',
      headerName: t('assets.asset.table.datacold-door-rear-2'),
      headerTooltip: t('assets.asset.table.datacold-door-rear-2'),
      valueFormatter: (params) => doorStatusFormatter(params, t),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldDoorSide2',
      field: 'device.sensors.DIN2_DATACOLD.SIDE',
      headerName: t('assets.asset.table.datacold-door-side-2'),
      headerTooltip: t('assets.asset.table.datacold-door-side-2'),
      valueFormatter: (params) => doorStatusFormatter(params, t),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldDoorRear3',
      field: 'device.sensors.DIN3_DATACOLD.REAR',
      headerName: t('assets.asset.table.datacold-door-rear-3'),
      headerTooltip: t('assets.asset.table.datacold-door-rear-3'),
      valueFormatter: (params) => doorStatusFormatter(params, t),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldDoorSide3',
      field: 'device.sensors.DIN3_DATACOLD.SIDE',
      headerName: t('assets.asset.table.datacold-door-side-3'),
      headerTooltip: t('assets.asset.table.datacold-door-side-3'),
      valueFormatter: (params) => doorStatusFormatter(params, t),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldDoorRear4',
      field: 'device.sensors.DIN4_DATACOLD.REAR',
      headerName: t('assets.asset.table.datacold-door-rear-4'),
      headerTooltip: t('assets.asset.table.datacold-door-rear-4'),
      valueFormatter: (params) => doorStatusFormatter(params, t),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldDoorSide4',
      field: 'device.sensors.DIN4_DATACOLD.SIDE',
      headerName: t('assets.asset.table.datacold-door-side-4'),
      headerTooltip: t('assets.asset.table.datacold-door-side-4'),
      valueFormatter: (params) => doorStatusFormatter(params, t),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldFuelLevel1',
      field: 'device.sensors.AIN1_DATACOLD',
      headerName: t('assets.asset.table.datacold-fuel-level-1'),
      headerTooltip: t('assets.asset.table.datacold-fuel-level-1'),
      cellStyle: (params) => ({
        backgroundColor: getBackgroundColor(params.data, 'freezer_datacold_ain_1'),
      }),
      valueFormatter: percentFormatter,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldFuelLevel2',
      field: 'device.sensors.AIN2_DATACOLD',
      headerName: t('assets.asset.table.datacold-fuel-level-2'),
      headerTooltip: t('assets.asset.table.datacold-fuel-level-2'),
      cellStyle: (params) => ({
        backgroundColor: getBackgroundColor(params.data, 'freezer_datacold_ain_2'),
      }),
      valueFormatter: percentFormatter,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'datacoldFuelLevel3',
      field: 'device.sensors.AIN3_DATACOLD',
      headerName: t('assets.asset.table.datacold-fuel-level-3'),
      headerTooltip: t('assets.asset.table.datacold-fuel-level-3'),
      cellStyle: (params) => ({
        backgroundColor: getBackgroundColor(params.data, 'freezer_datacold_ain_3'),
      }),
      valueFormatter: percentFormatter,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // NOTE: temporarily commented out. Do not delete this.
    // {
    // colId: ColumnIds.DEVICE_BATTERY_LEVEL,
    //   field: 'flespiData.freezer_electric_total',
    //   headerName: t('assets.asset.table.device-battery-level'),
    //   cellRenderer: 'BatteryStatusRenderer',
    // },

    {
      groupId: 'utilization',
      headerName: t('assets.asset.table.utilization'),
      marryChildren: true,
      children: [
        {
          colId: 'runHours',
          headerName: t('assets.asset.table.runHours'),
          headerTooltip: t('assets.asset.table.runHours'),
          field: 'flespiData.freezer_electric_total',
          cellStyle: { textAlign: 'right' },
          type: 'numericColumn',
          valueFormatter: (params) => runHoursFormatter(params),
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'engineRunHours',
          headerName: t('assets.asset.table.engine-run-hours'),
          headerTooltip: t('assets.asset.table.engine-run-hours'),
          field: 'flespiData.freezer_engine_total',
          cellStyle: { textAlign: 'right' },
          type: 'numericColumn',
        },
        {
          colId: 'standbyRunHours',
          headerName: t('assets.asset.table.standby-run-hours'),
          headerTooltip: t('assets.asset.table.standby-run-hours'),
          field: 'flespiData.freezer_standby_total',
          cellStyle: { textAlign: 'right' },
          type: 'numericColumn',
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
      ],
    },
    {
      colId: 'batteryCurrent',
      field: 'flespiData.battery_current',
      columnGroupShow: 'open',
      type: 'numericColumn',
      headerName: t('assets.asset.table.battery-current-device'),
      headerTooltip: t('assets.asset.table.battery-current-device'),
      cellStyle: { textAlign: 'right' },
      hide: true,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },

    {
      groupId: 'location',
      headerName: t('common.location'),
      marryChildren: true,
      children: [
        ...(isFeatureAssetAddressColumnEnabled
          ? ([
              {
                colId: 'address',
                field: 'computedFields.address',
                headerName: t('assets.asset.table.address'),
                minWidth: DEFAULT_COLUMN_MIN_WIDTH,
              },
            ] as AssetTrackingColumns)
          : []),
        {
          colId: 'latitude',
          field: 'flespiData.position_latitude',
          headerName: t('assets.asset.table.latitude'),
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
        {
          colId: 'longitude',
          field: 'flespiData.position_longitude',
          headerName: t('assets.asset.table.longitude'),
          type: 'numericColumn',
          cellStyle: { textAlign: 'right' },
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
        },
      ],
    },
    {
      colId: 'lastUpdated',
      field: 'flespiData.timestamp',
      headerName: t('assets.asset.table.last-updated'),
      headerTooltip: t('assets.asset.table.last-updated'),
      type: 'numericColumn',
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) =>
        dateTimeFormatter(params.value, {
          dateFormat,
          timestampFormat: 'seconds',
          timezone,
        }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
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
}
