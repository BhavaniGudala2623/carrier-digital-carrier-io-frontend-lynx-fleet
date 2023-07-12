import { NotificationRuleCondition } from '@carrier-io/lynx-fleet-types';

import {
  isDoorEvent,
  isGeofenceEvent,
  isTemperatureDeviationEvent,
  isTruAlarmEvent,
  isFuelLevelEvent,
  isBatteryLevelEvent,
  isSetpointChangeEvent,
  isAssetOfflineEvent,
} from '../../../utils';
import {
  DoorEventView,
  TemperatureDeviationEventView,
  GeofenceEventView,
  AlarmEventView,
  FuelLevelEventView,
  BatteryLevelEventView,
  SetpointEventView,
} from '../../EventViews';
import { AssetOfflineEventView } from '../../EventViews/AssetOffline';

import { useApplicationContext } from '@/providers/ApplicationContext';

interface EventManagerProps {
  event: NotificationRuleCondition;
  showIcon?: boolean;
}

export const EventViewMapper = ({ event, showIcon = true }: EventManagerProps) => {
  const { featureFlags } = useApplicationContext();
  const isFeatureFuelLevelEnabled = featureFlags.REACT_APP_FEATURE_FUEL_LEVEL;
  const isFeatureBatteryLevelEnabled = featureFlags.REACT_APP_FEATURE_BATTERY_LEVEL;
  const isAssetOfflineEnabled = featureFlags.REACT_APP_FEATURE_ASSET_OFFLINE;

  return (
    <>
      {isDoorEvent(event.type, event.expression) && (
        <DoorEventView expression={event.expression} showIcon={showIcon} />
      )}
      {isTemperatureDeviationEvent(event.type, event.expression) && (
        <TemperatureDeviationEventView expression={event.expression} showIcon={showIcon} type={event.type} />
      )}
      {isGeofenceEvent(event.type, event.expression) && (
        <GeofenceEventView expression={event.expression} showIcon={showIcon} />
      )}
      {isTruAlarmEvent(event.type, event.expression) && (
        <AlarmEventView expression={event.expression} showIcon={showIcon} />
      )}
      {isFuelLevelEvent(event.type, event.expression) && isFeatureFuelLevelEnabled && (
        <FuelLevelEventView expression={event.expression} showIcon={showIcon} />
      )}
      {isBatteryLevelEvent(event.type, event.expression) && isFeatureBatteryLevelEnabled && (
        <BatteryLevelEventView expression={event.expression} showIcon={showIcon} />
      )}
      {isSetpointChangeEvent(event.type, event.expression) && (
        <SetpointEventView expression={event.expression} showIcon={showIcon} />
      )}
      {isAssetOfflineEvent(event.type, event.expression) && isAssetOfflineEnabled && (
        <AssetOfflineEventView showIcon={showIcon} />
      )}
    </>
  );
};
