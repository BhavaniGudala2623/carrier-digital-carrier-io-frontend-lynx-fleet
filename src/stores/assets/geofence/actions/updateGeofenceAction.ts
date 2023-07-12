import { UpdateGeofenceInput } from '@carrier-io/lynx-fleet-types';
import i18n from 'i18next';
import { GeofenceService } from '@carrier-io/lynx-fleet-data-lib';

import { geofencesSlice } from '../slice';

import { getErrorMessage } from '@/utils/getErrorMessage';
import { showError, showMessage } from '@/stores/actions';
import type { AppDispatch } from '@/stores';

const { actions } = geofencesSlice;

export const updateGeofenceAction = (payload: UpdateGeofenceInput) => (dispatch: AppDispatch) =>
  GeofenceService.updateGeofence({
    doc: payload,
  })
    .then(({ data }) => {
      if (!data?.updateGeofence.success) {
        throw new Error(data?.updateGeofence.error);
      }

      showMessage(dispatch, i18n.t('geofences.updated') as string);

      return dispatch(
        actions.geofenceUpdated({
          geofence: data?.updateGeofence.doc,
        })
      );
    })
    .catch((error) => {
      if (error.message !== 'geofence_with_such_name_already_exists') {
        showError(dispatch, getErrorMessage(error));
      }
      throw new Error(getErrorMessage(error));
    });
