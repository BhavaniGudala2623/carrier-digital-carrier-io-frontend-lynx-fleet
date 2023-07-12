import { Text } from 'recharts';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { defAxisTextStyles } from '../defAxisTextStyles';

import { formatDate } from '@/utils';

interface ICustomizedXAxisTickProps {
  x?: number;
  dateFormat: DateFormatType;
  payload?: {
    value: number;
  };
}

export const CustomizedXAxisTick = (axisTickProps: ICustomizedXAxisTickProps) => {
  const { x = 0, payload, dateFormat } = axisTickProps;

  if (!payload) {
    return null;
  }

  const displayText = payload?.value
    ? formatDate(new Date(payload.value), dateFormat, {
        dateOptions: { variant: 'dateTime', hideYear: true, hideSeconds: true },
      })
    : '';

  // TODO: figure out how to include time if the tick interval is short enough to need it
  return (
    <Text {...defAxisTextStyles} {...axisTickProps} width={50} x={x + 3} textAnchor="start">
      {displayText}
    </Text>
  );
};
