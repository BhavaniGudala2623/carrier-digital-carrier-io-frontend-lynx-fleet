import type { SnapshotDataEx } from '@/features/common';

export const getAssetDataForPopup = (snapshot: SnapshotDataEx | null) => {
  if (!snapshot) {
    return {};
  }

  const { asset, device, activeFreezerAlarms, computedFields, flespiData } = snapshot;

  return {
    id: asset?.id,
    name: asset?.name,
    flespiId: device?.flespiId,
    lastUpdated: flespiData?.timestamp,
    movement: computedFields?.movementStatus,
    speed: flespiData?.position_speed,
    pluginFuelLevel: device?.sensors?.pluginFuelLevel,
    freezerFuelLevel: device?.sensors?.freezerFuelLevel,
    freezerControlMode: flespiData?.freezer_control_mode,
    productFamily: device?.productFamily as string,
    powerMode: computedFields?.enginePowerMode,
    controlMode: computedFields?.engineControlMode,
    rearDoor: computedFields?.doorStatus?.rearDoor,
    sideDoor: computedFields?.doorStatus?.sideDoor,
    rearDoorConfigured: device?.sensors?.rearDoorConfigured,
    sideDoorConfigured: device?.sensors?.sideDoorConfigured,
    pluginFuelLevelConfigured: device?.sensors?.pluginFuelLevelConfigured,
    freezerFuelLevelConfigured: device?.sensors?.freezerFuelLevelConfigured,
    compartment1: {
      setpoint: flespiData?.freezer_zone1_temperature_setpoint,
      return: flespiData?.freezer_zone1_return_air_temperature,
      truMode: flespiData?.freezer_comp1_mode,
    },
    compartment2: {
      setpoint: flespiData?.freezer_zone2_temperature_setpoint,
      return: flespiData?.freezer_zone2_return_air_temperature,
      truMode: flespiData?.freezer_comp2_mode,
    },
    compartment3: {
      setpoint: flespiData?.freezer_zone3_temperature_setpoint,
      return: flespiData?.freezer_zone3_return_air_temperature,
      truMode: flespiData?.freezer_comp3_mode,
    },
    compartmentConfig: device?.compartmentConfig,
    alarms: activeFreezerAlarms?.map((item) => ({
      code: item?.code,
      description: item?.description,
      response: item?.response,
      type: item?.type,
    })),
  };
};
