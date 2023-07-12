import { subDays, addMinutes } from 'date-fns';

export function getDateRangeStartDateByEndDate(endDate: Date | number | string, subDaysAmount: number): Date {
  const startDate = new Date(endDate);
  startDate.setSeconds(0, 0);

  return addMinutes(subDays(startDate, subDaysAmount), 1);
}
