import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ColumnMovedEvent,
  ColumnPinnedEvent,
  ColumnResizedEvent,
  ColumnVisibleEvent,
  GridApi,
  GridReadyEvent,
  SortChangedEvent,
} from '@ag-grid-community/core';
import { isBoolean, isEmpty, isEqual, isNil } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { FlespiData, Maybe, Sensor } from '@carrier-io/lynx-fleet-types';
import { UserService } from '@carrier-io/lynx-fleet-data-lib';

import {
  FlespiDataType,
  IColDefColGroupDef,
  NONE,
  NOT_INSTALLED,
  SensorFieldValue,
  SensorsConfig,
  SensorType,
  SensorVersion,
} from '../types';
import {
  getDatacoldSensors,
  getSensorConnectionLocation,
  getSensors,
  indexDeviceSensors,
  isDoorSensor,
  isFuelLevelSensor,
  isIgnitionInput,
  isTemperatureSensor,
  isTemperatureSensor1WireBLE,
  mapConfigAndDeviceSensors,
} from '../utils';
import { sensorTypes } from '../components/SensorsConfigTable/constants';

import { useUserSettings } from '@/providers/UserSettings';
import { getSensorFlespiKey, getSensorType, getTrackingSettingType, toFahrenheit } from '@/utils';
import { composeColumnsUserSettings } from '@/utils/saved-columns';
import { useAppSelector } from '@/stores';
import { getAuthUserEmail } from '@/features/authentication';
import { Columns } from '@/types';

// TODO: add 'configured' argument
export const getSensorDisplayValue = (
  flespiData: FlespiDataType,
  dataField: string,
  measurementTemperature: string = 'C',
  isDin4Config = false,
  isTRSConfig = false
) => {
  if (isNil(flespiData) || isNil(flespiData[dataField])) {
    return null;
  }

  if (isDoorSensor({ dataField })) {
    return flespiData[dataField]
      ? 'device.management.sensor.config.door.closed'
      : 'device.management.sensor.config.door.open';
  }

  if (isTemperatureSensor({ dataField })) {
    return measurementTemperature === 'C' ? flespiData[dataField] : toFahrenheit(flespiData[dataField]);
  }

  if (isIgnitionInput({ dataField }) && (isDin4Config || isTRSConfig)) {
    return flespiData[dataField] ? 'common.on' : 'common.off';
  }

  return isBoolean(flespiData[dataField]) ? flespiData[dataField].toString() : flespiData[dataField];
};

export const isSensorConfigurationDisabled = (
  dataField: string,
  sensorType?: string,
  sensorLocation?: string | null,
  isTRSConfig = false
): boolean => {
  if (isTemperatureSensor({ dataField })) {
    return sensorType === NONE && sensorLocation === NONE; // TODO: Remove sensorType after DB migration LYNXFLT-2422
  }

  if (isDoorSensor({ dataField })) {
    return !sensorLocation || sensorLocation === NONE;
  }

  if (isIgnitionInput({ dataField }) && isTRSConfig) {
    return true;
  }

  return false;
};

export const getConfigOnConfigurationChange = ({
  checked,
  flespiKey,
  config,
}: {
  checked: boolean;
  flespiKey: string;
  config: SensorsConfig;
}) => {
  const newConfig = {
    ...config,
    [flespiKey]: {
      ...config[flespiKey],
      configured: checked,
      touched: true,
    },
  };

  if (!isFuelLevelSensor({ dataField: flespiKey })) {
    return newConfig;
  }

  if (checked) {
    if (flespiKey === 'plugin_fuel_level') {
      newConfig.freezer_fuel_level = {
        ...config.freezer_fuel_level,
        configured: false,
        touched: true,
      };
    } else {
      newConfig.plugin_fuel_level = {
        ...config.plugin_fuel_level,
        configured: false,
        touched: true,
      };
    }
  }

  return newConfig;
};

export function useSensorConfig(
  sensorConfigInput: SensorsConfig,
  onSensorConfigChange: (newConfig: SensorsConfig) => void,
  flespiData?: Maybe<FlespiData>,
  sensors?: Maybe<Maybe<Sensor>[]>,
  isDin4Config?: boolean,
  isTRSConfig?: boolean
) {
  const authUserEmail = useAppSelector(getAuthUserEmail);
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { temperature: measurementTemperature } = userSettings;
  const { t } = useTranslation();

  const isDin4Ref = useRef(isDin4Config);
  const isTRSRef = useRef(isTRSConfig);

  useEffect(() => {
    isDin4Ref.current = isDin4Config;
  }, [isDin4Config]);

  useEffect(() => {
    isTRSRef.current = isTRSConfig;
  }, [isTRSConfig]);

  const extractSensorId = (idField?: string, fd?: Maybe<FlespiData>) =>
    idField && fd?.[idField as keyof Partial<FlespiData>];

  // initialize sensor config state and formik value
  const [sensorConfig, setSensorConfig] = useState<SensorsConfig>(sensorConfigInput);

  const [indexedSensors, setIndexedSensors] = useState<SensorsConfig>({});
  const [regularSensorsGridApi, setRegularSensorsGridApi] = useState<GridApi | null>(null);
  const [datacoldSensorsGridApi, setDatacoldSensorsGridApi] = useState<GridApi | null>(null);

  const regularSensorsGridApiRef = useRef<GridApi | null>(regularSensorsGridApi);
  const datacoldSensorsGridApiRef = useRef<GridApi | null>(datacoldSensorsGridApi);

  const sensorConfigRef = useRef(sensorConfig);
  const indexedSensorsRef = useRef(indexedSensors);

  const getSensorsData =
    (isDataCold: boolean) => (config: SensorsConfig, fData: Maybe<FlespiData> | undefined) =>
      [...getDatacoldSensors(t), ...getSensors(t)]
        .filter((sensor) => Boolean(sensor.datacold) === isDataCold)
        .filter((sensor) => {
          if (
            ((isDin4Ref.current || isTRSRef.current) && sensor.dataField === 'plugin_door_closed_4') ||
            (!isDin4Ref.current && sensor.dataField === 'engine_ignition_status') ||
            (!isTRSRef.current && sensor.dataField === 'din_4')
          ) {
            return false;
          }

          return true;
        })
        .map(({ value, display, dataField, idField, sensorId, fixed, datacold, sensorType }) => {
          const displayValue = getSensorDisplayValue(
            fData as FlespiDataType,
            getSensorFlespiKey(dataField, sensorType),
            measurementTemperature,
            isDin4Ref.current,
            isTRSRef.current
          );

          return {
            value,
            display,
            dataField,
            idField,
            sensorId: (idField && extractSensorId(idField, fData)) || sensorId,
            macId: config[dataField]?.macId,
            fixed,
            datacold,
            installed: config[dataField]?.installed,
            sensorLocation: {
              sensorLocationTemp: getSensorType({
                sensorLocation: config[dataField]?.sensorLocation,
                sensorType: config[dataField]?.sensorType,
                flespiKey: dataField,
              } as Sensor),
              sensorLocationDoor: config[dataField]?.sensorLocation,
              sensorType: config[dataField]?.sensorType,
            },
            sensorType: config[dataField]?.sensorType,
            connectionLocation: {
              value: getSensorConnectionLocation(dataField, config[dataField]?.connectionLocation),
              // door sensor added per LYNXFLT-5722
              isDisabled: isFuelLevelSensor({ dataField }) || isDoorSensor({ dataField }),
            },
            configured: {
              value:
                isTRSRef.current && isIgnitionInput({ dataField }) ? true : config[dataField]?.configured,
              isDisabled: isSensorConfigurationDisabled(
                dataField,
                config[dataField]?.sensorType,
                config[dataField]?.sensorLocation,
                isTRSRef.current
              ),
            },
            lastUpdated: config[dataField]?.lastUpdated,
            compatibleWithEN12830: config[dataField]?.compatibleWithEN12830,
            sensorValue: displayValue ?? (config[dataField]?.configured ? displayValue : NOT_INSTALLED),
          };
        });

  const getRegularSensorsData = useCallback(
    (newConfig, data) => getSensorsData(false)(newConfig, data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [measurementTemperature, isDin4Config, isTRSConfig]
  );

  const getDatacoldSensorsData = useCallback(
    (newConfig, data) => getSensorsData(true)(newConfig, data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [measurementTemperature]
  );

  useEffect(() => {
    regularSensorsGridApiRef.current = regularSensorsGridApi;
    datacoldSensorsGridApiRef.current = datacoldSensorsGridApi;
    sensorConfigRef.current = sensorConfig;
    indexedSensorsRef.current = indexedSensors;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regularSensorsGridApi, datacoldSensorsGridApi, sensorConfig]);

  useEffect(() => {
    setSensorConfig(sensorConfigInput);
  }, [sensorConfigInput]);

  useEffect(() => {
    if (!isEqual(sensorConfigInput, sensorConfig)) {
      onSensorConfigChange(sensorConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorConfig]);

  useEffect(() => {
    if (sensors) {
      const newIndexedSensors = indexDeviceSensors(sensors as SensorType[]);

      setIndexedSensors(newIndexedSensors);
    }
  }, [sensors]);

  useEffect(() => {
    const newConfig = isEmpty(indexedSensors)
      ? sensorConfig
      : mapConfigAndDeviceSensors(sensorConfig, indexedSensors);

    setSensorConfig(newConfig);

    const regularSensorsData = getRegularSensorsData(newConfig, flespiData);

    regularSensorsGridApi?.setRowData(regularSensorsData);

    const datacoldSensorsData = getDatacoldSensorsData(newConfig, flespiData);

    datacoldSensorsGridApi?.setRowData(datacoldSensorsData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    indexedSensors,
    flespiData,
    regularSensorsGridApi,
    datacoldSensorsGridApi,
    getRegularSensorsData,
    getDatacoldSensorsData,
  ]);

  const onRegularSensorsGridReady = (params: GridReadyEvent) => {
    setRegularSensorsGridApi(params.api);
  };

  const onDatacoldSensorsGridReady = (params: GridReadyEvent) => {
    setDatacoldSensorsGridApi(params.api);
  };

  interface SensorsColumns {
    name: string;
    columns: string[] | undefined;
  }

  interface IUserColumnSettings {
    deviceCommissioningSensorsColumns?: SensorsColumns[];
    deviceCommissioningDatacoldSensorsColumns?: SensorsColumns[];
  }

  const saveUserColumnSettings = (userColumnSettings: IUserColumnSettings) => {
    UserService.saveUserSettings({
      input: {
        email: authUserEmail,
        ...userColumnSettings,
      },
    })
      .then((res) => {
        if (res?.data?.updateUser?.error !== '') {
          // eslint-disable-next-line no-console
          console.info('could not save column state.');
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.info('could not save table state:', err);
      });
  };

  const updateTableColumnSettings = (
    key: string,
    value: {
      name: string;
      columns: string[];
    }[]
  ) => {
    onUserSettingsChange(key, value);

    // Save data to backend
    saveUserColumnSettings({
      [key]: value,
    });
  };

  const onAppColumnsChanged = (
    sensorVersion: SensorVersion,
    newColumnDefs: IColDefColGroupDef[],
    defaultColumnsDef: Columns
  ) => {
    const composedColumns = composeColumnsUserSettings({
      defaultColumns: defaultColumnsDef,
      changedColumns: newColumnDefs,
    });

    const key =
      sensorVersion === SensorVersion.Datacold
        ? 'deviceCommissioningDatacoldSensorsColumns'
        : 'deviceCommissioningSensorsColumns';

    updateTableColumnSettings(key, [{ name: 'default', columns: composedColumns }]);
  };

  const onRegularSensorsColumnChanged = (
    params: ColumnMovedEvent | ColumnPinnedEvent | ColumnVisibleEvent | SortChangedEvent | ColumnResizedEvent,
    defaultColumnsDef: Columns
  ) => {
    if (getTrackingSettingType(params) === 'Unknown') {
      return;
    }

    const newColumnDefs = regularSensorsGridApi?.getColumnDefs();
    if (!newColumnDefs) {
      return;
    }
    const composedColumns = composeColumnsUserSettings({
      defaultColumns: defaultColumnsDef,
      changedColumns: newColumnDefs,
    });

    updateTableColumnSettings('deviceCommissioningSensorsColumns', [
      { name: 'default', columns: composedColumns },
    ]);
  };

  const onDatacoldSensorsColumnChanged = (
    params: ColumnMovedEvent | ColumnPinnedEvent | ColumnVisibleEvent | SortChangedEvent | ColumnResizedEvent,
    defaultColumnsDef: Columns
  ) => {
    if (getTrackingSettingType(params) === 'Unknown') {
      return;
    }

    const newColumnDefs = datacoldSensorsGridApi?.getColumnDefs();
    if (!newColumnDefs) {
      return;
    }
    const composedColumns = composeColumnsUserSettings({
      defaultColumns: defaultColumnsDef,
      changedColumns: newColumnDefs,
    });

    updateTableColumnSettings('deviceCommissioningDatacoldSensorsColumns', [
      { name: 'default', columns: composedColumns },
    ]);
  };

  const getRegularMainMenuItems = useCallback(
    () => [
      'pinSubMenu',
      'separator',
      'autoSizeThis',
      'autoSizeAll',
      'separator',
      {
        name: t('common.reset-columns'),
        action: () => {
          updateTableColumnSettings('deviceCommissioningSensorsColumns', [{ name: 'default', columns: [] }]);
        },
      },
    ], // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  const getDatacoldMainMenuItems = () => [
    'pinSubMenu',
    'separator',
    'autoSizeThis',
    'autoSizeAll',
    'separator',
    {
      name: t('common.reset-columns'),
      action: () => {
        updateTableColumnSettings('deviceCommissioningDatacoldSensorsColumns', [
          { name: 'default', columns: [] },
        ]);
      },
    },
  ];

  // form control change handlers
  const updateRegularSensors = (config: SensorsConfig) => {
    const newSensorsData = getRegularSensorsData(config, flespiData);

    regularSensorsGridApiRef.current?.setRowData(newSensorsData);
  };

  const updateDatacoldSensors = (config: SensorsConfig) => {
    const newSensorsData = getDatacoldSensorsData(config, flespiData);
    datacoldSensorsGridApiRef.current?.setRowData(newSensorsData);
  };

  const getSenorTypeValue = (
    value: SensorFieldValue,
    field: string,
    isTemperatureSensorValue: boolean,
    sensorType?: string
  ) => {
    if (isTemperatureSensorValue && field === 'macId') {
      return value ? sensorTypes.BT_EN12830.value : sensorTypes.ONE_WIRE.value;
    }

    return sensorType;
  };

  const getNewConfig = (value: SensorFieldValue, flespiKey: string, field: string) => {
    const { sensorType, configured, compatibleWithEN12830 } = sensorConfigRef.current[flespiKey];
    const disableInstallationComplete = field === 'sensorLocation' && value === NONE;
    const isTempSensor = isTemperatureSensor({ dataField: flespiKey });
    const valueEN12830 = isTempSensor ? Boolean(field === 'macId' && value) : compatibleWithEN12830;

    if (isTempSensor && field === 'sensorLocation') {
      return {
        ...sensorConfigRef.current,
        [flespiKey]: {
          ...sensorConfigRef.current[flespiKey],
          [field]: typeof value === 'string' ? value : NONE,
          sensorType: sensorType ?? NONE,
          configured: disableInstallationComplete ? false : configured,
          touched: true,
        },
      };
    }

    const sensorTypeValue = getSenorTypeValue(value, field, isTempSensor, sensorType);

    return {
      ...sensorConfigRef.current,
      [flespiKey]: {
        ...sensorConfigRef.current[flespiKey],
        [field]: value,
        configured: disableInstallationComplete ? false : configured,
        touched: true,
        compatibleWithEN12830: valueEN12830,
        sensorType: sensorTypeValue ?? NONE,
      },
    };
  };

  const handleChangeSensorField = useCallback((value: SensorFieldValue, flespiKey: string, field: string) => {
    const newConfig = getNewConfig(value, flespiKey, field);

    updateRegularSensors(newConfig);
    setSensorConfig(newConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeDatacoldSensorField = useCallback(
    (value: SensorFieldValue, flespiKey: string, field: string) => {
      const newConfig = getNewConfig(value, flespiKey, field);

      updateDatacoldSensors(newConfig);
      setSensorConfig(newConfig);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getHandleChangeConfigured =
    (updateSensors: (config: SensorsConfig) => void) => (checked: boolean, flespiKey: string) => {
      const newConfig = getConfigOnConfigurationChange({
        checked,
        flespiKey,
        config: sensorConfigRef.current,
      });
      updateSensors(newConfig);

      setSensorConfig(newConfig);
    };

  const handleChangeRegularSensorsConfigured = getHandleChangeConfigured(updateRegularSensors);
  const handleChangeDatacoldSensorsConfigured = getHandleChangeConfigured(updateDatacoldSensors);

  const toggleFuelLevelConfiguration = useCallback((checked: boolean, flespiKey: string) => {
    const newConfig = getConfigOnConfigurationChange({ checked, flespiKey, config: sensorConfigRef.current });
    updateRegularSensors(newConfig);

    setSensorConfig(newConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    onAppColumnsChanged,
    onRegularSensorsGridReady,
    onDatacoldSensorsGridReady,
    onRegularSensorsColumnChanged,
    onDatacoldSensorsColumnChanged,
    getRegularMainMenuItems,
    getDatacoldMainMenuItems,
    isFuelLevelSensor,
    isDoorSensor,
    isTemperatureSensor,
    isTemperatureSensor1WireBLE,
    handleChangeSensorField,
    handleChangeDatacoldSensorField,
    handleChangeRegularSensorsConfigured,
    handleChangeDatacoldSensorsConfigured,
    toggleFuelLevelConfiguration,
    regularSensorsGridApiRef,
  };
}
