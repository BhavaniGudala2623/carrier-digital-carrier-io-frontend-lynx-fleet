import { useContext } from 'react';
import { useFormikContext } from 'formik';
import Box from '@carrier-io/fds-react/Box';

import { SensorsConfigTable } from '../../SensorsConfigTable';
import { DeviceCommissioningFormValues, SensorsConfig, SensorVersion } from '../../../types';
import { DeviceCommissioningContext } from '../../../providers';
import { useSensorConfig } from '../../../hooks';

const SENSORS_GRID_HEIGHT = 570;

export const SensorSection = () => {
  const { values, setFieldValue } = useFormikContext<DeviceCommissioningFormValues>();

  const { snapshot } = useContext(DeviceCommissioningContext);
  const { flespiData, device } = snapshot;

  const isTRSConfig = values?.fotaweb.groupName?.includes('TRS');
  const isDin4Config = values?.fotaweb.groupName?.includes('DIN4') && !isTRSConfig;

  const handleConfigChange = (newConfig: SensorsConfig) => {
    setFieldValue('sensorConfiguration', newConfig);
  };

  const {
    onRegularSensorsGridReady,
    onRegularSensorsColumnChanged,
    getRegularMainMenuItems,
    isFuelLevelSensor,
    isDoorSensor,
    isTemperatureSensor,
    isTemperatureSensor1WireBLE,
    handleChangeSensorField,
    handleChangeRegularSensorsConfigured,
    toggleFuelLevelConfiguration,
    regularSensorsGridApiRef,
  } = useSensorConfig(
    values.sensorConfiguration,
    handleConfigChange,
    flespiData,
    device?.sensors,
    isDin4Config,
    isTRSConfig
  );

  return (
    <Box height={SENSORS_GRID_HEIGHT} width="100%">
      <SensorsConfigTable
        onGridReady={onRegularSensorsGridReady}
        onColumnsChanged={onRegularSensorsColumnChanged}
        getMainMenuItems={getRegularMainMenuItems}
        isFuelLevelSensor={isFuelLevelSensor}
        isDoorSensor={isDoorSensor}
        isTemperatureSensor={isTemperatureSensor}
        isTemperatureSensor1WireBLE={isTemperatureSensor1WireBLE}
        handleChangeSensorField={handleChangeSensorField}
        handleChangeConfigured={handleChangeRegularSensorsConfigured}
        toggleFuelLevelConfiguration={toggleFuelLevelConfiguration}
        sensorVersion={SensorVersion.Regular}
        regularSensorsGridApiRef={regularSensorsGridApiRef}
      />
    </Box>
  );
};
