import { NotificationRuleConditionType } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

export const translateNotificationRuleConditionType = (
  t: TFunction,
  source: NotificationRuleConditionType | undefined
): string => {
  switch (source) {
    // case 'ACTIVE_ALARM':
    //   return t('notifications.active-alarm');

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
    case 'ASSET_OFFLINE':
      return t('notifications.asset-offline');

    default:
      return `${source}`;
  }
};
