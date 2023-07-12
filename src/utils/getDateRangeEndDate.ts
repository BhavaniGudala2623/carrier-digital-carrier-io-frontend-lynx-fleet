export function getDateRangeEndDate(source: Date | number | string): Date {
  const date = new Date(source);
  date.setSeconds(59, 999);

  return date;
}
