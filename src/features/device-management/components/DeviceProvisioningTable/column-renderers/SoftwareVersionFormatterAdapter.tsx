import { FreezerControlType, PopulatedDevice } from '@carrier-io/lynx-fleet-types';

import { truSoftwareVersionFormatter } from '@/components';

interface FlattenParams {
  data?: PopulatedDevice;
  value: unknown;
}

export function SoftwareVersionFormatterAdapter(props: FlattenParams): string {
  return truSoftwareVersionFormatter({
    ...props,
    data: {
      flespiData: {
        freezer_control_mode: props.data?.snapshot?.freezer_control_mode as FreezerControlType,
        freezer_trs_protocol_version: props.data?.snapshot?.freezer_trs_protocol_version as string,
      },
    },
  });
}
