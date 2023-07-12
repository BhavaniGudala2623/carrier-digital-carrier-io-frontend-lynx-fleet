import { CreateGeofenceInput } from '@carrier-io/lynx-fleet-types';
import i18n from 'i18next';
import { GeofenceService } from '@carrier-io/lynx-fleet-data-lib';

import { geofencesSlice } from '../slice';

import { getErrorMessage } from '@/utils/getErrorMessage';
import { showError, showMessage } from '@/stores/actions';
import type { AppDispatch } from '@/stores';

const { actions } = geofencesSlice;

export const createGeofenceAction = (payload: CreateGeofenceInput) => (dispatch: AppDispatch) =>
  GeofenceService.createGeofence({
    doc: payload,
  })
    .then(({ data }) => {
      if (!data?.createGeofence.success) {
        throw new Error(data?.createGeofence.error);
      }

      showMessage(dispatch, i18n.t('geofences.created') as string);

      return dispatch(
        actions.geofenceCreated({
          geofence: data?.createGeofence.doc,
        })
      );
    })
    .catch((error) => {
      if (error.message !== 'geofence_with_such_name_already_exists') {
        showError(dispatch, getErrorMessage(error));
      }
      throw new Error(getErrorMessage(error));
    });
