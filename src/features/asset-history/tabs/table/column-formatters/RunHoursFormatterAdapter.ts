import { FreezerControlType } from '@carrier-io/lynx-fleet-types';

import { runHoursFormatter } from '@/components';

interface FlattenParams {
  data?: Record<string, number | string>;
  value: unknown;
}

export function RunHoursFormatterAdapter(props: FlattenParams): string {
  return runHoursFormatter({
    ...props,
    data: {
      ...props.data,
      flespiData: {
        freezer_control_mode: props.data?.['flespiData.freezer_control_mode'] as FreezerControlType,
        freezer_switch_on_total: props.data?.['flespiData.freezer_switch_on_total'] as number,
      },
    },
  });
}
