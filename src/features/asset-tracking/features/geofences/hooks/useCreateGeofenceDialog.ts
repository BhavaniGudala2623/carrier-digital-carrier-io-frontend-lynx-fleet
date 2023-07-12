import { useCallback, useState } from 'react';
import { GeofencePolygon } from '@carrier-io/lynx-fleet-types';
import { Feature, Polygon } from 'geojson';

import { useMap } from '../../map';
import { getPolygon } from '../../../utils/polygon';

export function useCreateGeofenceDialog() {
  const { draw } = useMap();
  const [currentFeatureId, setCurrentFeatureId] = useState<string>('');
  const [currentPolygon, setCurrentPolygon] = useState<GeofencePolygon>([{ vertices: [] }]);
  const [openCreateGeofenceDialog, setOpenCreateGeofenceDialog] = useState(false);

  const handleOpenCreateGeofenceDialog = useCallback((polygonData?: Feature<Polygon>) => {
    if (polygonData) {
      setCurrentFeatureId((polygonData.id || '').toString());
      setCurrentPolygon(getPolygon(polygonData));
    }

    setOpenCreateGeofenceDialog(true);
  }, []);

  const handleCloseCreateGeofenceDialog = useCallback(() => {
    setOpenCreateGeofenceDialog(false);
  }, []);

  const handleCancelCreateGeofenceDialog = useCallback(() => {
    if (draw) {
      draw.delete(currentFeatureId);
    }

    handleCloseCreateGeofenceDialog();
  }, [currentFeatureId, draw, handleCloseCreateGeofenceDialog]);

  return {
    currentFeatureId,
    currentPolygon,
    openCreateGeofenceDialog,
    handleOpenCreateGeofenceDialog,
    handleCancelCreateGeofenceDialog,
    handleCloseCreateGeofenceDialog,
  };
}
