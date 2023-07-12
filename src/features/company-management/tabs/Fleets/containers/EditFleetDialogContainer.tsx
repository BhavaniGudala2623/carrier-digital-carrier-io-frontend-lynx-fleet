import { useMemo } from 'react';
import { Fleet } from '@carrier-io/lynx-fleet-types';
import { FleetService } from '@carrier-io/lynx-fleet-data-lib';

import { EditFleetDialog } from '../components';

import { useTenantAssets } from '@/features/common';

interface EditFleetDialogContainerProps {
  fleet: Pick<Fleet, 'id' | 'name'> & { tenantId?: string };
  onClose: () => void;
}

export const EditFleetDialogContainer = ({ fleet, onClose }: EditFleetDialogContainerProps) => {
  const {
    assets: assetsData,
    isAssetsLoading: assetsLoading,
    error: assetsError,
  } = useTenantAssets(fleet.tenantId);

  const {
    data: fleetData,
    loading: fleetLoading,
    error: fleetError,
  } = FleetService.useGetFleetById({ id: fleet.id }, { fetchPolicy: 'cache-and-network' });

  const selectedAssetIds = useMemo(
    () => fleetData?.getFleetById?.assets?.map(({ id }) => id).filter(Boolean) as string[],
    [fleetData?.getFleetById?.assets]
  );

  const errorMessage = (assetsError || fleetError)?.message;

  return (
    <EditFleetDialog
      assets={assetsData}
      fleet={fleet}
      selectedAssetIds={selectedAssetIds ?? []}
      isAssetsLoading={assetsLoading}
      isFleetLoading={fleetLoading}
      error={errorMessage}
      onClose={onClose}
    />
  );
};
