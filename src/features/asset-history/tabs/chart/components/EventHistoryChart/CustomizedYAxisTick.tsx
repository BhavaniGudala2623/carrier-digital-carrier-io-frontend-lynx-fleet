import { Text } from 'recharts';

import { defAxisTextStyles } from '../defAxisTextStyles';

interface ICustomizedYAxisTickProps {
  temperatureSetting?: string;
  payload?: {
    value: number;
  };
}

export const CustomizedYAxisTick = (axisTickProps: ICustomizedYAxisTickProps) => {
  const { payload, temperatureSetting } = axisTickProps;

  const displayText = `${payload?.value ? payload.value : ''} °${temperatureSetting ?? 'C'}`;

  return (
    <Text {...defAxisTextStyles} {...axisTickProps}>
      {displayText}
    </Text>
  );
};
