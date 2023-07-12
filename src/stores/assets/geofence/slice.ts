import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { Geofence, Maybe } from '@carrier-io/lynx-fleet-types';

export interface GeofencesState {
  isLoading: boolean;
  entities: Geofence[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | null;
  selectedRowId: Maybe<string>;
}

const initialGeofencesState: GeofencesState = {
  isLoading: false,
  entities: null,
  error: null,
  selectedRowId: null,
};

export const geofencesSlice = createSlice<GeofencesState, SliceCaseReducers<GeofencesState>>({
  name: 'geofences',
  initialState: initialGeofencesState,
  reducers: {
    catchError: (state, action) => ({
      ...state,
      error: `${action.type}: ${action.payload.error}`,
      isLoading: false,
    }),
    startCall: (state) => ({
      ...state,
      error: null,
      isLoading: true,
    }),
    geofencesFetched: (state, action) => {
      const { entities } = action.payload;

      return {
        ...state,
        isLoading: false,
        error: null,
        entities,
      };
    },
    geofenceCreated: (state, action) => {
      const { geofence } = action.payload;

      return {
        ...state,
        entities: [...(state?.entities || []), geofence],
      };
    },
    geofenceUpdated: (state, action) => {
      if (!state?.entities) {
        return state;
      }
      const { geofence } = action.payload;
      const geofenceToUpdateIndex = state.entities.findIndex(
        (item) => item.geofenceId === geofence.geofenceId
      );
      if (geofenceToUpdateIndex === -1) {
        return state;
      }

      return {
        ...state,
        entities: [
          ...state.entities.slice(0, geofenceToUpdateIndex),
          {
            ...state.entities[geofenceToUpdateIndex],
            ...geofence,
          },
          ...state.entities.slice(geofenceToUpdateIndex + 1),
        ],
      };
    },
    geofenceRemoved: (state, action) => {
      if (!state?.entities) {
        return state;
      }
      const { geofence } = action.payload;

      return {
        ...state,
        entities: state.entities.filter((item) => item.geofenceId !== geofence.geofenceId),
      };
    },
    moveGeofencesToUnassigned: (state, action) => {
      if (!state?.entities) {
        return state;
      }

      const { groupId } = action.payload;

      return {
        ...state,
        entities: state.entities.map((item) =>
          item.groupId === groupId
            ? {
                ...item,
                groupId: undefined,
              }
            : item
        ),
      };
    },
    removeGeofencesByGroup: (state, action) => {
      if (!state?.entities) {
        return state;
      }
      const { groupId } = action.payload;

      return {
        ...state,
        entities: state.entities.filter((item) => item.groupId !== groupId),
      };
    },
    selectGeofenceRow: (state, action) => {
      state.selectedRowId = action.payload;
    },
  },
});
