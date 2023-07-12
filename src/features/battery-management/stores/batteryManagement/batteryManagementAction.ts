import { BatteryService } from '@carrier-io/lynx-fleet-data-lib/dist/services';
import {
  BatteryMetrics,
  GetBatteryNotificationsWidgetResponse,
  GetSocForBatteriesResponse,
  NotificationCriticalityFilter,
  NotificationSortBy,
  NotificationTimePeriodFilter,
  SOCCompanyFilter,
} from '@carrier-io/lynx-fleet-types/dist/common/battery';
import { ApolloQueryResult } from '@apollo/client/core/types';

import { BatteryManagementTabs, AllAndRecentFilter, BatteryFilterTypes, DateRangeFilter } from '../../types';
import { SOC_WIDGET_QUICK_FILTERS } from '../../components/StateOfChargeWidget/constants';
import { batteryNotificationsSliceLimit } from '../../constants';

import { batteryManagementSlice } from './batteryManagementSlice';

import { AppDispatch } from '@/stores';
import { showError } from '@/stores/actions';

const { actions } = batteryManagementSlice;

export const updateSelectedTab = (
  dispatch: AppDispatch,
  selectedTab: BatteryManagementTabs,
  filter?: string
) => {
  if (filter) {
    let filterType: BatteryFilterTypes | '' = '';
    switch (SOC_WIDGET_QUICK_FILTERS[filter]) {
      case BatteryFilterTypes.LOW_BATTERY:
        filterType = BatteryFilterTypes.LOW_BATTERY;
        break;
      case BatteryFilterTypes.HIGH_BATTERY:
        filterType = BatteryFilterTypes.HIGH_BATTERY;
        break;
      case BatteryFilterTypes.NORMAL_BATTERY:
        filterType = BatteryFilterTypes.NORMAL_BATTERY;
        break;
      default:
        break;
    }
    dispatch(actions.updateSelectedTab(selectedTab));
    dispatch(actions.updateElectricAssetsSelectedFilter(filterType));
  } else {
    dispatch(actions.updateSelectedTab(selectedTab));
  }
};

export const resetStore = (dispatch: AppDispatch) => {
  dispatch(actions.resetStore());
};

// Electric Assets Tab Actions
export const updateElectricAssetsFiltersData = (dispatch: AppDispatch, filtersCountData: BatteryMetrics) => {
  dispatch(actions.updateElectricAssetsFiltersData(filtersCountData));
};

export const updateSelectedFilter = (dispatch: AppDispatch, filter: BatteryFilterTypes | '') => {
  dispatch(actions.updateElectricAssetsSelectedFilter(filter));
};

export const electricAssetsFetching = (dispatch: AppDispatch) => {
  dispatch(actions.electricAssetsFetching());
};

export const electricAssetsError = (dispatch: AppDispatch, error: string | null | object) => {
  dispatch(actions.electricAssetsError(error));
};

export const electricAssetsSuccess = (dispatch: AppDispatch) => {
  dispatch(actions.electricAssetsSuccess());
};

// Overview Tab Actions
export const updateMultiSwitchRecentlyOnline = (dispatch: AppDispatch, value: AllAndRecentFilter) => {
  dispatch(actions.updateMultiSwitchRecentlyOnline(value));
};

export const updateTimePeriodMultiSwitch = (dispatch: AppDispatch, value: NotificationTimePeriodFilter) => {
  dispatch(actions.updateTimePeriodMultiSwitch(value));
};

export const updateNotificationWidgetCriticalityFilter = (
  dispatch: AppDispatch,
  value: NotificationCriticalityFilter
) => {
  dispatch(actions.updateNotificationWidgetCriticalityFilter(value));
};

export const setBatteryNotificationsListDateRange = (dispatch: AppDispatch, dateRange: DateRangeFilter) => {
  dispatch(actions.setNotificationslistDateRange(dateRange));
};
export const getStateOfChargeAction = (
  dispatch: AppDispatch,
  socFilterType: AllAndRecentFilter,
  allCompanyFilter: SOCCompanyFilter,
  errorMessage: string
) => {
  dispatch(actions.stateOfChargeFetching());

  BatteryService.getSocForBatteries({ socFilterType, companyFilter: allCompanyFilter })
    .then((data: ApolloQueryResult<GetSocForBatteriesResponse>) => {
      if (data.error) {
        throw data.error;
      }
      dispatch(actions.stateOfChargeSuccess(data.data.getSocForBatteries));
    })
    .catch(() => {
      dispatch(actions.stateOfChargeError(errorMessage));
      showError(dispatch, errorMessage);
    });
};

export const getBatteryNotificationsWidgetAction = (
  dispatch: AppDispatch,
  companyFilter: SOCCompanyFilter,
  errorMessage: string,
  criticality: NotificationCriticalityFilter,
  sortBy: NotificationSortBy = 'RECENT',
  timePeriod: NotificationTimePeriodFilter = 'DAYS1'
) => {
  dispatch(actions.batteryNotificationsWidgetFetching());

  BatteryService.getBatteryNotificationsForDashboardWidget({
    companyFilter,
    sortBy,
    timePeriod,
    criticality,
    limit: batteryNotificationsSliceLimit,
  })
    .then((data: ApolloQueryResult<GetBatteryNotificationsWidgetResponse>) => {
      if (data.error) {
        throw data.error;
      }
      dispatch(actions.batteryNotificationsWidgetSuccess(data.data.getBatteryNotificationsWidget));
    })
    .catch(() => {
      dispatch(actions.batteryNotificationsWidgetError(errorMessage));
      showError(dispatch, errorMessage);
    });
};

export const updateBatteryNotificationsWidgetSort = (dispatch: AppDispatch, value: NotificationSortBy) => {
  dispatch(actions.updateBatteryNotificationsWidgetSort(value));
};
