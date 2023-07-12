import { createSlice } from '@reduxjs/toolkit';
import {
  BatteryMetrics,
  GetBatteryNotificationsWidget,
  GetBatterySOC,
  NotificationCriticalityFilter,
  NotificationSortBy,
  NotificationTimePeriodFilter,
} from '@carrier-io/lynx-fleet-types/dist/common/battery';

import {
  BatteryManagementState,
  BatteryManagementTabs,
  AllAndRecentFilter,
  BatteryFilterTypes,
  BatteryAPIError,
  DateRangeFilter,
} from '../../types';

const initialState: BatteryManagementState = {
  selectedTab: BatteryManagementTabs.OverviewTabView,
  electricAssets: {
    electricAssetsSelectedFilter: '',
    electricAssetsFiltersData: null,
    electricAssetsTable: { error: null, isError: false, isLoading: true },
  },
  overview: {
    recentlyOnlineAndAllFilter: AllAndRecentFilter.ALL,
    stateOfChargeState: { data: null, error: null, isError: false, isLoading: true },
    batteryNotificationsWidgetSort: 'RECENT',
    batteryNotificationsWidget: { data: null, error: null, isError: false, isLoading: true },
    batteryNotificationsWidgetTimePeriodFilter: 'DAYS1',
    batteryNotificationsWidgetCriticalityFilter: {
      action: true,
      attention: true,
    },
  },
  batteryNotificationListDateRange: {
    startDate: '',
    endDate: '',
  },
};

export const batteryManagementSlice = createSlice({
  name: 'batteryManagement',
  initialState,
  reducers: {
    updateSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    resetStore: () => ({ ...initialState }),
    updateMultiSwitchRecentlyOnline: (
      state,
      action: {
        payload: AllAndRecentFilter;
        type: string;
      }
    ) => {
      state.overview.recentlyOnlineAndAllFilter = action.payload;
    },
    updateTimePeriodMultiSwitch: (
      state,
      action: {
        payload: NotificationTimePeriodFilter;
        type: string;
      }
    ) => {
      state.overview.batteryNotificationsWidgetTimePeriodFilter = action.payload;
    },
    updateNotificationWidgetCriticalityFilter: (
      state,
      action: {
        payload: NotificationCriticalityFilter;
        type: string;
      }
    ) => {
      state.overview.batteryNotificationsWidgetCriticalityFilter = action.payload;
    },
    updateElectricAssetsFiltersData: (
      state,
      action: {
        payload: BatteryMetrics;
        type: string;
      }
    ) => {
      const electricAssetState = state.electricAssets;
      electricAssetState.electricAssetsFiltersData = action?.payload;
    },
    updateElectricAssetsSelectedFilter: (
      state,
      action: {
        payload: BatteryFilterTypes | '';
        type: string;
      }
    ) => {
      const electricAssetState = state.electricAssets;
      electricAssetState.electricAssetsSelectedFilter = action?.payload;
    },
    electricAssetsFetching: (state) => {
      const electricAssetState = state.electricAssets;
      electricAssetState.electricAssetsTable.isLoading = true;
      electricAssetState.electricAssetsTable.error = null;
      electricAssetState.electricAssetsTable.isError = false;
    },
    electricAssetsSuccess: (state) => {
      const electricAssetState = state.electricAssets;
      electricAssetState.electricAssetsTable.isLoading = false;
      electricAssetState.electricAssetsTable.error = null;
      electricAssetState.electricAssetsTable.isError = false;
    },
    electricAssetsError: (
      state,
      action: {
        payload: BatteryAPIError;
        type: string;
      }
    ) => {
      const electricAssetState = state.electricAssets;
      electricAssetState.electricAssetsTable.isLoading = false;
      electricAssetState.electricAssetsTable.error = action.payload;
      electricAssetState.electricAssetsTable.isError = true;
    },
    stateOfChargeFetching: (state) => {
      const { stateOfChargeState } = state.overview;
      stateOfChargeState.isLoading = true;
      stateOfChargeState.isError = false;
      stateOfChargeState.data = null;
      stateOfChargeState.error = null;
    },
    stateOfChargeSuccess: (
      state,
      action: {
        payload: GetBatterySOC;
        type: string;
      }
    ) => {
      const { stateOfChargeState } = state.overview;
      stateOfChargeState.data = action?.payload;
      stateOfChargeState.isLoading = false;
      stateOfChargeState.isError = false;
      stateOfChargeState.error = null;
    },
    stateOfChargeError: (
      state,
      action: {
        payload: BatteryAPIError;
        type: string;
      }
    ) => {
      const { stateOfChargeState } = state.overview;
      stateOfChargeState.data = null;
      stateOfChargeState.error = action.payload;
      stateOfChargeState.isError = true;
      stateOfChargeState.isLoading = false;
    },
    updateBatteryNotificationsWidgetSort: (
      state,
      action: {
        payload: NotificationSortBy;
        type: string;
      }
    ) => {
      state.overview.batteryNotificationsWidgetSort = action.payload;
    },
    batteryNotificationsWidgetFetching: (state) => {
      const { batteryNotificationsWidget } = state.overview;
      batteryNotificationsWidget.isLoading = true;
      batteryNotificationsWidget.isError = false;
      batteryNotificationsWidget.data = null;
      batteryNotificationsWidget.error = null;
    },
    batteryNotificationsWidgetSuccess: (
      state,
      action: {
        payload: GetBatteryNotificationsWidget;
        type: string;
      }
    ) => {
      const { batteryNotificationsWidget } = state.overview;
      batteryNotificationsWidget.data = action?.payload;
      batteryNotificationsWidget.isLoading = false;
      batteryNotificationsWidget.isError = false;
      batteryNotificationsWidget.error = null;
    },
    batteryNotificationsWidgetError: (
      state,
      action: {
        payload: BatteryAPIError;
        type: string;
      }
    ) => {
      const { batteryNotificationsWidget } = state.overview;
      batteryNotificationsWidget.data = null;
      batteryNotificationsWidget.error = action.payload;
      batteryNotificationsWidget.isError = true;
      batteryNotificationsWidget.isLoading = false;
    },
    setNotificationslistDateRange: (state, action: { payload: DateRangeFilter; type: string }) => {
      const { batteryNotificationListDateRange } = state;
      const { startDate = '', endDate = '' } = action.payload;
      batteryNotificationListDateRange.startDate = startDate;
      batteryNotificationListDateRange.endDate = endDate;
    },
  },
});
