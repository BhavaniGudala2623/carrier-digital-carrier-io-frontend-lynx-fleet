import Box from '@carrier-io/fds-react/Box';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';
import { ValueFormatterParams } from '@ag-grid-community/core';

import { useStyles } from '../components/styles';
import { EnrichedEventData } from '../types';

import { formatDate } from '@/utils';

interface Options {
  dateFormat: DateFormatType;
  timezone?: Maybe<string>;
}

export const DateTimeRenderer = (
  params: ValueFormatterParams<EnrichedEventData, number> & {
    options: Options;
  }
) => {
  const { value, options } = params;
  const { dateFormat, timezone } = options;
  const classes = useStyles();

  const date = formatDate(value, dateFormat, { timezone, dateOptions: { variant: 'date' } });
  const time = formatDate(value, dateFormat, {
    timezone,
    dateOptions: { variant: 'time', hideSeconds: true },
  });

  return (
    <Box display="flex" flexDirection="column" justifyContent="start" height="40px">
      <div className={classes.topCellElement}>{time}</div>
      <div className={classes.bottomElement}>{date}</div>
    </Box>
  );
};
