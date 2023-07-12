import { FreezerControlType } from '@carrier-io/lynx-fleet-types';

import { truSoftwareVersionFormatter } from '@/components';

interface FlattenParams {
  data?: Record<string, string | number>; // flatten snapshot data
  value: unknown;
}

export function SoftwareVersionFormatterAdapter(props: FlattenParams): string {
  return truSoftwareVersionFormatter({
    ...props,
    data: {
      ...props.data,
      flespiData: {
        freezer_control_mode: props.data?.['flespiData.freezer_control_mode'] as FreezerControlType,
        freezer_trs_protocol_version: props.data?.['flespiData.freezer_trs_protocol_version'] as string,
      },
    },
  });
}
