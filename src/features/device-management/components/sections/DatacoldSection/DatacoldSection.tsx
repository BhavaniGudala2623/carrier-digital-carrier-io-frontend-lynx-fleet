import { useContext } from 'react';
import { useFormikContext } from 'formik';
import Box from '@carrier-io/fds-react/Box';

import { SensorsConfigTable } from '../../SensorsConfigTable';
import { DeviceCommissioningFormValues, SensorsConfig, SensorVersion } from '../../../types';
import { DeviceCommissioningContext } from '../../../providers';
import { useSensorConfig } from '../../../hooks';

const DATACOLD_SENSORS_GRID_HEIGHT = 615;

export const DatacoldSection = () => {
  const { values, setFieldValue } = useFormikContext<DeviceCommissioningFormValues>();

  const { snapshot } = useContext(DeviceCommissioningContext);
  const { flespiData, device } = snapshot;

  const handleConfigChange = (newConfig: SensorsConfig) => {
    setFieldValue('sensorConfiguration', newConfig);
  };

  const {
    onDatacoldSensorsGridReady,
    onDatacoldSensorsColumnChanged,
    getDatacoldMainMenuItems,
    isFuelLevelSensor,
    isDoorSensor,
    isTemperatureSensor,
    handleChangeDatacoldSensorField,
    handleChangeDatacoldSensorsConfigured,
    toggleFuelLevelConfiguration,
  } = useSensorConfig(values.sensorConfiguration, handleConfigChange, flespiData, device?.sensors);

  return (
    <Box height={DATACOLD_SENSORS_GRID_HEIGHT} width="100%">
      <SensorsConfigTable
        onGridReady={onDatacoldSensorsGridReady}
        onColumnsChanged={onDatacoldSensorsColumnChanged}
        getMainMenuItems={getDatacoldMainMenuItems}
        isFuelLevelSensor={isFuelLevelSensor}
        isDoorSensor={isDoorSensor}
        isTemperatureSensor={isTemperatureSensor}
        handleChangeSensorField={handleChangeDatacoldSensorField}
        handleChangeConfigured={handleChangeDatacoldSensorsConfigured}
        toggleFuelLevelConfiguration={toggleFuelLevelConfiguration}
        sensorVersion={SensorVersion.Datacold}
      />
    </Box>
  );
};

DatacoldSection.displayName = 'DatacoldSection';
