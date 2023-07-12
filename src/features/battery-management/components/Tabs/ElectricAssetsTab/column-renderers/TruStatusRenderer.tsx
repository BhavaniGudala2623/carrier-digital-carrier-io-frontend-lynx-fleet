import { Chip } from '@carrier-io/fds-react';
import { useTranslation } from 'react-i18next';

import { ElectricAssetParams } from '../../../../types';

export const TruStatusRenderer = ({ data }: ElectricAssetParams) => {
  const { t } = useTranslation();
  const truStatus = data?.battery?.truStatus ?? undefined;

  if (truStatus === undefined) {
    return null;
  }

  let color: 'primary' | 'secondary' | undefined;
  let label: string | undefined;
  if (truStatus === true) {
    color = 'primary';
    label = t('battery.management.trustatus.on');
  } else {
    color = 'secondary';
    label = t('battery.management.trustatus.off');
  }

  if (color && label) {
    return <Chip label={label} color={color} size="small" lightBackground />;
  }

  return null;
};
