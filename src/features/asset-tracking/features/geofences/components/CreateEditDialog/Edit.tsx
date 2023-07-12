import { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from 'react-redux';
import { UpdateGeofenceInput, Geofence } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { CreateGeofenceFormData } from '../types';
import { CreateGeofenceGroup } from '../../../geofenceGroups/components/CreateDialog/Create';
import { createGeofenceLayer } from '../../../map/mapGeofences';
import { useMap } from '../../../map';
import { getAbstractColorName } from '../../../../utils';

import { View } from './View';

import { updateGeofenceAction } from '@/stores/assets/geofence/actions';
import { useToggle } from '@/hooks/useToggle';
import { useAppSelector } from '@/stores/hooks/useAppSelector';
import { useAppDispatch } from '@/stores/hooks/useAppDispatch';

interface EditGeofenceDialogProps {
  onClose: () => void;
  geofenceData?: Geofence;
}

export const EditGeofenceDialog = ({ onClose, geofenceData }: EditGeofenceDialogProps) => {
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
    value: openCreateGeofenceGroupDialog,
    toggleOn: handleOpenCreateGeofenceGroupDialog,
    toggleOff: handleCloseCreateGeofenceGroupDialog,
  } = useToggle(false);

  const { values, errors, handleChange, handleSubmit, resetForm, setFieldValue, setErrors } =
    useFormik<CreateGeofenceFormData>({
      onSubmit: ({ groupId, ...restValues }) => {
        if (geofenceData) {
          let payload: UpdateGeofenceInput = {
            geofenceId: geofenceData.geofenceId,
            ...restValues,
          };
          if (groupId) {
            payload = {
              ...payload,
              groupId,
            };
          }
          setLoading(true);
          dispatch(updateGeofenceAction(payload))
            .then(() => {
              setLoading(false);
              onClose();
            })
            .catch((err) => {
              setLoading(false);
              if (err.message === 'geofence_with_such_name_already_exists') {
                setErrors({ name: t('error.duplicate-name-not-allowed') });
              }
            });
        }
      },
      enableReinitialize: true,
      initialValues: {
        name: geofenceData?.name || '',
        description: geofenceData?.description || '',
        groupId: geofenceData?.groupId || '',
      },
      validate: (validateValues) => {
        const validationErrors = {} as Record<string, string>;

        if (!validateValues.name) {
          validationErrors.name = t('geofences.error.name-required');
        }

        if (!validateValues.description) {
          validationErrors.description = t('geofences.error.description-required');
        }

        return validationErrors;
      },
      validateOnChange: false,
      validateOnBlur: false,
    });

  const onCloseCreateGeofenceGroupDialog = useCallback(
    (group) => {
      if (group && map) {
        createGeofenceLayer(map, group.groupId, group.color);
        setFieldValue('groupId', group.groupId, false);
      }

      handleCloseCreateGeofenceGroupDialog();
    },
    [handleCloseCreateGeofenceGroupDialog, map, setFieldValue]
  );

  const handleCancel = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const groups = useMemo(
    () =>
      geofenceGroups.entities?.map((group) => ({
        id: group.groupId,
        name: group.name,
        color: getAbstractColorName(group.color),
      })) || [],
    [geofenceGroups.entities]
  );

  return (
    <>
      <View
        values={values}
        errors={errors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCreateGroupClick={handleOpenCreateGeofenceGroupDialog}
        open
        onClose={handleCancel}
        isLoading={loading}
        groups={groups}
        mode="EDIT"
      />
      {openCreateGeofenceGroupDialog && <CreateGeofenceGroup onClose={onCloseCreateGeofenceGroupDialog} />}
    </>
  );
};
