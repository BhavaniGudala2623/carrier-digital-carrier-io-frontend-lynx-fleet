import {
  BatteryMetrics,
  GetBatteryNotificationsWidget,
  GetBatterySOC,
  Maybe,
  NotificationCriticalityFilter,
  NotificationSortBy,
  NotificationTimePeriodFilter,
} from '@carrier-io/lynx-fleet-types';

import {
  BatteryManagementTabs,
  AllAndRecentFilter,
  BatteryFilterTypes,
  BatteryAPIError,
} from './BatteryManagement';

export interface BatteryManagementState {
  selectedTab: BatteryManagementTabs;
  electricAssets: {
    electricAssetsFiltersData: BatteryMetrics | null;
    electricAssetsSelectedFilter: BatteryFilterTypes | '';
    electricAssetsTable: {
      isLoading: boolean;
      isError: boolean;
      error: BatteryAPIError;
    };
  };
  overview: {
    recentlyOnlineAndAllFilter: AllAndRecentFilter;
    stateOfChargeState: {
      data: Maybe<GetBatterySOC>;
      isLoading: boolean;
      isError: boolean;
      error: BatteryAPIError;
    };
    batteryNotificationsWidgetSort: NotificationSortBy;
    batteryNotificationsWidget: {
      data: Maybe<GetBatteryNotificationsWidget>;
      isLoading: boolean;
      isError: boolean;
      error: BatteryAPIError;
    };
    batteryNotificationsWidgetTimePeriodFilter: NotificationTimePeriodFilter;
    batteryNotificationsWidgetCriticalityFilter: NotificationCriticalityFilter;
  };
  batteryNotificationListDateRange: {
    startDate: Maybe<string>;
    endDate: Maybe<string>;
  };
}
