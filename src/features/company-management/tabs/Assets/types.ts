import { Maybe } from '@carrier-io/lynx-fleet-types';

import { OptionItem, OptionItemDescription } from '@/types';

export type MoveAssetsState = {
  assetIds: string[];
  targetTenant: Maybe<OptionItem>;
  sourceTenant: Maybe<OptionItemDescription>;
};
