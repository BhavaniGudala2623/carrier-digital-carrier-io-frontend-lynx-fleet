import {
  DoorExpression,
  TemperatureDeviationExpression,
  TemperatureDeviationFixedValueExpression,
  GeofenceExpression,
  FreezerModeExpression,
  TruStatusExpression,
  TruAlarmExpression,
  FuelLevelExpression,
  BatteryLevelExpression,
  NotificationRuleConditionType,
  SetpointChangeExpression,
  AssetOfflineExpression,
} from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

export type RuleExpression =
  | DoorExpression
  | TemperatureDeviationExpression
  | TemperatureDeviationFixedValueExpression
  | GeofenceExpression
  | FreezerModeExpression
  | TruStatusExpression
  | TruAlarmExpression
  | FuelLevelExpression
  | BatteryLevelExpression
  | AssetOfflineExpression
  | SetpointChangeExpression;

export function isDoorEvent(
  eventType: NotificationRuleConditionType,
  expression: RuleExpression
): expression is DoorExpression {
  return eventType === 'DOOR';
}

export function isTemperatureDeviationEvent(
  eventType: NotificationRuleConditionType,
  expression: RuleExpression
): expression is TemperatureDeviationExpression | TemperatureDeviationFixedValueExpression {
  return eventType === 'TEMPERATURE_DEVIATION' || eventType === 'TEMPERATURE_DEVIATION_FIXED_VALUE';
}

export function isGeofenceEvent(
  eventType: NotificationRuleConditionType,
  expression: RuleExpression
): expression is GeofenceExpression {
  return eventType === 'GEOFENCE';
}

export function isTruAlarmEvent(
  eventType: NotificationRuleConditionType,
  expression: RuleExpression
): expression is TruAlarmExpression {
  return eventType === 'TRU_ALARM';
}

export function isFuelLevelEvent(
  eventType: NotificationRuleConditionType,
  expression: RuleExpression
): expression is FuelLevelExpression {
  return eventType === 'FUEL_LEVEL';
}

export function isBatteryLevelEvent(
  eventType: NotificationRuleConditionType,
  expression: RuleExpression
): expression is BatteryLevelExpression {
  return eventType === 'BATTERY_LEVEL';
}
export function isAssetOfflineEvent(
  eventType: NotificationRuleConditionType,
  expression: RuleExpression
): expression is AssetOfflineExpression {
  return eventType === 'ASSET_OFFLINE';
}

export function isSetpointChangeEvent(
  eventType: NotificationRuleConditionType,
  expression: RuleExpression
): expression is SetpointChangeExpression {
  return eventType === 'SETPOINT_CHANGE';
}

export const translateNotificationRuleConditionType = (
  t: TFunction,
  source: NotificationRuleConditionType | undefined
): string => {
  switch (source) {
    case 'DOOR':
      return t('notifications.door');

    case 'GEOFENCE':
      return t('notifications.geofence');

    case 'TEMPERATURE_DEVIATION':
      return t('notifications.temperature-deviation-setpoint');

    case 'TEMPERATURE_DEVIATION_FIXED_VALUE':
      return t('notifications.temperature-deviation-fixed-value');

    case 'TRU_ALARM':
      return t('notifications.tru-alarm');

    case 'FUEL_LEVEL':
      return t('notifications.fuel-level');

    case 'BATTERY_LEVEL':
      return t('notifications.battery-level');

    case 'SETPOINT_CHANGE':
      return t('notifications.setpoint-change');

    case 'ASSET_OFFLINE':
      return t('notifications.asset-offline-dialog-title');

    default:
      return `${source}`;
  }
};
