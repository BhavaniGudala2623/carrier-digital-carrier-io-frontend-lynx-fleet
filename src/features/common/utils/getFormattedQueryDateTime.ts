import { zonedTimeToUtc } from 'date-fns-tz';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { UserSettings } from '@/providers/UserSettings';

export const getFormattedQueryDateTime = (
  value: Maybe<Date>,
  timezone: UserSettings['timezone'],
  sec: number,
  ms?: number
) => {
  if (!value) {
    return null;
  }

  const valueFormatted = zonedTimeToUtc(value, timezone);
  valueFormatted.setSeconds(sec, ms);

  return valueFormatted.toISOString();
};
