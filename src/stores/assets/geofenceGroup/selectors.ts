import type { AppState } from '../../store';

export const selectGeofenceGroupsFilters = (state: AppState) => state.geofenceGroups.filters;
