import { GeofencePageItem } from '@carrier-io/lynx-fleet-types';
import { GeofenceService } from '@carrier-io/lynx-fleet-data-lib';

import { geofencesSlice } from '../slice';

import { fetchAllRecords } from '@/utils';
import type { AppDispatch } from '@/stores';

const { actions } = geofencesSlice;

export const fetchGeofences = (request, isUpdateCurrent?: boolean) => async (dispatch: AppDispatch) => {
  if (!isUpdateCurrent) {
    dispatch(actions.startCall({}));
  }

  try {
    const entities = await fetchAllRecords<GeofencePageItem>(GeofenceService.getGeofences);

    if (!request.isCancelled) {
      return dispatch(
        actions.geofencesFetched({
          entities,
        })
      );
    }
  } catch (error) {
    dispatch(actions.catchError({ error }));
  }

  return undefined;
};
