import Typography from '@carrier-io/fds-react/Typography';

import { NOT_INSTALLED, SensorValueFormatterTypeParamsProps, SensorValueType } from '../../../types';

type SensorValueFormatterOptionsType = {
  translate: (val: string) => string;
};

export const SensorValueFormatter = (
  params: SensorValueFormatterTypeParamsProps,
  options: SensorValueFormatterOptionsType
) => {
  const {
    data: { sensorValue },
  } = params;

  const { translate } = options;

  const getSensorDisplayValue = (value: SensorValueType): string => {
    if (value === null) {
      return ' ';
    }

    if (value === NOT_INSTALLED) {
      return '-';
    }

    return value.toString();
  };

  return <Typography variant="body1">{translate(getSensorDisplayValue(sensorValue))}</Typography>;
};
