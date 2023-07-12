import { BatteryNotification, Maybe, NotificationSortBy } from '@carrier-io/lynx-fleet-types';

export interface ElectricAssetParams {
  value?: Maybe<string | number>;
  data: ElectricAsset;
}

export interface ElectricAsset {
  battery: ElectricAssetBattery;
}

export interface ElectricAssetBattery {
  dealId: number;
  lastSyncTime: Maybe<number | string>;
  tenantId?: string;
  tenantUserName?: string;
  deviceId?: string;
  assetId?: string;
  assetName?: string;
  truSerialNumber?: string;
  truStatus?: boolean;
  powerMode?: string;
  batteryLastSeen?: string; // last updated
  stateOfCharge?: number | string;
  chargingStatus?: string;
  lastRebalanced?: string;
  batteryTemperatureMax?: number | string;
  batteryTemperatureMin?: number | string;
  lowBatterySince?: string;
}

export enum BatteryManagementTabs {
  OverviewTabView = 0,
  ElectricAssetsTabView = 1,
  NotificationsTabView = 2,
}

export enum AllAndRecentFilter {
  RECENTLY_ONLINE = 'RECENT',
  ALL = 'ALL',
}

export enum AllCompanyFilterTypes {
  ALL = 'ALL',
  COMPANY = 'COMPANY',
  TENANT = 'TENANT',
  FLEET = 'FLEET',
}

export interface TwoOrMoreArray<T> extends Array<T> {
  0: T;
}

export interface IBatteryNotificationSortItem {
  name: string;
  value: NotificationSortBy;
}

export interface BatteryNotificationsColumnDataType {
  notification: BatteryNotification;
}

export enum BatteryNotificationsIcon {
  REBALANCE_OVERDUE = 'RebalancingOverdueIcon',
  SYSTEM_INACTIVE = 'SystenInactiveIcon',
  SYSTEM_OFFLINE = 'SystemOfflineIcon',
  LOW_TEMPERATURE = 'LowBatteryLowTemperatureIcon',
  CRTICALLY_LOW_BATTERY = 'CriticallyLowBatteryIcon',
}

// Todo: get these types from fleet types
export enum BatteryNotificationType {
  STATE_OF_CHARGE = 'state_of_charge',
  BATTERY_TEMPERATURE = 'battery_temperature',
  BATTERY_REBALANCING = 'battery_rebalancing',
  BATTERY_NO_CONNECTIVITY = 'battery_no_connectivity',
}

// Todo: get these types from fleet types
export enum BatteryNotifcationComparsion {
  LOW = 'low',
  CRTICALLY_LOW = 'critically_low',
  ABOVE = 'above',
  BELOW = 'below',
  ABOVE_OR_BELOW = 'above_or_below',
  CRITICALLY_HIGH = 'critically_high',
  HIGH = 'high',
}

export enum BatteryNotificationsColumns {
  CARD_TITLE = 'card_title',
  CARD_DETAILS = 'card_details',
  STEPS = 'steps',
  TITLE = 'title',
  DETAILS = 'details',
}

export enum BatteryFilterTypes {
  ASSET_NAME = 'assetName',
  ONLINE = 'online',
  OFFLINE = 'offline',
  SHUTDOWN = 'shutDown',
  CHARGING = 'charging',
  IN_USE = 'inUse',
  LOW_BATTERY = 'lowBattery',
  NORMAL_BATTERY = 'normalBattery',
  HIGH_BATTERY = 'highBattery',
  NO_POWER = 'noPower',
  REBALANCING = 'rebalance',
  HIGH_TEMPERATURE = 'highTemperature',
  LOW_TEMPERATURE = 'lowTemperature',
}

export type BatteryAPIError = string | null | object;

export type DateRangeFilter = {
  startDate: Maybe<string>;
  endDate: Maybe<string>;
};
