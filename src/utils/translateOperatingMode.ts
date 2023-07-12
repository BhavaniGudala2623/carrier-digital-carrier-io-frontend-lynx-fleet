import { Maybe } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

import { CompartmentModeTypeLowercase } from '@/types';

export const translateOperatingMode = (t: TFunction, mode: Maybe<string>) => {
  if (!mode) {
    return '';
  }

  switch (mode.toLowerCase() as CompartmentModeTypeLowercase) {
    case 'compartment not enabled':
      return t('assets.asset.table.freezer-comp-mode.compartment not enabled');

    case 'cool with rh active':
      return t('assets.asset.table.freezer-comp-mode.cool with rh active');

    case 'cool':
      return t('assets.asset.table.freezer-comp-mode.cool');

    case 'defrost start/end with rh active':
      return t('assets.asset.table.freezer-comp-mode.defrost start/end with rh active');

    case 'defrost start/end':
      return t('assets.asset.table.freezer-comp-mode.defrost start/end');

    case 'defrost with rh active':
      return t('assets.asset.table.freezer-comp-mode.defrost with rh active');

    case 'defrost':
      return t('assets.asset.table.freezer-comp-mode.defrost');

    case 'heat with rh active':
      return t('assets.asset.table.freezer-comp-mode.heat with rh active');

    case 'heat':
      return t('assets.asset.table.freezer-comp-mode.heat');

    case 'idle with rh active':
      return t('assets.asset.table.freezer-comp-mode.idle with rh active');

    case 'idle':
      return t('assets.asset.table.freezer-comp-mode.idle');

    case 'null':
      return t('assets.asset.table.freezer-comp-mode.null');

    case 'off':
      return t('assets.asset.table.freezer-comp-mode.off');

    case 'off, (compartment off due to engine off)':
      return t('assets.asset.table.freezer-comp-mode.off, (compartment off due to engine off)');

    default:
      return mode;
  }
};
