import type { Maybe } from '@carrier-io/lynx-fleet-types';
import { utcToZonedTime } from 'date-fns-tz';

export const dateTimeFormatterTimezone = (
  cellContent: Maybe<string | number | undefined>,
  timezone?: Maybe<string>
) => {
  if (cellContent) {
    const numberContent = Number(cellContent);
    const multiplier = 1; // milliseconds
    let date: Date;

    if (timezone) {
      const stringToParse = cellContent.toString().slice(-1) === 'Z' ? cellContent : `${cellContent}Z`;
      date = utcToZonedTime(
        Number.isNaN(numberContent) ? Date.parse(stringToParse.toString()) : numberContent * multiplier,
        timezone
      );
    } else {
      date = Number.isNaN(numberContent)
        ? new Date(Date.parse(cellContent.toString()))
        : new Date(numberContent * multiplier);
    }

    return date;
  }

  return '';
};

export function getMinutesDifference(isoDateString: string) {
  const date1 = new Date(isoDateString);
  if (!(date1 instanceof Date && !Number.isNaN(date1))) {
    return null;
  }
  const currentDateTime = new Date();
  const currentDateTimeIsoFormat = new Date(currentDateTime.toISOString());
  const diff = currentDateTimeIsoFormat.getTime() - date1.getTime();
  if (diff > 60e3) {
    return Math.floor(diff / 60e3);
  }

  return 0;
}
export function getMinutesDifferenceTimezoneBased(
  isoDateString: string,
  timezone?: Maybe<string>
): number | null {
  const formattedTimezoneDate = dateTimeFormatterTimezone(isoDateString, timezone);
  if (!(formattedTimezoneDate instanceof Date && !Number.isNaN(formattedTimezoneDate))) {
    return null;
  }

  const currentDateTime = new Date();
  const currentTimezoneDate = dateTimeFormatterTimezone(currentDateTime.toISOString(), timezone);
  if (!(currentTimezoneDate instanceof Date && !Number.isNaN(currentTimezoneDate))) {
    return null;
  }
  const dddd = currentTimezoneDate.getTime() - formattedTimezoneDate.getTime();
  if (dddd > 60e3) {
    return Math.floor(dddd / 60e3);
  }

  return 0;
}

export function getTimeByHours(hours: number) {
  switch (true) {
    case hours < 24:
      return `${hours} ${hours > 1 ? 'hours' : 'hour'}`;
    case hours < 24 * 7: {
      const days = Math.floor(hours / 24);

      return `${days} ${days > 1 ? 'days' : 'day'}`;
    }
    case hours < 24 * 30: {
      const weeks = Math.floor(hours / (24 * 7));

      return `${weeks} ${weeks > 1 ? 'weeks' : 'week'}`;
    }

    case hours < 24 * 30 * 12: {
      const months = Math.floor(hours / (24 * 30));

      return `${months} ${months > 1 ? 'months' : 'month'}`;
    }
    default: {
      const years = Math.floor(hours / (24 * 30 * 12));

      return `${years} ${years > 1 ? 'years' : 'year'}`;
    }
  }
}
