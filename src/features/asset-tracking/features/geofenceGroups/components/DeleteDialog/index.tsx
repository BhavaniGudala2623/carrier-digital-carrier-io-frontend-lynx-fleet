import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { GeofenceGroup } from '@carrier-io/lynx-fleet-types';

import { DeleteGeofenceGroupFormData } from '../types';

import { DeleteGeofenceGroupDialogView } from './View';

import { deleteGeofenceGroupAction } from '@/stores/assets/geofenceGroup/actions';
import { useAppDispatch } from '@/stores/hooks/useAppDispatch';

interface DeleteGeofenceGroupDialogProps {
  group?: GeofenceGroup;
  onClose: (group?: GeofenceGroup) => void;
}

export function DeleteGeofenceGroupDialog({ group, onClose }: DeleteGeofenceGroupDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { values, errors, handleChange, handleSubmit, resetForm } = useFormik<DeleteGeofenceGroupFormData>({
    onSubmit: (submitValues) => {
      if (group) {
        setLoading(true);
        dispatch(
          deleteGeofenceGroupAction({
            groupId: group.groupId,
            mode: submitValues.mode,
          })
        )
          .then(({ payload }) => {
            setLoading(false);
            onClose(payload.group);
            resetForm();
          })
          .catch(() => {
            setLoading(false);
          });
      }
    },
    enableReinitialize: true,
    initialValues: {
      mode: 'MOVE_GEOFENCES_TO_UNGROUPED',
    },
    validate: (validationValues) => {
      const validationErrors = {} as Record<string, string>;

      if (!validationValues.mode) {
        validationErrors.mode = t('geofences.group.error.delete-all-required');
      }

      return validationErrors;
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleCancel = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  return (
    <DeleteGeofenceGroupDialogView
      isLoading={loading}
      values={values}
      errors={errors}
      onClose={handleCancel}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
    />
  );
}
