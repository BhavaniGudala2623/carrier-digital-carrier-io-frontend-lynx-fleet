import { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from 'react-redux';
import { CreateGeofenceInput, GeofencePolygon } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { CreateGeofenceFormData } from '../types';
import { CreateGeofenceGroup } from '../../../geofenceGroups/components/CreateDialog/Create';
import { getAbstractColorName } from '../../../../utils';

import { View } from './View';

import { createGeofenceAction } from '@/stores/assets/geofence/actions';
import { useToggle } from '@/hooks';
import { useAppSelector } from '@/stores/hooks/useAppSelector';
import { useAppDispatch } from '@/stores/hooks/useAppDispatch';

interface CreateGeofenceDialogProps {
  currentPolygon: GeofencePolygon;
  onCancel: () => void;
  onClose: () => void;
}

export const CreateGeofenceDialog = ({ currentPolygon, onCancel, onClose }: CreateGeofenceDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const {
    value: openCreateGeofenceGroupDialog,
    toggleOn: handleOpenCreateGeofenceGroupDialog,
    toggleOff: handleCloseCreateGeofenceGroupDialog,
  } = useToggle(false);

  const { geofenceGroups } = useAppSelector(
    (state) => ({
      geofenceGroups: state.geofenceGroups,
    }),
    shallowEqual
  );

  const { values, errors, handleChange, handleSubmit, resetForm, setFieldValue, setErrors } =
    useFormik<CreateGeofenceFormData>({
      onSubmit: ({ groupId, ...restValues }) => {
        let payload: CreateGeofenceInput = {
          polygon: currentPolygon,
          ...restValues,
        };
        if (groupId) {
          payload = {
            ...payload,
            groupId,
          };
        }
        setLoading(true);
        dispatch(createGeofenceAction(payload))
          .then(() => {
            setLoading(false);
            onClose();
            resetForm();
          })
          .catch((err) => {
            setLoading(false);

            if (err.message === 'geofence_with_such_name_already_exists') {
              setErrors({ name: t('error.duplicate-name-not-allowed') });
            }
          });
      },
      enableReinitialize: true,
      initialValues: {
        name: '',
        description: '',
        groupId: '',
      },
      validate: (validationValues) => {
        const validationErrors = {} as Record<string, string>;

        if (!validationValues.name) {
          validationErrors.name = t('geofences.error.name-required');
        }

        if (!validationValues.description) {
          validationErrors.description = t('geofences.error.description-required');
        }

        return validationErrors;
      },
      validateOnChange: false,
      validateOnBlur: false,
    });

  const onCloseCreateGeofenceGroupDialog = useCallback(
    (group) => {
      if (group) {
        setFieldValue('groupId', group.groupId, false);
      }

      handleCloseCreateGeofenceGroupDialog();
    },
    [handleCloseCreateGeofenceGroupDialog, setFieldValue]
  );

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

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
        mode="CREATE"
      />
      {openCreateGeofenceGroupDialog && <CreateGeofenceGroup onClose={onCloseCreateGeofenceGroupDialog} />}
    </>
  );
};
