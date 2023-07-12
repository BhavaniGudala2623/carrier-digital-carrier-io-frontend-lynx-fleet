import { Maybe, NotificationPageItem } from '@carrier-io/lynx-fleet-types';
import { DateRange as DateRangeType } from '@carrier-io/fds-react/DateTime/DateRangePicker';
import { startOfDay, endOfDay } from 'date-fns';

import { NotificationPageItemWithSearchFields } from '../types';

export const convertNotificationData = (
  data: Maybe<NotificationPageItemWithSearchFields[]>,
  [startDate, endDate]: DateRangeType<Date>
): Maybe<NotificationPageItem[]> => {
  if (!data) {
    return null;
  }

  const startDateTime = startDate ? startOfDay(startDate).getTime() : 0;
  const endDateTime = endDate ? endOfDay(endDate).getTime() : 0;

  return data.filter((n) => {
    if (startDateTime && endDateTime) {
      return n.updatedAtTime >= startDateTime && n.updatedAtTime <= endDateTime;
    }

    return true;
  });
};
