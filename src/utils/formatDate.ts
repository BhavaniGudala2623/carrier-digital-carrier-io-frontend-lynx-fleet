import { DateFormatType, DateOptions, getDateFormat } from '@carrier-io/lynx-fleet-common';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { format, utcToZonedTime } from 'date-fns-tz';

export interface FormatDateOptions {
  dateOptions?: DateOptions;
  timezone?: Maybe<string>;
  fallbackPlaceholder?: string;
}

export function formatDate(
  date: Date | string | number | null | undefined,
  dateFormat: DateFormatType,
  options?: FormatDateOptions
) {
  const { dateOptions, timezone, fallbackPlaceholder = '-' } = options ?? {};

  if (!date) {
    return fallbackPlaceholder;
  }

  try {
    let value = typeof date === 'string' ? new Date(date) : date;
    value = timezone ? utcToZonedTime(value, timezone) : value;

    return format(value, getDateFormat(dateFormat, dateOptions));
  } catch {
    return fallbackPlaceholder;
  }
}

export const formatUtcTimeStamp = (originalTimeStamp: string, timeStamp: string) => {
  const datePortion = originalTimeStamp.split('T');
  const desiredTime = timeStamp;

  return `${datePortion[0]}T${desiredTime}`;
};
