import { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from 'react-redux';
import { CreateGeofenceGroupInput, GeofenceGroup, GeofenceGroupColor } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { GeofenceGroupFormData } from '../types';
import { getAbstractColorName } from '../../../../utils';

import { View } from './View';

import { createGeofenceGroupAction } from '@/stores/assets/geofenceGroup/actions';
import { useAppSelector } from '@/stores/hooks/useAppSelector';
import { useAppDispatch } from '@/stores/hooks/useAppDispatch';

interface CreateGeofenceGroupProps {
  onClose: (group?: GeofenceGroup) => void;
}

export function CreateGeofenceGroup({ onClose }: CreateGeofenceGroupProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { geofenceGroups } = useAppSelector(
    (state) => ({
      geofenceGroups: state.geofenceGroups,
    }),
    shallowEqual
  );

  const usedGroupColors: GeofenceGroupColor[] = useMemo(
    () => geofenceGroups.entities?.map((group) => getAbstractColorName(group.color)) || [],
    [geofenceGroups.entities]
  );

  const usedGroupNames = useMemo(
    () => geofenceGroups.entities?.map((group) => group.name) || [],
    [geofenceGroups.entities]
  );

  const { values, errors, handleChange, handleSubmit, resetForm } = useFormik<GeofenceGroupFormData>({
    onSubmit: (submitValues) => {
      const payload: CreateGeofenceGroupInput = {
        ...submitValues,
      };
      setLoading(true);
      dispatch(createGeofenceGroupAction(payload))
        .then(({ payload: createGroupPayload }) => {
          setLoading(false);
          onClose(createGroupPayload.group);
          resetForm();
        })
        .catch(() => {
          setLoading(false);
        });
    },
    enableReinitialize: true,
    initialValues: {
      name: '',
      color: undefined,
    },
    validate: (validationValues) => {
      const validationErrors = {} as Record<string, string>;

      if (!validationValues.name) {
        validationErrors.name = t('geofences.group.error.name-required');
      }

      if (usedGroupNames.find((value) => value?.toLowerCase() === validationValues.name?.toLowerCase())) {
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
    <View
      mode="CREATE"
      values={values}
      errors={errors}
      usedGroupColors={usedGroupColors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      open
      onClose={handleCancel}
      isLoading={loading}
    />
  );
}
