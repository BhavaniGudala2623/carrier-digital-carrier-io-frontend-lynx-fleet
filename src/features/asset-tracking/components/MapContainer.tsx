import Box from '@carrier-io/fds-react/Box';

import { useAssetsMapEffects } from '../hooks';
import { useAssetsPageContext } from '../providers';

import { AssetDetailsDialog } from './AssetDetailsDialog';
import { MapLayersControls } from './MapLayersControls';

import { Map } from '@/components';
import type { SnapshotDataEx } from '@/features/common';

export type MapProps = {
  selectedRow?: SnapshotDataEx | null;
  onClickOpen: () => void;
  onGeofenceClick: (geofenceId: string) => void;
};

export const MapContainer = ({ selectedRow, onClickOpen, onGeofenceClick }: MapProps) => {
  const { handleCloseAssetDetails, selectedDetailsId } = useAssetsMapEffects({
    onClickOpen,
    selectedRow,
    onGeofenceClick,
  });

  const { assetDetailsDialogAssetId } = useAssetsPageContext();

  return (
    <Box height="100%" position="relative" overflow="hidden">
      <Map containerId="map" />
      <MapLayersControls />
      {(selectedDetailsId || assetDetailsDialogAssetId) && (
        <AssetDetailsDialog
          assetId={selectedDetailsId || assetDetailsDialogAssetId}
          onClose={handleCloseAssetDetails}
        />
      )}
    </Box>
  );
};
