import { BatteryManagementTabs } from '../../types';

import type { AppState } from '@/stores';

export const getSelectedTab = (state: AppState): BatteryManagementTabs => state.batteryManagement.selectedTab;

export const getStateOfCharge = (state: AppState) =>
  state.batteryManagement.overview.stateOfChargeState.data?.stateOfCharge;

export const getTotalAssets = (state: AppState) =>
  state.batteryManagement.overview.stateOfChargeState.data?.totalItems ?? 0;

export const getStateOfChargedataIsLoading = (state: AppState) =>
  state.batteryManagement.overview.stateOfChargeState.isLoading;

export const getStateOfChargeHasError = (state: AppState) =>
  state.batteryManagement.overview.stateOfChargeState.isError;

export const getSelectedRecentlyOnlineAndAllFilter = (state: AppState) =>
  state.batteryManagement.overview.recentlyOnlineAndAllFilter;

export const getBatteryNotificationsWidgetSort = (state: AppState) =>
  state.batteryManagement.overview.batteryNotificationsWidgetSort;

export const getBatteryNotificationsWidgetTimePeriodFilter = (state: AppState) =>
  state.batteryManagement.overview.batteryNotificationsWidgetTimePeriodFilter;

export const getBatteryNotificationsWidgetCriticalityFilter = (state: AppState) =>
  state.batteryManagement.overview.batteryNotificationsWidgetCriticalityFilter;

export const getBatteryNotificationWidget = (state: AppState) =>
  state.batteryManagement.overview.batteryNotificationsWidget;

export const getSelectedFilter = (state: AppState) =>
  state.batteryManagement.electricAssets.electricAssetsSelectedFilter;

export const getElectricAssetsFiltersData = (state: AppState) =>
  state.batteryManagement.electricAssets.electricAssetsFiltersData;

export const getElectricAssetsTable = (state: AppState) =>
  state.batteryManagement.electricAssets.electricAssetsTable;

export const getBatteryNotificationListDateRange = (state: AppState) =>
  state.batteryManagement.batteryNotificationListDateRange;
