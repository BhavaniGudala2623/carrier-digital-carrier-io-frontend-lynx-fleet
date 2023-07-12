import { GeofenceGroup } from '@carrier-io/lynx-fleet-types';
import { GeofenceService } from '@carrier-io/lynx-fleet-data-lib';

import { geofenceGroupsSlice } from '../slice';

import { fetchAllRecords } from '@/utils/fetchAllRecords';
import type { AppDispatch } from '@/stores/store';

const { actions } = geofenceGroupsSlice;

export const fetchGeofenceGroups =
  (request, isUpdateCurrent?: boolean, filters?: string[]) => async (dispatch: AppDispatch) => {
    if (!isUpdateCurrent) {
      dispatch(actions.startCall({}));
    }

    try {
      const entities = await fetchAllRecords<GeofenceGroup>(GeofenceService.getGeofenceGroups);

      if (!request.isCancelled) {
        const sessionFilters = JSON.parse(sessionStorage.getItem('geofenceGroupsFilters') || '[]');

        return dispatch(
          actions.geofenceGroupsFetched({
            entities,
            filters: isUpdateCurrent && !!filters ? filters : sessionFilters,
          })
        );
      }

      return null;
    } catch (error) {
      return dispatch(actions.catchError({ error }));
    }
  };
