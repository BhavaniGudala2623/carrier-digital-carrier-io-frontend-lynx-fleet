import { DeleteGeofenceArgs } from '@carrier-io/lynx-fleet-types';
import i18n from 'i18next';
import { GeofenceService } from '@carrier-io/lynx-fleet-data-lib';

import { geofencesSlice } from '../slice';

import { getErrorMessage } from '@/utils/getErrorMessage';
import { showError, showMessage } from '@/stores/actions';
import type { AppDispatch } from '@/stores';

const { actions } = geofencesSlice;

export const deleteGeofenceAction = (payload: DeleteGeofenceArgs) => (dispatch: AppDispatch) =>
  GeofenceService.deleteGeofence(payload)
    .then(({ data }) => {
      if (!data?.deleteGeofence.success) {
        throw new Error(data?.deleteGeofence.error);
      }

      showMessage(dispatch, i18n.t('geofences.deleted') as string);

      return dispatch(
        actions.geofenceRemoved({
          geofence: data?.deleteGeofence.doc,
        })
      );
    })
    .catch((error) => {
      showError(dispatch, getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    });
