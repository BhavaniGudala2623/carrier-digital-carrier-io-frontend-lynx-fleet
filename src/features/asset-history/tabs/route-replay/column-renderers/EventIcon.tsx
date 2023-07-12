import Box from '@carrier-io/fds-react/Box';
import { SvgIconProps } from '@carrier-io/fds-react';
import { FC } from 'react';
import { EventDataSourceType } from '@carrier-io/lynx-fleet-types';

import {
  CoolIcon,
  DoorIcon,
  AlarmIcon,
  BatteryIcon,
  GeolocationIcon,
  TemperatureIcon,
  NotificationEventIcon,
  AssetStatusStopIcon,
  AssetStatusMovingIcon,
  DefrostIcon,
  HeatIcon,
  TruStatusIcon,
  CompartmentOnIcon,
  CompartmentOffIcon,
  PowerModeEngineIcon,
  PowerModeStandbyIcon,
  ControlModeContinuousIcon,
  ControlModeStartStopIcon,
  StartRouteIcon,
  EndRouteIcon,
} from '@/components';

export const EVENT_ICONS: Record<string, FC<SvgIconProps>> = {
  NOTIFICATION_FREEZER_SHUTDOWN_ACTIVE: NotificationEventIcon,
  NOTIFICATION_REAR_DOOR_OPEN: NotificationEventIcon,
  NOTIFICATION_SIDE_DOOR_OPEN: NotificationEventIcon,
  NOTIFICATION_GEOFENCE_LOCATION: NotificationEventIcon,
  NOTIFICATION_DOOR: NotificationEventIcon,
  NOTIFICATION_TRU_ALARM: NotificationEventIcon,
  NOTIFICATION_LOW_BATTERY: BatteryIcon,
  NOTIFICATION_TEMPERATURE_OUT_OF_RANGE: TemperatureIcon,
  NOTIFICATION_TEMPERATURE_1: TemperatureIcon,
  NOTIFICATION_TEMPERATURE_2: TemperatureIcon,
  NOTIFICATION_TEMPERATURE_3: TemperatureIcon,
  NOTIFICATION_SETPOINT_1: TemperatureIcon,
  NOTIFICATION_SETPOINT_2: TemperatureIcon,
  NOTIFICATION_SETPOINT_3: TemperatureIcon,
  GEOFENCE_INSIDE: GeolocationIcon,
  GEOFENCE_OUTSIDE: GeolocationIcon,
  ALARM_SHUTDOWN: AlarmIcon,
  SENSOR_REAR_DOOR_OPEN: DoorIcon,
  SENSOR_REAR_DOOR_CLOSED: DoorIcon,
  SENSOR_SIDE_DOOR_OPEN: DoorIcon,
  SENSOR_SIDE_DOOR_CLOSED: DoorIcon,
  SENSOR_TRU_ON: TruStatusIcon,
  SENSOR_TRU_OFF: TruStatusIcon,
  SENSOR_DEFROST_ON: DefrostIcon,
  SENSOR_DEFROST_OFF: DefrostIcon,
  SENSOR_MOVING_STARTED: AssetStatusMovingIcon,
  SENSOR_MOVING_STOPPED: AssetStatusStopIcon,
  SENSOR_OPERATING_MODE_1_COOL: CoolIcon,
  SENSOR_OPERATING_MODE_1_HEAT: HeatIcon,
  SENSOR_OPERATING_MODE_2_COOL: CoolIcon,
  SENSOR_OPERATING_MODE_2_HEAT: HeatIcon,
  SENSOR_OPERATING_MODE_3_COOL: CoolIcon,
  SENSOR_OPERATING_MODE_3_HEAT: HeatIcon,
  SENSOR_COMPARTMENT_1_ON: CompartmentOnIcon,
  SENSOR_COMPARTMENT_1_OFF: CompartmentOffIcon,
  SENSOR_COMPARTMENT_2_ON: CompartmentOnIcon,
  SENSOR_COMPARTMENT_2_OFF: CompartmentOffIcon,
  SENSOR_COMPARTMENT_3_ON: CompartmentOnIcon,
  SENSOR_COMPARTMENT_3_OFF: CompartmentOffIcon,
  SENSOR_POWER_MODE_ENGINE: PowerModeEngineIcon,
  SENSOR_POWER_MODE_STANDBY: PowerModeStandbyIcon,
  SENSOR_CONTROL_MODE_CONTUNUOS: ControlModeContinuousIcon,
  SENSOR_CONTROL_MODE_START_STOP: ControlModeStartStopIcon,
  START_POINT: StartRouteIcon,
  END_POINT: EndRouteIcon,
};

const getClassName = (sourceType: EventDataSourceType) => {
  if (
    [
      'START_POINT',
      'END_POINT',
      'SENSOR_MOVING_STOPPED',
      'SENSOR_POWER_MODE_ENGINE',
      'SENSOR_COMPARTMENT_1_OFF',
      'SENSOR_COMPARTMENT_2_OFF',
      'SENSOR_COMPARTMENT_3_OFF',
      'SENSOR_COMPARTMENT_1_ON',
      'SENSOR_COMPARTMENT_2_ON',
      'SENSOR_COMPARTMENT_3_ON',
    ].includes(sourceType)
  ) {
    return 'filledStrokeIcon';
  }

  return 'filledIcon';
};

export const EventIcon = ({ sourceType }: { sourceType: EventDataSourceType }) => {
  const Icon: FC<SvgIconProps> | undefined = sourceType && EVENT_ICONS[sourceType];

  if (!Icon) {
    return <span />;
  }

  const className = getClassName(sourceType);

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Icon style={{ fontSize: 20 }} className={className} />
    </Box>
  );
};
