import { AssetsTableParams } from '../../../common/types';
import { isAssetPopulatedRow } from '../../../../utils';

import { AssetActionsPopover } from './AssetActionsPopover';

interface MoreActionsRendererProps<T> extends AssetsTableParams<T> {
  permissions: {
    editAssetAllowed: boolean;
    deleteAssetAllowed: boolean;
  };
}

export const MoreActionsRenderer = <
  T extends { __typename: string; id: string; name: string; tenantId?: string }
>({
  data,
  permissions,
}: MoreActionsRendererProps<T>) => {
  const isRowOfAssetType = isAssetPopulatedRow<T>(data);

  if (!data) {
    return null;
  }

  if (isRowOfAssetType && (permissions.editAssetAllowed || permissions.deleteAssetAllowed)) {
    return (
      <AssetActionsPopover
        assetRow={data}
        editAssetAllowed={permissions.editAssetAllowed}
        showIncompleteFeatures={false}
      />
    );
  }

  return <span />;
};
