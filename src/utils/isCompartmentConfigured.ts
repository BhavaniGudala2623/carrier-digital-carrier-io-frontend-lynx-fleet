import { FlespiData, Maybe } from '@carrier-io/lynx-fleet-types';
import { isNil } from 'lodash-es';

export function isCompartmentConfigured(
  compartmentNo: 1 | 2 | 3,
  flespiData: Maybe<FlespiData> | undefined
): boolean {
  return (
    !isNil(flespiData?.[`freezer_comp${compartmentNo}_mode`]) ||
    !isNil(flespiData?.[`freezer_zone${compartmentNo}_temperature_setpoint`])
  );
}
