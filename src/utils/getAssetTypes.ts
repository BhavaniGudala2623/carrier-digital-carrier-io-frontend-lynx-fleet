import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { AssetType } from '@/types';

export const getAssetTypes = (): AssetType[] => {
  const { palette } = fleetThemeOptions;

  return [
    {
      key: 'assets.asset.table.alarm',
      color: palette.error.main,
      assetState: 'Alarm',
    },
    {
      key: 'assets.asset.table.stationary',
      color: palette.warning.main,
      assetState: 'No',
    },
    {
      key: 'assets.asset.table.moving',
      color: palette.success.main,
      assetState: 'Yes',
    },
  ];
};
