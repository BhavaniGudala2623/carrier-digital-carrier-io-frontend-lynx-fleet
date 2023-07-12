import { Maybe } from '@carrier-io/lynx-fleet-types';

import type { SnapshotDataEx } from '@/features/common';

interface FlattenParams {
  data?: Maybe<SnapshotDataEx>;
  value: unknown;
}

export function truBatteryVoltageFormatter(props: FlattenParams): string {
  const { value, data } = props;

  const freezerControlMode = data?.flespiData?.freezer_control_mode;

  if (freezerControlMode === 'AT52') {
    return Number(24).toFixed(1); // hardcoded as requested in LYNXFLT-3555
  }

  if (value === null || value === undefined) {
    return '';
  }

  let valueAsNumber: number | undefined;

  if (typeof value === 'string') {
    valueAsNumber = parseFloat(value);
  } else if (typeof value === 'number') {
    valueAsNumber = value;
  }

  if (valueAsNumber === undefined || Number.isNaN(valueAsNumber)) {
    return '';
  }

  return valueAsNumber.toString();
}
