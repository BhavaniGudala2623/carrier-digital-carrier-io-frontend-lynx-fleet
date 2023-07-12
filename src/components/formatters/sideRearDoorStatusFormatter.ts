import { Maybe } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

import { doorStatusFormatter } from './doorStatusFormatter';

import type { SnapshotDataEx } from '@/features/common';

interface FlattenParams {
  data?: Maybe<SnapshotDataEx>;
  value: null | undefined | string | boolean | number;
}

type DoorType = 'sideDoor' | 'rearDoor';

export const sideRearDoorStatusFormatter = (
  params: FlattenParams,
  doorType: DoorType,
  t: TFunction
): string => {
  if (!doorType) {
    return '';
  }

  const configured =
    doorType === 'rearDoor'
      ? params.data?.device?.sensors?.rearDoorConfigured
      : params.data?.device?.sensors?.sideDoorConfigured;

  if (!configured) {
    return '-';
  }

  return doorStatusFormatter(params, t);
};
