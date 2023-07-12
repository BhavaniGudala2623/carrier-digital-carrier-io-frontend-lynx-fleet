import { DateRange as DateRangeType } from '@carrier-io/fds-react/DateTime/DateRangePicker';

import { convertNotificationData } from '../utils';

import { AppState } from '@/stores';

export const selectConvertedNotifications = (state: AppState, dateRange: DateRangeType<Date>) =>
  convertNotificationData(state.notifications.entities, dateRange);
