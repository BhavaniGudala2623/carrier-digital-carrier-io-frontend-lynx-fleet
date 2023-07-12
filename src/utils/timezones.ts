import { formatInTimeZone, getTimezoneOffset } from 'date-fns-tz';

import { timeZonesList } from './timezonesList';

import { DEFAULT_TIMEZONE } from '@/constants';

export const getLocalTimezoneGMT = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getTimezoneGMT = (timezone: string) =>
  `${timezone} (${formatInTimeZone(new Date(), timezone, 'zzz')})`;

export const getLocalTimezone = () => {
  const intlTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const offset = getTimezoneOffset(intlTimezone) / (1000 * 60 * 60); // offset in hours

  return timeZonesList.find((item) => item.offset === offset)?.value ?? DEFAULT_TIMEZONE;
};
