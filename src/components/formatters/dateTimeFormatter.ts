import type { Maybe } from '@carrier-io/lynx-fleet-types';
import { utcToZonedTime } from 'date-fns-tz';
import { DateFormatType, DateOptions } from '@carrier-io/lynx-fleet-common';

import { formatDate } from '@/utils';

interface ExtraData {
  timestampFormat?: 'seconds' | 'milliseconds';
  dateFormat: DateFormatType;
  timezone?: Maybe<string>;
  dateOptions?: DateOptions;
}

export const dateTimeFormatter = (cellContent: Maybe<string | number | undefined>, extraData: ExtraData) => {
  if (cellContent) {
    const numberContent = Number(cellContent);
    const timeFormat = extraData.timestampFormat || 'milliseconds';
    const multiplier = timeFormat === 'seconds' ? 1000 : 1;
    let date: Date;

    if (extraData.timezone) {
      const stringToParse = cellContent.toString().slice(-1) === 'Z' ? cellContent : `${cellContent}Z`;
      date = utcToZonedTime(
        Number.isNaN(numberContent) ? Date.parse(stringToParse.toString()) : numberContent * multiplier,
        extraData.timezone
      );
    } else {
      date = Number.isNaN(numberContent)
        ? new Date(Date.parse(cellContent.toString()))
        : new Date(numberContent * multiplier);
    }

    return formatDate(date, extraData.dateFormat, { dateOptions: extraData.dateOptions });
  }

  return '';
};
