import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { GeofenceGroup, Maybe } from '@carrier-io/lynx-fleet-types';

export const UNASSIGNED_GROUP_ID = '0';

export interface GeofenceGroupsState {
  isLoading: boolean;
  entities?: Maybe<GeofenceGroup[]>;
  // todo: it is string[] in runtime
  // filters: GroupFilter[];
  filters: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: unknown;
}

const initialGeofenceGroupsState: GeofenceGroupsState = {
  isLoading: false,
  entities: null,
  error: null,
  filters: [],
};

export const geofenceGroupsSlice = createSlice<GeofenceGroupsState, SliceCaseReducers<GeofenceGroupsState>>({
  name: 'geofenceGroups',
  initialState: initialGeofenceGroupsState,
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
    geofenceGroupsFetched: (state, action) => {
      const { entities, filters } = action.payload;

      return {
        ...state,
        isLoading: false,
        error: null,
        entities,
        filters,
      };
    },
    setGeofenceGroupFilter: (state, action) => {
      const { groupid } = action.payload;

      const filterArray = [...state.filters];
      const index = filterArray.indexOf(groupid);

      // If array does not contain filter, add it. If it exists, remove it.
      if (index === -1) {
        filterArray.push(groupid);
      } else {
        filterArray.splice(index, 1);
      }

      sessionStorage.setItem('geofenceGroupsFilters', JSON.stringify(filterArray));

      return {
        ...state,
        filters: filterArray,
      };
    },
    setGeofenceGroupFilterAll: (state, action) => {
      const { newGeofenceAll } = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let filterArray: any[] = [];

      if (newGeofenceAll) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filterArray = state.entities?.map((group) => group.groupId) ?? [];
        filterArray.push(UNASSIGNED_GROUP_ID);
      }

      sessionStorage.setItem('geofenceGroupsFilters', JSON.stringify(filterArray));

      return {
        ...state,
        filters: filterArray,
      };
    },
    geofenceGroupCreated: (state, action) => {
      const { group } = action.payload;

      return {
        ...state,
        entities: [...(state?.entities || []), group],
        filters: [...(state?.filters || []), group.groupId],
      };
    },
    geofenceGroupUpdated: (state, action) => {
      if (!state?.entities) {
        return state;
      }
      const { group } = action.payload;
      const geofenceGroupToUpdateIndex = state.entities.findIndex((item) => item.groupId === group.groupId);
      if (geofenceGroupToUpdateIndex === -1) {
        return state;
      }

      return {
        ...state,
        entities: [
          ...state.entities.slice(0, geofenceGroupToUpdateIndex),
          {
            ...state.entities[geofenceGroupToUpdateIndex],
            ...group,
          },
          ...state.entities.slice(geofenceGroupToUpdateIndex + 1),
        ],
      };
    },
    geofenceGroupRemoved: (state, action) => {
      if (!state?.entities) {
        return state;
      }
      const { group } = action.payload;

      return {
        ...state,
        entities: state.entities.filter((item) => item.groupId !== group.groupId),
        filters: state.filters.filter((item) => item !== group.groupId),
      };
    },
  },
});
