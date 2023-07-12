import { EventDataSourceType } from '@carrier-io/lynx-fleet-types';

const eventSourceTypeToTranslationMap: Record<EventDataSourceType, string> = {
  ALARM_SHUTDOWN: 'assethistory.route.alarm-shutdown',
  FLESPI: 'flespi',
  SNAPSHOT: 'snapshot',
  POINT: 'point',
  GEOFENCE_INSIDE: 'assethistory.route.geofence-inside',
  GEOFENCE_OUTSIDE: 'assethistory.route.geofence-outside',
  NOTIFICATION_DOOR: 'assethistory.route.notification-door',
  NOTIFICATION_FREEZER_SHUTDOWN_ACTIVE: 'assethistory.route.notification-freezer-shutdown-active',
  NOTIFICATION_GEOFENCE_LOCATION: 'assethistory.route.notification-geofence-location',
  NOTIFICATION_LOW_BATTERY: 'assethistory.route.notification-low-battery',
  NOTIFICATION_REAR_DOOR_OPEN: 'assethistory.route.notification-rear-door-open',
  NOTIFICATION_SETPOINT_1: 'assethistory.route.notification-setpoint-1',
  NOTIFICATION_SETPOINT_2: 'assethistory.route.notification-setpoint-2',
  NOTIFICATION_SETPOINT_3: 'assethistory.route.notification-setpoint-3',
  NOTIFICATION_SIDE_DOOR_OPEN: 'assethistory.route.notification-side-door-open',
  NOTIFICATION_TEMPERATURE_1: 'assethistory.route.notification-temperature-1',
  NOTIFICATION_TEMPERATURE_2: 'assethistory.route.notification-temperature-2',
  NOTIFICATION_TEMPERATURE_3: 'assethistory.route.notification-temperature-3',
  NOTIFICATION_TEMPERATURE_OUT_OF_RANGE: 'assethistory.route.notification-temperature-out-of-range',
  NOTIFICATION_TRU_ALARM: 'assethistory.route.notification-tru-alarm',
  SENSOR_COMPARTMENT_1_OFF: 'assethistory.route.sensor-compartment-1-off',
  SENSOR_COMPARTMENT_1_ON: 'assethistory.route.sensor-compartment-1-on',
  SENSOR_COMPARTMENT_2_OFF: 'assethistory.route.sensor-compartment-2-off',
  SENSOR_COMPARTMENT_2_ON: 'assethistory.route.sensor-compartment-2-on',
  SENSOR_COMPARTMENT_3_OFF: 'assethistory.route.sensor-compartment-3-off',
  SENSOR_COMPARTMENT_3_ON: 'assethistory.route.sensor-compartment-3-on',
  SENSOR_CONTROL_MODE_CONTUNUOS: 'assethistory.route.sensor-control-mode-contunuos',
  SENSOR_CONTROL_MODE_START_STOP: 'assethistory.route.sensor-control-mode-start-stop',
  SENSOR_DEFROST_OFF: 'assethistory.route.sensor-defrost-off',
  SENSOR_DEFROST_ON: 'assethistory.route.sensor-defrost-on',
  SENSOR_MOVING_STARTED: 'assethistory.route.sensor-moving-started',
  SENSOR_MOVING_STOPPED: 'assethistory.route.sensor-moving-stopped',
  SENSOR_OPERATING_MODE_1_COOL: 'assethistory.route.sensor-operating-mode-1-cool',
  SENSOR_OPERATING_MODE_1_HEAT: 'assethistory.route.sensor-operating-mode-1-heat',
  SENSOR_OPERATING_MODE_2_COOL: 'assethistory.route.sensor-operating-mode-2-cool',
  SENSOR_OPERATING_MODE_2_HEAT: 'assethistory.route.sensor-operating-mode-2-heat',
  SENSOR_OPERATING_MODE_3_COOL: 'assethistory.route.sensor-operating-mode-3-cool',
  SENSOR_OPERATING_MODE_3_HEAT: 'assethistory.route.sensor-operating-mode-3-heat',
  SENSOR_POWER_MODE_ENGINE: 'assethistory.route.sensor-power-mode-engine',
  SENSOR_POWER_MODE_STANDBY: 'assethistory.route.sensor-power-mode-standby',
  SENSOR_REAR_DOOR_CLOSED: 'assethistory.route.sensor-rear-door-closed',
  SENSOR_REAR_DOOR_OPEN: 'assethistory.route.sensor-rear-door-open',
  SENSOR_SIDE_DOOR_CLOSED: 'assethistory.route.sensor-side-door-closed',
  SENSOR_SIDE_DOOR_OPEN: 'assethistory.route.sensor-side-door-open',
  SENSOR_TRU_OFF: 'assethistory.route.sensor-tru-off',
  SENSOR_TRU_ON: 'assethistory.route.sensor-tru-on',
  START_POINT: 'assethistory.route.start-route',
  END_POINT: 'assethistory.route.end-route',
};

export const getEventNameTranslationKey = (sourceType: EventDataSourceType) =>
  eventSourceTypeToTranslationMap?.[sourceType] || '';
