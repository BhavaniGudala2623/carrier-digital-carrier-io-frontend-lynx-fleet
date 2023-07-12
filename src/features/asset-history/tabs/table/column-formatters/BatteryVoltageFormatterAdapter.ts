import { FreezerControlType } from '@carrier-io/lynx-fleet-types';

import { truBatteryVoltageFormatter } from '@/components';

interface FlattenParams {
  data?: Record<string, string | number>; // flatten snapshot data
  value: unknown;
}

export function BatteryVoltageFormatterAdapter(props: FlattenParams): string {
  return truBatteryVoltageFormatter({
    ...props,
    data: {
      ...props.data,
      flespiData: {
        freezer_control_mode: props.data?.['flespiData.freezer_control_mode'] as FreezerControlType,
      },
    },
  });
}
