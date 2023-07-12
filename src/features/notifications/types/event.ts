import {
  DoorExpression,
  GeofenceExpression,
  NotificationRuleCondition,
  TemperatureDeviationExpression,
  TruAlarmExpression,
} from '@carrier-io/lynx-fleet-types';

export type TemperatureDeviationComparisonType = TemperatureDeviationExpression['comparison'];

export type DoorComparisonType = DoorExpression['comparison'];

export type GeofenceComparisonType = GeofenceExpression['comparison'];

export type TruAlarmComparisonType = TruAlarmExpression['comparison'];

export type EventDialogProps = {
  handleCancel: () => void;
  handleOk: (event: NotificationRuleCondition) => void;
  expression?: NotificationRuleCondition['expression'];
  exclude?: boolean;
};

export interface EventDialogTempDeviationProps extends EventDialogProps {
  type: 'TEMPERATURE_DEVIATION' | 'TEMPERATURE_DEVIATION_FIXED_VALUE' | 'SETPOINT_CHANGE';
}

export interface EventDialogFuelProps extends EventDialogProps {
  type: 'FUEL_LEVEL';
}
export interface EventDialogBatteryProps extends EventDialogProps {
  type: 'BATTERY_LEVEL';
}
export interface EventDialogAssetOfflineProps extends EventDialogProps {
  type: 'ASSET_OFFLINE';
}
export interface EventViewProps {
  showIcon?: boolean;
}
