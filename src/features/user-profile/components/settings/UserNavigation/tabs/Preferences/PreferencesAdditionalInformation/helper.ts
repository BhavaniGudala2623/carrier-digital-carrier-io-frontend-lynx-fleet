import { TFunction } from 'i18next';

import { MeasurementItem, MeasurementsKeys } from '@/types/preferences';
import { getMeasurements } from '@/constants/getMeasurements';

export const getNameByValue: (
  value: string | undefined,
  quantity: MeasurementsKeys,
  t: TFunction
) => string | undefined = (value, quantity, t) => {
  const measurements = getMeasurements(t);

  const measurementItem: MeasurementItem = measurements[quantity];

  if (measurementItem.metric.value === value) {
    return measurementItem.metric.name;
  }

  if (measurementItem.imperial.value === value) {
    return measurementItem.imperial.name;
  }

  return undefined;
};
