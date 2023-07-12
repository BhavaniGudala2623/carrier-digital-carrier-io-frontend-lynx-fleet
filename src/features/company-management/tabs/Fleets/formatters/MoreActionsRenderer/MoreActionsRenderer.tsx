import { AssetsTableParams } from '../../../common/types';
import { isAssetPopulatedRow } from '../../../../utils';

import { AssetActionsPopover } from './AssetActionsPopover';
import { FleetActionsPopover } from './FleetActionsPopover';

interface MoreActionsRendererProps<T> extends AssetsTableParams<T> {
  permissions: {
    editAssetAllowed: boolean;
    editFleetAllowed: boolean;
    deleteAssetAllowed: boolean;
    deleteFleetAllowed: boolean;
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
        deleteAssetAllowed={permissions.deleteAssetAllowed}
        showIncompleteFeatures={false}
      />
    );
  }

  if (permissions.editFleetAllowed || permissions.deleteFleetAllowed) {
    return (
      <FleetActionsPopover
        editFleetAllowed={permissions.editFleetAllowed}
        deleteFleetAllowed={permissions.deleteFleetAllowed}
        fleetRow={data}
      />
    );
  }

  return <span />;
};
