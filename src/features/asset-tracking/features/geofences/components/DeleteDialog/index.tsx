import { useCallback, useState } from 'react';
import { Geofence } from '@carrier-io/lynx-fleet-types';

import { useMap } from '../../../map';

import { DeleteGeofenceConfirmationDialogView } from './View';

import { useAppDispatch } from '@/stores/hooks/useAppDispatch';
import { deleteGeofenceAction } from '@/stores/assets/geofence/actions';

interface DeleteGeofenceConfirmationDialogProps {
  geofenceData?: Geofence;
  onClose: () => void;
}

export function DeleteGeofenceConfirmationDialog({
  geofenceData,
  onClose,
}: DeleteGeofenceConfirmationDialogProps) {
  const { draw } = useMap();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOk = useCallback(() => {
    setLoading(true);
    dispatch(
      deleteGeofenceAction({
        geofenceId: geofenceData?.geofenceId || '',
      })
    )
      .then(() => {
        if (draw) {
          const selected = draw.getSelected();
          if (selected?.features[0]?.id) {
            draw.delete(selected.features[0].id as string);
          }
        }
        setLoading(false);
        onClose();
      })
      .catch(() => {
        setLoading(false);
      });
  }, [draw, dispatch, geofenceData, onClose]);

  return (
    <DeleteGeofenceConfirmationDialogView
      loading={loading}
      open
      handleCancel={handleCancel}
      handleOk={handleOk}
    />
  );
}
