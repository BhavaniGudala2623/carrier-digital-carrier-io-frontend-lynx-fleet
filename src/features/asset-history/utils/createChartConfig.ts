import i18n from 'i18next';
import {
  amber,
  blue,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  orange,
  pink,
  purple,
  red,
  teal,
  brown,
  blueGrey,
} from '@mui/material/colors';
import { FlespiData, Maybe, Sensor } from '@carrier-io/lynx-fleet-types';

import { CompartmentsStatuses } from '../types';

import { getCompartmentDataKey } from './getCompartmentDataKey';
import { getDoorSensorDataKey } from './getDoorSensorDataKey';
import { unpureMarkEmptyGroupsAsUnavailable } from './unpureMarkEmptyGroupsAsUnavailable';
import { isAT52Device as isAT52Type } from './isAT52Device';

import { getSensorType } from '@/utils';
import { ChartConfig } from '@/types';

const theme = {
  palette: {
    chart: {
      c1: {
        airtemp: blue.A700,
        setpoint: grey[400],
        return: red[700],
        supply: green[700],
        sas: lightGreen[400],
        ras: deepOrange[300],
        box: green.A700,
        sas_bt: lightGreen[400],
        ras_bt: deepOrange[300],
        box_bt: green.A700,
        sasDatacold: lightGreen[400],
        rasDatacold: deepOrange[300],
        boxDatacold: green.A100,
      },
      c2: {
        setpoint: grey[600],
        return: orange[500],
        supply: blue[500],
        sas: lightBlue[300],
        ras: amber[400],
        box: cyan.A700,
        sas_bt: lightBlue[300],
        ras_bt: amber[400],
        box_bt: cyan.A700,
        sasDatacold: blue[700],
        rasDatacold: deepOrange[500],
        boxDatacold: cyan.A100,
      },
      c3: {
        setpoint: grey[800],
        return: pink[500],
        supply: deepPurple[500],
        sas: purple.A700,
        ras: purple.A400,
        box: indigo.A700,
        sas_bt: purple.A700,
        ras_bt: purple.A400,
        box_bt: indigo.A700,
        sasDatacold: deepPurple[800],
        rasDatacold: pink[800],
        boxDatacold: indigo.A700,
      },
    },
  },
};

export const createChartConfig = (
  sensorConfig: Maybe<Maybe<Sensor>[]> | undefined,
  availableColumns: string[],
  flespiData: Maybe<FlespiData> | undefined,
  compartmentsObj: CompartmentsStatuses,
  isFeatureCompartmentOnOffModeEnabled: boolean,
  isFeatureGeofenceTmpEventEnabled: boolean
): ChartConfig => {
  const { freezer_control_mode } = flespiData ?? {};
  const isAT52Device = isAT52Type(flespiData?.freezer_control_mode);
  const chartConfig: ChartConfig = {
    freezer_air_temperature: {
      label: i18n.t('asset.ambientAir') as string,
      i18nKey: 'asset.ambientAir',
      color: theme.palette.chart.c1.airtemp,
      lineType: 'solid',
      rootNode: true,
      available: availableColumns?.includes('freezer_air_temperature'),
      children: {},
      lookerField: 'average_ambient_air',
    },
    c1: {
      label: i18n.t('asset.compartment1') as string,
      i18nKey: 'asset.compartment1',
      available: true,
      lookerField: 'Compartment 1',
      children: {
        freezer_zone1_temperature_setpoint: {
          label: i18n.t('assethistory.graph.c1-setpoint') as string,
          i18nKey: 'assethistory.graph.c1-setpoint',
          color: theme.palette.chart.c1.setpoint,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone1_temperature_setpoint'),
          lookerField: 'average_zone1_temperature_setpoint',
        },
        freezer_zone1_return_air_temperature: {
          label: i18n.t('assethistory.graph.c1-return') as string,
          i18nKey: 'assethistory.graph.c1-return',
          color: theme.palette.chart.c1.return,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone1_return_air_temperature'),
          lookerField: 'average_zone1_return_air_temperature',
        },
        freezer_zone1_supply_air_temperature: {
          label: i18n.t('assethistory.graph.c1-supply') as string,
          i18nKey: 'assethistory.graph.c1-supply',
          color: theme.palette.chart.c1.supply,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone1_supply_air_temperature'),
          lookerField: 'average_zone1_supply_air_temperature',
        },
      },
    },
    c2: {
      label: i18n.t('asset.compartment2') as string,
      i18nKey: 'asset.compartment2',
      available: true,
      lookerField: 'Compartment 2',
      children: {
        freezer_zone2_temperature_setpoint: {
          label: i18n.t('assethistory.graph.c2-setpoint') as string,
          i18nKey: 'assethistory.graph.c2-setpoint',
          color: theme.palette.chart.c2.setpoint,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone2_temperature_setpoint'),
          lookerField: 'average_zone2_temperature_setpoint',
        },
        freezer_zone2_return_air_temperature: {
          label: i18n.t('assethistory.graph.c2-return') as string,
          i18nKey: 'assethistory.graph.c2-return',
          color: theme.palette.chart.c2.return,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone2_return_air_temperature'),
          lookerField: 'average_zone2_return_air_temperature',
        },
        freezer_zone2_supply_air_temperature: {
          label: i18n.t('assethistory.graph.c2-supply') as string,
          i18nKey: 'assethistory.graph.c2-supply',
          color: theme.palette.chart.c2.supply,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone2_supply_air_temperature'),
          lookerField: 'average_zone2_supply_air_temperature',
        },
      },
    },
    c3: {
      label: i18n.t('asset.compartment3') as string,
      i18nKey: 'asset.compartment3',
      available: true,
      lookerField: 'Compartment 3',
      children: {
        freezer_zone3_temperature_setpoint: {
          label: i18n.t('assethistory.graph.c3-setpoint') as string,
          i18nKey: 'assethistory.graph.c3-setpoint',
          color: theme.palette.chart.c3.setpoint,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone3_temperature_setpoint'),
          lookerField: 'average_zone3_temperature_setpoint',
        },
        freezer_zone3_return_air_temperature: {
          label: i18n.t('assethistory.graph.c3-return') as string,
          i18nKey: 'assethistory.graph.c3-return',
          color: theme.palette.chart.c3.return,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone3_return_air_temperature'),
          lookerField: 'average_zone3_return_air_temperature',
        },
        freezer_zone3_supply_air_temperature: {
          label: i18n.t('assethistory.graph.c3-supply') as string,
          i18nKey: 'assethistory.graph.c3-supply',
          color: theme.palette.chart.c3.supply,
          lineType: 'solid',
          available: availableColumns?.includes('freezer_zone3_supply_air_temperature'),
          lookerField: 'average_zone3_supply_air_temperature',
        },
      },
    },
    events: {
      available: true,
      label: i18n.t('assethistory.graph.events') as string,
      i18nKey: 'assethistory.graph.events',
      lookerField: 'Events',
      children: {
        truStatus: {
          label: i18n.t('assethistory.events.tru') as string,
          i18nKey: 'assethistory.events.tru',
          color: indigo[500],
          available: true,
          dataKey: 'synthetic_tru_status',
          lookerField: 'tru_event',
        },
        c1On: {
          label: i18n.t('assets.asset.table.c1-on') as string,
          i18nKey: 'assets.asset.table.c1-on',
          color: green[200],
          available: !isFeatureCompartmentOnOffModeEnabled
            ? false
            : compartmentsObj[getCompartmentDataKey('1', freezer_control_mode)],
          dataKey: getCompartmentDataKey('1', freezer_control_mode),
          lookerField: 'comp1_power_status',
        },
        c2On: {
          label: i18n.t('assets.asset.table.c2-on') as string,
          i18nKey: 'assets.asset.table.c2-on',
          color: green[500],
          available: !isFeatureCompartmentOnOffModeEnabled
            ? false
            : compartmentsObj[getCompartmentDataKey('2', freezer_control_mode)],
          dataKey: getCompartmentDataKey('2', freezer_control_mode),
          lookerField: 'comp2_power_status',
        },
        c3On: {
          label: i18n.t('assets.asset.table.c3-on') as string,
          i18nKey: 'assets.asset.table.c3-on',
          color: green[900],
          available: !isFeatureCompartmentOnOffModeEnabled
            ? false
            : compartmentsObj[getCompartmentDataKey('3', freezer_control_mode)],
          dataKey: getCompartmentDataKey('3', freezer_control_mode),
          lookerField: 'comp3_power_status',
        },
        defrost: {
          label: i18n.t('assethistory.events.defrost') as string,
          i18nKey: 'assethistory.events.defrost',
          color: cyan[300],
          available: true,
          dataKey: 'freezer_comp1_mode',
          lookerField: 'defrost_event',
        },
        inMotion: {
          label: i18n.t('assethistory.events.moving') as string,
          i18nKey: 'assethistory.events.moving',
          color: deepPurple[300],
          available: true,
          dataKey: 'position_speed',
          lookerField: 'moving_event',
        },
        rearDoor: {
          colId: 'rearDoor',
          label: i18n.t('assethistory.events.rear-door') as string,
          i18nKey: 'assethistory.events.rear-door',
          color: teal[500],
          available:
            (sensorConfig &&
              sensorConfig.find((sensor) => sensor?.configured && sensor.sensorLocation === 'REAR') !==
                undefined) ??
            false,
          dataKey: getDoorSensorDataKey(sensorConfig, 'REAR'),
          lookerField: 'rear_door_event',
        },
        sideDoor: {
          colId: 'sideDoor',
          label: i18n.t('assethistory.events.side-door') as string,
          i18nKey: 'assethistory.events.side-door',
          color: teal[500],
          available:
            (sensorConfig &&
              sensorConfig.find((sensor) => sensor?.configured && sensor.sensorLocation === 'SIDE') !==
                undefined) ??
            false,
          dataKey: getDoorSensorDataKey(sensorConfig, 'SIDE'),
          lookerField: 'side_door_event',
        },
        controlMode: {
          label: i18n.t('assethistory.events.control-mode'),
          i18nKey: 'assethistory.events.control-mode',
          color: brown[600],
          available: true,
          dataKey: 'freezer_engine_control_mode',
          colId: 'controlMode',
          lookerField: 'tru_control_mode',
          statuses: [
            {
              statusName: 'controlModeContinuous',
              color: brown[600],
              dataKey: 'freezer_control_continuous_status',
              lookerField: 'tru_control_mode_continuous',
            },
            {
              statusName: 'controlModeStartStop',
              color: brown[100],
              dataKey: 'freezer_control_startstop_status',
              lookerField: !isAT52Device ? 'tru_control_mode_start_stop' : null,
            },
          ],
        },
        powerMode: {
          available: true,
          label: i18n.t('assethistory.events.power-mode'),
          i18nKey: 'assethistory.events.power-mode',
          dataKey: 'freezer_engine_power_mode',
          color: red[600],
          colId: 'powerMode',
          lookerField: 'tru_power_mode',
          statuses: [
            {
              statusName: 'powerModeEngine',
              color: red[600],
              dataKey: 'freezer_power_engine_status',
              lookerField: !isAT52Device ? 'tru_power_mode_engine' : null,
            },
            {
              statusName: 'powerModeStandby',
              color: red[100],
              dataKey: 'freezer_power_standby_status',
              lookerField: 'tru_power_mode_standby',
            },
          ],
        },
        ...(isFeatureGeofenceTmpEventEnabled && {
          geofence: {
            label: i18n.t('geofences.geofence'),
            i18nKey: 'geofences.geofence',
            color: blueGrey[900],
            // Negative lookahead regex to add space btw comma separated geofences temp table (multi-geofence)
            tooltipValueGetter: (value: string) => value.replace(/,(?!\s)/g, ', '),
            available: true,
            dataKey: 'location_geofence_event',
            lookerField: 'geofence_viz_event',
          },
        }),
      },
    },
  };

  if (sensorConfig) {
    for (const sensor of sensorConfig) {
      if (sensor?.sensorType === 'BT_EN12830' && sensor?.configured) {
        const available = availableColumns?.includes(`bluetooth_${sensor.flespiKey}`);
        const { sensorLocation } = sensor;

        switch (sensorLocation) {
          case 'RAS1':
            chartConfig.c1.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c1-bt-ras',
              i18nKey: 'assethistory.table.c1-bt-ras',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c1.ras_bt,
              lookerField: 'average_zone1_RAS_BT_temperature',
            };
            break;
          case 'SAS1':
            chartConfig.c1.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c1-bt-sas',
              i18nKey: 'assethistory.table.c1-bt-sas',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c1.sas_bt,
              lookerField: 'average_zone1_SAS_BT_temperature',
            };
            break;
          case 'BOX1':
            chartConfig.c1.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c1-bt-box',
              i18nKey: 'assethistory.table.c1-bt-box',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c1.box_bt,
              lookerField: 'average_zone1_BOX_BT_temperature',
            };
            break;

          case 'RAS2':
            chartConfig.c2.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c2-bt-ras',
              i18nKey: 'assethistory.table.c2-bt-ras',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c2.ras_bt,
              lookerField: 'average_zone2_RAS_BT_temperature',
            };
            break;
          case 'SAS2':
            chartConfig.c2.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c2-bt-sas',
              i18nKey: 'assethistory.table.c2-bt-sas',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c2.sas_bt,
              lookerField: 'average_zone2_SAS_BT_temperature',
            };
            break;
          case 'BOX2':
            chartConfig.c2.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c2-bt-box',
              i18nKey: 'assethistory.table.c2-bt-box',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c2.box_bt,
              lookerField: 'average_zone2_BOX_BT_temperature',
            };
            break;

          case 'RAS3':
            chartConfig.c3.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c3-bt-ras',
              i18nKey: 'assethistory.table.c3-bt-ras',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c3.ras_bt,
              lookerField: 'average_zone3_RAS_BT_temperature',
            };
            break;
          case 'SAS3':
            chartConfig.c3.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c3-bt-sas',
              i18nKey: 'assethistory.table.c3-bt-sas',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c3.sas_bt,
              lookerField: 'average_zone3_SAS_BT_temperature',
            };
            break;
          case 'BOX3':
            chartConfig.c3.children[`bluetooth_${sensor.flespiKey}`] = {
              label: 'assethistory.table.c3-bt-box',
              i18nKey: 'assethistory.table.c3-bt-box',
              lineType: 'solid',
              available,
              color: theme.palette.chart.c3.box_bt,
              lookerField: 'average_zone3_BOX_BT_temperature',
            };
            break;
          default:
            break;
        }
        continue;
      }
      if (sensor?.configured) {
        const available = availableColumns?.includes(sensor.flespiKey);
        const sensorType = getSensorType(sensor);

        switch (sensorType) {
          case 'RAS1':
          case 'RAS1_DATACOLD':
            chartConfig.c1.children[sensor.flespiKey] = {
              label:
                sensorType === 'RAS1'
                  ? i18n.t('assets.asset.table.c1-ras-sensor')
                  : i18n.t('assets.asset.table.c1-ras-datacold'),
              i18nKey:
                sensorType === 'RAS1'
                  ? 'assets.asset.table.c1-ras-sensor'
                  : 'assets.asset.table.c1-ras-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'RAS1' ? theme.palette.chart.c1.ras : theme.palette.chart.c1.rasDatacold,
              lookerField:
                sensorType === 'RAS1' ? 'average_zone1_RAS_temperature' : 'average_zone1_RAS_datacold',
            };
            break;
          case 'SAS1':
          case 'SAS1_DATACOLD':
            chartConfig.c1.children[sensor.flespiKey] = {
              label:
                sensorType === 'SAS1'
                  ? i18n.t('assets.asset.table.c1-sas-sensor')
                  : i18n.t('assets.asset.table.c1-sas-datacold'),
              i18nKey:
                sensorType === 'SAS1'
                  ? 'assets.asset.table.c1-sas-sensor'
                  : 'assets.asset.table.c1-sas-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'SAS1' ? theme.palette.chart.c1.sas : theme.palette.chart.c1.sasDatacold,
              lookerField:
                sensorType === 'SAS1' ? 'average_zone1_SAS_temperature' : 'average_zone1_SAS_datacold',
            };
            break;
          case 'BOX1':
          case 'BOX1_DATACOLD':
            chartConfig.c1.children[sensor.flespiKey] = {
              label:
                sensorType === 'BOX1'
                  ? i18n.t('assets.asset.table.c1-box-sensor')
                  : i18n.t('assets.asset.table.c1-box-datacold'),
              i18nKey:
                sensorType === 'BOX1'
                  ? 'assets.asset.table.c1-box-sensor'
                  : 'assets.asset.table.c1-box-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'BOX1' ? theme.palette.chart.c1.box : theme.palette.chart.c1.boxDatacold,
              lookerField:
                sensorType === 'BOX1' ? 'average_zone1_BOX_temperature' : 'average_zone1_BOX_datacold',
            };
            break;
          case 'RAS2':
          case 'RAS2_DATACOLD':
            chartConfig.c2.children[sensor.flespiKey] = {
              label:
                sensorType === 'RAS2'
                  ? i18n.t('assets.asset.table.c2-ras-sensor')
                  : i18n.t('assets.asset.table.c2-ras-datacold'),
              i18nKey:
                sensorType === 'RAS2'
                  ? 'assets.asset.table.c2-ras-sensor'
                  : 'assets.asset.table.c2-ras-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'RAS2' ? theme.palette.chart.c2.ras : theme.palette.chart.c2.rasDatacold,
              lookerField:
                sensorType === 'RAS2' ? 'average_zone2_RAS_temperature' : 'average_zone2_RAS_datacold',
            };
            break;
          case 'SAS2':
          case 'SAS2_DATACOLD':
            chartConfig.c2.children[sensor.flespiKey] = {
              label:
                sensorType === 'SAS2'
                  ? i18n.t('assets.asset.table.c2-sas-sensor')
                  : i18n.t('assets.asset.table.c2-sas-datacold'),
              i18nKey:
                sensorType === 'SAS2'
                  ? 'assets.asset.table.c2-sas-sensor'
                  : 'assets.asset.table.c2-sas-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'SAS2' ? theme.palette.chart.c2.sas : theme.palette.chart.c2.sasDatacold,
              lookerField:
                sensorType === 'SAS2' ? 'average_zone2_SAS_temperature' : 'average_zone2_SAS_datacold',
            };
            break;
          case 'BOX2':
          case 'BOX2_DATACOLD':
            chartConfig.c2.children[sensor.flespiKey] = {
              label:
                sensorType === 'BOX2'
                  ? i18n.t('assets.asset.table.c2-box-sensor')
                  : i18n.t('assets.asset.table.c2-box-datacold'),
              i18nKey:
                sensorType === 'BOX2'
                  ? 'assets.asset.table.c2-box-sensor'
                  : 'assets.asset.table.c2-box-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'BOX2' ? theme.palette.chart.c2.box : theme.palette.chart.c2.boxDatacold,
              lookerField:
                sensorType === 'BOX2' ? 'average_zone2_BOX_temperature' : 'average_zone2_BOX_datacold',
            };
            break;
          case 'RAS3':
          case 'RAS3_DATACOLD':
            chartConfig.c3.children[sensor.flespiKey] = {
              label:
                sensorType === 'RAS3'
                  ? i18n.t('assets.asset.table.c3-ras-sensor')
                  : i18n.t('assets.asset.table.c3-ras-datacold'),
              i18nKey:
                sensorType === 'RAS3'
                  ? 'assets.asset.table.c3-ras-sensor'
                  : 'assets.asset.table.c3-ras-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'RAS3' ? theme.palette.chart.c3.ras : theme.palette.chart.c3.rasDatacold,
              lookerField:
                sensorType === 'RAS3' ? 'average_zone3_RAS_temperature' : 'average_zone3_RAS_datacold',
            };
            break;
          case 'SAS3':
          case 'SAS3_DATACOLD':
            chartConfig.c3.children[sensor.flespiKey] = {
              label:
                sensorType === 'SAS3'
                  ? i18n.t('assets.asset.table.c3-sas-sensor')
                  : i18n.t('assets.asset.table.c3-sas-datacold'),
              i18nKey:
                sensorType === 'SAS3'
                  ? 'assets.asset.table.c3-sas-sensor'
                  : 'assets.asset.table.c3-sas-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'SAS3' ? theme.palette.chart.c3.sas : theme.palette.chart.c3.sasDatacold,
              lookerField:
                sensorType === 'SAS3' ? 'average_zone3_SAS_temperature' : 'average_zone3_SAS_datacold',
            };
            break;
          case 'BOX3':
          case 'BOX3_DATACOLD':
            chartConfig.c3.children[sensor.flespiKey] = {
              label:
                sensorType === 'BOX3'
                  ? i18n.t('assets.asset.table.c3-box-sensor')
                  : i18n.t('assets.asset.table.c3-box-datacold'),
              i18nKey:
                sensorType === 'BOX3'
                  ? 'assets.asset.table.c3-box-sensor'
                  : 'assets.asset.table.c3-box-datacold',
              lineType: 'solid',
              available,
              color: sensorType === 'BOX3' ? theme.palette.chart.c3.box : theme.palette.chart.c3.boxDatacold,
              lookerField:
                sensorType === 'BOX3' ? 'average_zone3_BOX_temperature' : 'average_zone3_BOX_datacold',
            };
            break;
          default:
            break;
        }
      }
    }
  }

  unpureMarkEmptyGroupsAsUnavailable(chartConfig);

  return chartConfig;
};
