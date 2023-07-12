import { parseISO } from 'date-fns';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { formatDate, FormatDateOptions } from '@/utils';

export function timestampFormatter(
  cellContent: string,
  dateFormat: DateFormatType,
  options: FormatDateOptions
) {
  return cellContent ? formatDate(parseISO(cellContent), dateFormat, options) : cellContent;
}
