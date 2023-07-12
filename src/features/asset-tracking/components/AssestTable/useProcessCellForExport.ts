import { ProcessCellForExportParams } from '@ag-grid-community/core';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { truFuelLevelFormatter } from './column-formatters';
import { AssetTrackingColIdType } from './DefaultColumnDefs';

import type { SnapshotDataEx } from '@/features/common';
import {
  truStatusExportFormatter,
  doorStatusFormatter,
  sideRearDoorStatusFormatter,
  dateTimeFormatter,
  temperatureFormatter,
  percentFormatter,
  truBatteryVoltageFormatter,
  truSoftwareVersionFormatter,
  runHoursFormatter,
} from '@/components';
import { translateOperatingMode } from '@/utils';
import { translateAssetStatus } from '@/utils/translateAssetStatus';
import { translateEngineControlMode } from '@/utils/translateEngineControlMode';
import { translateEnginePowerMode } from '@/utils/translateEnginePowerMode';
import { composeAlarmDetailsForExport } from '@/utils/composeAlarmDetailsForExport';
import { translateToggleSensitiveOperatingMode } from '@/utils/translateToggleSensitiveOperatingMode';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { useUserSettings } from '@/providers/UserSettings';

export const useProcessCellForExport = () => {
  const { featureFlags } = useApplicationContext();
  const { userSettings } = useUserSettings();
  const { temperature, timezone, dateFormat } = userSettings;
  const { t } = useTranslation();
  const isCompToggleEnabled = featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE;

  return useCallback(
    (params: ProcessCellForExportParams) => {
      const { column, value, node } = params;
      const data = node?.data as Maybe<SnapshotDataEx>;

      switch (column.getColId() as AssetTrackingColIdType) {
        case 'assetStatus':
          return translateAssetStatus(t, value);

        case 'powerMode':
          return translateEnginePowerMode(t, value);

        case 'controlMode':
          return translateEngineControlMode(t, value);

        case 'syntheticTruStatus':
          return truStatusExportFormatter({
            flespiData: data?.flespiData,
            compartmentConfig: data?.device?.compartmentConfig ?? null,
            featureFlags,
            t,
          });

        case 'alarms':
          return data?.activeFreezerAlarms?.length ? `${data?.activeFreezerAlarms?.length}` : '';
        case 'activeAlarmDetails':
          return composeAlarmDetailsForExport(data?.activeFreezerAlarms);

        case 'freezerDoor':
        case 'datacoldDoorRear1':
        case 'datacoldDoorSide1':
        case 'datacoldDoorRear2':
        case 'datacoldDoorSide2':
        case 'datacoldDoorRear3':
        case 'datacoldDoorSide3':
        case 'datacoldDoorRear4':
        case 'datacoldDoorSide4':
          return doorStatusFormatter({ value }, t);

        case 'rearDoor':
          return sideRearDoorStatusFormatter({ data: node?.data, value }, 'rearDoor', t);

        case 'sideDoor':
          return sideRearDoorStatusFormatter({ data: node?.data, value }, 'sideDoor', t);

        case 'lastUpdated':
          return dateTimeFormatter(value, { dateFormat, timestampFormat: 'seconds', timezone });

        case 'freezerAirTemperature':
        case 'c1Setpoint':
        case 'c1Supply':
        case 'c1Return':
        case 'c1BoxSensor':
        case 'c1RasSensor':
        case 'c1SasSensor':
        case 'c1BoxDatacold':
        case 'c1RasDatacold':
        case 'c1SasDatacold':
        case 'c1HumiditySetpoint':
        case 'c1Humidity':
        case 'c2Setpoint':
        case 'c2Supply':
        case 'c2Return':
        case 'c2BoxSensor':
        case 'c2RasSensor':
        case 'c2SasSensor':
        case 'c2BoxDatacold':
        case 'c2RasDatacold':
        case 'c2SasDatacold':
        case 'c3Setpoint':
        case 'c3Supply':
        case 'c3Return':
        case 'c3BoxSensor':
        case 'c3RasSensor':
        case 'c3SasSensor':
        case 'c3BoxDatacold':
        case 'c3RasDatacold':
        case 'c3SasDatacold':
          return temperatureFormatter({ value }, { units: temperature });

        case 'freezerComp1Mode':
          return translateOperatingMode(t, value);
        case 'freezerComp2Mode':
          return isCompToggleEnabled
            ? translateToggleSensitiveOperatingMode(t, 2, params)
            : translateOperatingMode(t, value);
        case 'freezerComp3Mode':
          return isCompToggleEnabled
            ? translateToggleSensitiveOperatingMode(t, 3, params)
            : translateOperatingMode(t, value);

        case 'datacoldFuelLevel1':
        case 'datacoldFuelLevel2':
        case 'datacoldFuelLevel3':
          return percentFormatter(params);

        case 'truFuelLevel':
          return truFuelLevelFormatter({ data }, t);

        case 'batteryVoltage':
          return truBatteryVoltageFormatter({ data, value });

        case 'truSoftwareVersion':
          return truSoftwareVersionFormatter({ data, value });

        case 'runHours':
          return runHoursFormatter({ data, value });

        default:
          break;
      }

      return value;
    },
    [dateFormat, featureFlags, isCompToggleEnabled, t, temperature, timezone]
  );
};
