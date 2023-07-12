import { FC } from 'react';
import { SvgIconProps } from '@carrier-io/fds-react';
import { NotificationRuleConditionType } from '@carrier-io/lynx-fleet-types';

import { AlarmIcon, FuelIcon, BatteryIcon } from '../components/icons';
import { AssetOfflineIcon } from '../components/icons/AssetOfflineIcon';

import { PolygonIcon } from '@/icons';
import { DoorIcon, TemperatureIcon } from '@/components';

export const NOTIFICATION_EVENT_MENU_ITEMS: Record<
  NotificationRuleConditionType,
  { title: string; icon: FC<SvgIconProps> }
> = {
  TEMPERATURE_DEVIATION: {
    title: 'notifications.temperature-deviation-setpoint',
    icon: TemperatureIcon,
  },
  TEMPERATURE_DEVIATION_FIXED_VALUE: {
    title: 'notifications.temperature-deviation-fixed-value',
    icon: TemperatureIcon,
  },
  DOOR: {
    title: 'notifications.door',
    icon: DoorIcon,
  },
  GEOFENCE: {
    title: 'geofences.geofence',
    icon: PolygonIcon,
  },
  FREEZER_MODE: {
    title: '',
    icon: PolygonIcon,
  },
  TRU_STATUS: {
    title: '',
    icon: PolygonIcon,
  },
  TRU_ALARM: {
    title: 'notifications.tru-alarms',
    icon: AlarmIcon,
  },
  FUEL_LEVEL: {
    title: 'notifications.fuel-level',
    icon: FuelIcon,
  },
  ASSET_OFFLINE: {
    title: 'notifications.asset-offline-dialog-title',
    icon: AssetOfflineIcon,
  },
  BATTERY_LEVEL: {
    title: 'notifications.battery-level',
    icon: BatteryIcon,
  },
  SETPOINT_CHANGE: {
    title: 'notifications.setpoint-change',
    icon: TemperatureIcon,
  },
};
