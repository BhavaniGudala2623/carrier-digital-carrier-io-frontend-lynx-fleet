import { UpdateGeofenceGroupInput } from '@carrier-io/lynx-fleet-types';
import i18n from 'i18next';
import { GeofenceService } from '@carrier-io/lynx-fleet-data-lib';

import { geofenceGroupsSlice } from '../slice';

import { showError, showMessage } from '@/stores/actions';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { AppDispatch } from '@/stores/store';

const { actions } = geofenceGroupsSlice;

export const updateGeofenceGroupAction = (payload: UpdateGeofenceGroupInput) => (dispatch: AppDispatch) =>
  GeofenceService.updateGeofenceGroup({
    doc: payload,
  })
    .then(({ data }) => {
      if (!data?.updateGeofenceGroup.success) {
        throw new Error(data?.updateGeofenceGroup.error);
      }

      showMessage(dispatch, i18n.t('geofences.group.updated') as string);

      return dispatch(
        actions.geofenceGroupUpdated({
          group: data?.updateGeofenceGroup.doc,
        })
      );
    })
    .catch((error) => {
      showError(dispatch, getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    });
