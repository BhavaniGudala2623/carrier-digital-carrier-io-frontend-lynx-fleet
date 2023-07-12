import { TemperatureType } from '@carrier-io/lynx-fleet-types';

import { toUnit } from '@/utils';

interface FlattenParams {
  value: unknown;
}

interface ExtraData {
  units: TemperatureType;
}

export function temperatureFormatter(params: FlattenParams, extraData: ExtraData): string {
  const { value } = params;
  const { units } = extraData;

  if (units && value !== undefined && value !== null) {
    return toUnit(Number(value), units).toString();
  }

  return '';
}
