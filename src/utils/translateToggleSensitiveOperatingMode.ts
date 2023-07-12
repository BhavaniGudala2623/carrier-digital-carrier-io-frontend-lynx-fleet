import { TFunction } from 'i18next';
import { ProcessCellForExportParams } from '@ag-grid-community/core';

import { translateOperatingMode } from '@/utils/translateOperatingMode';

export const translateToggleSensitiveOperatingMode = (
  t: TFunction,
  compNum: 2 | 3,
  { node, value }: ProcessCellForExportParams
) => {
  const compartmentConfig = node?.data?.device?.compartmentConfig;

  if (!compartmentConfig?.[`comp${compNum}Configured`]) {
    return '';
  }

  return translateOperatingMode(t, value);
};
