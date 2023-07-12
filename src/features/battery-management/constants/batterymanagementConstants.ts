import { BatteryMetrics } from '@carrier-io/lynx-fleet-types';

import { AllAndRecentFilter, IBatteryNotificationSortItem, TwoOrMoreArray } from '../types';

export const SortItemsConfig: TwoOrMoreArray<IBatteryNotificationSortItem> = [
  { name: 'Most Recent', value: 'RECENT' },
  { name: 'Asset Name', value: 'ASSET' },
  { name: 'Priority', value: 'PRIORITY' },
];

export const recentlyOnlineAllButtonsConfig = [
  {
    id: AllAndRecentFilter.ALL,
    value: 'All',
  },
  {
    id: AllAndRecentFilter.RECENTLY_ONLINE,
    value: 'Recently Online',
  },
];

export const batteryNotificationsSliceLimit = 5;
export const defaultFiltersCountData: BatteryMetrics = {
  online: 0,
  offline: 0,
  shutDown: 0,
  charging: 0,
  inUse: 0,
  lowBattery: 0,
  normalBattery: 0,
  highBattery: 0,
  noPower: 0,
  rebalance: 0,
  highTemperature: 0,
  lowTemperature: 0,
  totalBatteryCount: 0,
};

export const BATTERY_STATUS_NO_POWER = 'No Power';
export const BATTERY_STATUS_NO_DATA = 'No Data';

export const BATTERY_STATUS_CHARGING_AXLE = 'Charging (Axle)';
export const BATTERY_STATUS_CHARGING_GRID = 'Charging (Grid)';
export const BATTERY_STATUS_INACTIVE = 'Inactive';
export const BATTERY_STATUS_IN_USE = 'In Use';

export const TEN_MINUTES = 10;
export const THIRTY_MINUTES = 30;
export const SIXTY_MINUTES = 60;
export const FIVE_HOURS_IN_MINUTES = 300;

export const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;
export const ROWS_LIMIT = 50;

export const notificationsTimePeriodFilter = [
  {
    id: 'DAYS1',
    value: '24h',
  },
  {
    id: 'DAYS7',
    value: '7d',
  },
  {
    id: 'DAYS30',
    value: '30d',
  },
];
export const SOC_GRAPH_NORMAL_INUSE_COLOR = '#E59000';
