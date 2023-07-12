import { DeleteGeofenceGroupArgs } from '@carrier-io/lynx-fleet-types';
import i18n from 'i18next';
import { GeofenceService } from '@carrier-io/lynx-fleet-data-lib';

import { geofencesSlice } from '../../geofence/slice';
import { geofenceGroupsSlice } from '../slice';

import { showError, showMessage } from '@/stores/actions';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { AppDispatch } from '@/stores/store';

const { actions } = geofenceGroupsSlice;
const { actions: geofenceActions } = geofencesSlice;

export const deleteGeofenceGroupAction = (payload: DeleteGeofenceGroupArgs) => (dispatch: AppDispatch) =>
  GeofenceService.deleteGeofenceGroup(payload)
    .then(({ data }) => {
      if (!data?.deleteGeofenceGroup.success) {
        throw new Error(data?.deleteGeofenceGroup.error);
      }

      if (payload.mode === 'MOVE_GEOFENCES_TO_UNGROUPED') {
        dispatch(geofenceActions.moveGeofencesToUnassigned({ groupId: payload.groupId }));
        showMessage(dispatch, i18n.t('geofences.group.deleted-geofences-moved') as string);
      } else {
        dispatch(geofenceActions.removeGeofencesByGroup({ groupId: payload.groupId }));
        showMessage(dispatch, i18n.t('geofences.group.deleted') as string);
      }

      return dispatch(
        actions.geofenceGroupRemoved({
          group: data?.deleteGeofenceGroup.doc,
        })
      );
    })
    .catch((error) => {
      showError(dispatch, getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    });
