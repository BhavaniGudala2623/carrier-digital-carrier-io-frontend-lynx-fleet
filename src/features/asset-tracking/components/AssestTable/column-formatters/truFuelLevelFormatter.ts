import { TFunction } from 'i18next';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { getTruFuelLevel } from '../../../utils/getTruFuelLevel';

import type { SnapshotDataEx } from '@/features/common';

export interface FlattenParams {
  data?: Maybe<SnapshotDataEx>;
}

export function truFuelLevelFormatter(props: FlattenParams, t: TFunction): string {
  const { data } = props;

  if (!data) {
    return '';
  }

  return getTruFuelLevel({
    freezerControlMode: data?.flespiData?.freezer_control_mode,
    freezerFuelLevel: data?.device?.sensors?.freezerFuelLevel,
    freezerFuelLevelConfigured: data?.device?.sensors?.freezerFuelLevelConfigured,
    pluginFuelLevel: data?.device?.sensors?.pluginFuelLevel,
    pluginFuelLevelConfigured: data?.device?.sensors?.pluginFuelLevelConfigured,
    textNotAvailable: t('asset.data.n-a'),
  });
}
