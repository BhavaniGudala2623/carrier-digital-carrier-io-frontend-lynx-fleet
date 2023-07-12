import { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from 'react-redux';
import { GeofenceGroup, UpdateGeofenceGroupInput, GeofenceGroupColor } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { GeofenceGroupFormData } from '../types';
import { DeleteGeofenceGroupDialog } from '../DeleteDialog';
import { removeGeofenceLayer } from '../../../map/mapGeofences';
import { useMap } from '../../../map';
import { getAbstractColorName } from '../../../../utils';

import { View } from './View';

import { updateGeofenceGroupAction } from '@/stores/assets/geofenceGroup/actions';
import { useToggle } from '@/hooks/useToggle';
import { useAppSelector } from '@/stores/hooks/useAppSelector';
import { useAppDispatch } from '@/stores/hooks/useAppDispatch';

interface EditGeofenceGroupProps {
  open: boolean;
  group?: GeofenceGroup;
  onClose: () => void;
}

export function EditGeofenceGroup({ open, onClose, group }: EditGeofenceGroupProps) {
  const { map } = useMap();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { geofenceGroups } = useAppSelector(
    (state) => ({
      geofenceGroups: state.geofenceGroups,
    }),
    shallowEqual
  );

  const {
    value: openDeleteGeofenceGroupDialog,
    toggleOn: handleOpenDeleteGeofenceGroupDialog,
    toggleOff: handleCloseDeleteGeofenceGroupDialog,
  } = useToggle(false);

  const onCloseDeleteGeofenceGroupDialog = useCallback(
    (groupToRemove) => {
      handleCloseDeleteGeofenceGroupDialog();

      if (groupToRemove) {
        removeGeofenceLayer(map, groupToRemove.groupId);
        onClose();
      }
    },
    [handleCloseDeleteGeofenceGroupDialog, map, onClose]
  );

  const usedGroupColors: GeofenceGroupColor[] = useMemo(
    () => geofenceGroups.entities?.map((currentGroup) => getAbstractColorName(currentGroup.color)) || [],
    [geofenceGroups.entities]
  );

  const usedGroupNames = useMemo(
    () => geofenceGroups.entities?.map((currentGroup) => currentGroup.name) || [],
    [geofenceGroups.entities]
  );

  const { values, errors, handleChange, handleSubmit, resetForm } = useFormik<GeofenceGroupFormData>({
    onSubmit: (submitValues) => {
      if (group) {
        const payload: UpdateGeofenceGroupInput = {
          groupId: group.groupId,
          ...submitValues,
        };
        setLoading(true);
        dispatch(updateGeofenceGroupAction(payload))
          .then(() => {
            setLoading(false);
            onClose();
            resetForm();
          })
          .catch(() => {
            setLoading(false);
          });
      }
    },
    enableReinitialize: true,
    initialValues: {
      name: group?.name || '',
      color: group?.color ? getAbstractColorName(group.color) : undefined,
    },
    validate: (validationValues) => {
      const validationErrors = {} as Record<string, string>;

      if (!validationValues.name) {
        validationErrors.name = t('geofences.group.error.name-required');
      }

      if (
        group?.name !== validationValues.name &&
        usedGroupNames.find((value) => value?.toLowerCase() === validationValues.name?.toLowerCase())
      ) {
        validationErrors.name = t('geofences.geofence-group-name-hint');
      }

      if (!validationValues.color) {
        validationErrors.color = t('geofences.group.error.color-required');
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
    <>
      <View
        mode="EDIT"
        values={values}
        errors={errors}
        usedGroupColors={usedGroupColors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleDelete={handleOpenDeleteGeofenceGroupDialog}
        open={open}
        onClose={handleCancel}
        isLoading={loading}
        currentColor={group?.color && getAbstractColorName(group.color)}
      />
      {openDeleteGeofenceGroupDialog && (
        <DeleteGeofenceGroupDialog group={group} onClose={onCloseDeleteGeofenceGroupDialog} />
      )}
    </>
  );
}
