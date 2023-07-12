import { useState } from 'react';
import { DateRange as DateRangeType } from '@carrier-io/fds-react/DateTime/DateRangePicker';

import { MS_PER_DAY } from '@/constants';

export const useDateRange = (initRange?: DateRangeType<Date>) => {
  const [dateRange, setDateRange] = useState<DateRangeType<Date>>(() => {
    if (initRange) {
      return initRange;
    }

    const endDate = new Date();
    endDate.setHours(23, 59, 59);
    const startDate = new Date(endDate.getTime() - MS_PER_DAY);
    startDate.setHours(0, 0, 0, 0);

    return [startDate, endDate];
  });

  const handleDateRangeChange = ([startDate, endDate]: DateRangeType<Date>) => {
    const newStartDateMs = Math.max(startDate?.getTime() ?? 0, 0);
    const newEndDateMs = Math.max(endDate?.getTime() ?? 0, 0);

    if (newStartDateMs < newEndDateMs) {
      setDateRange([startDate, endDate]);
    }

    if (startDate === null && endDate === null) {
      setDateRange([startDate, endDate]);
    }
  };

  const handleDateRangeChangeReport = (newDateRange: DateRangeType<Date>) => {
    setDateRange(newDateRange);
  };

  return {
    dateRange,
    handleDateRangeChange,
    handleDateRangeChangeReport,
  };
};
