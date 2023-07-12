import { Maybe } from '@carrier-io/lynx-fleet-types';

import type { SnapshotDataEx } from '@/features/common';

interface FlattenParams {
  data?: Maybe<SnapshotDataEx>;
  value: unknown;
}

export function runHoursFormatter(props: FlattenParams): string {
  const { value, data } = props;

  if (data?.flespiData?.freezer_control_mode === 'AT52') {
    return data?.flespiData?.freezer_switch_on_total?.toString() ?? '';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    return value;
  }

  return '';
}
