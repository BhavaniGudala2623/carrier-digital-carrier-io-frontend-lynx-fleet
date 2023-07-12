import { Chip } from '@carrier-io/fds-react';

import { ElectricAssetParams } from '../../../../types';

export const PowerModeRenderer = ({ data }: ElectricAssetParams) => {
  const powerMode = data?.battery?.powerMode ?? undefined;

  if (!powerMode) {
    return null;
  }

  return <Chip label={powerMode} color="primary" size="small" lightBackground />;
};
