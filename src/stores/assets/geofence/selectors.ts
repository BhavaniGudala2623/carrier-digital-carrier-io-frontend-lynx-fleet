import type { AppState } from '../../store';

export const selectGeofencesState = (state: AppState) => state.geofences;
