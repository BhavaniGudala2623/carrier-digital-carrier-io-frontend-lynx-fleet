import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { DeleteFleetConfirmationDialog } from '../components/DeleteFleetConfirmationDialog';
import { useDeleteFleet } from '../hooks';

interface DeleteConfirmationDialogContainerProps {
  onClose: () => void;
  fleetId: string;
}

export const DeleteFleetConfirmationDialogContainer = ({
  onClose,
  fleetId,
}: DeleteConfirmationDialogContainerProps) => {
  const { data, loading: isAssetDataLoading } = AssetService.useGetAssetsRow(
    {
      for: {
        id: fleetId,
        type: 'FLEET',
      },
    },
    {
      fetchPolicy: 'network-only',
    }
  );

  const { deleteFleet, isDeleting } = useDeleteFleet(onClose);

  const handleRemove = async () => {
    await deleteFleet(fleetId);
  };

  return (
    <DeleteFleetConfirmationDialog
      loading={isDeleting || isAssetDataLoading}
      assetsCount={data?.getAssets.totalItems ?? 0}
      onClose={onClose}
      handleRemove={handleRemove}
    />
  );
};
