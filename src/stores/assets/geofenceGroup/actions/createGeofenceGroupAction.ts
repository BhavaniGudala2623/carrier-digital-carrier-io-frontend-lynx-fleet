import { CreateGeofenceGroupInput } from '@carrier-io/lynx-fleet-types';
import i18n from 'i18next';
import { GeofenceService } from '@carrier-io/lynx-fleet-data-lib';

import { geofenceGroupsSlice } from '../slice';

import { showError, showMessage } from '@/stores/actions';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { AppDispatch } from '@/stores/store';

const { actions } = geofenceGroupsSlice;

export const createGeofenceGroupAction = (payload: CreateGeofenceGroupInput) => (dispatch: AppDispatch) =>
  GeofenceService.createGeofenceGroup({
    doc: payload,
  })
    .then(({ data }) => {
      if (!data?.createGeofenceGroup.success) {
        throw new Error(data?.createGeofenceGroup.error);
      }

      showMessage(dispatch, i18n.t('geofences.group.created') as string);

      return dispatch(
        actions.geofenceGroupCreated({
          group: data?.createGeofenceGroup.doc,
        })
      );
    })
    .catch((error) => {
      showError(dispatch, getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    });
