import { Maybe } from '@carrier-io/lynx-fleet-types';

import type { SnapshotDataEx } from '@/features/common';

interface FlattenParams {
  data?: Maybe<SnapshotDataEx>;
  value: unknown;
}

export function truSoftwareVersionFormatter(props: FlattenParams): string {
  const { value, data } = props;

  const freezerControlMode = data?.flespiData?.freezer_control_mode;

  if (freezerControlMode === 'AT52') {
    return data?.flespiData?.freezer_trs_protocol_version || '2.07'; // hardcoded as requested in LYNXFLT-3555
  }

  return typeof value === 'string' ? value : '';
}
