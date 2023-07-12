import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { rootSlice } from './rootSlice';
import { geofenceGroupsSlice, geofencesSlice, assetSnapshotsSlice } from './assets';

import { authSlice } from '@/features/authentication';
import { companiesSlice, companyManagementReducer } from '@/features/company-management';
import {
  deviceManagementSlice,
  deviceInfoSlice,
  deviceProvisionSlice,
  bluetoothSensorsManagementSlice,
} from '@/features/device-management';
import { notificationsSlice } from '@/features/notifications';
import { assetHistorySlice } from '@/features/asset-history';
import { batteryManagementSlice } from '@/features/battery-management';

const appReducer = combineReducers({
  assetHistory: assetHistorySlice.reducer,
  assetSnapshots: assetSnapshotsSlice.reducer,
  auth: authSlice.reducer,
  companies: companiesSlice.reducer,
  companyManagement: companyManagementReducer,
  deviceInfo: deviceInfoSlice.reducer,
  deviceManagement: deviceManagementSlice.reducer,
  bluetoothSensorsManagement: bluetoothSensorsManagementSlice.reducer,
  batteryManagement: batteryManagementSlice.reducer,
  deviceProvision: deviceProvisionSlice.reducer,
  geofenceGroups: geofenceGroupsSlice.reducer,
  geofences: geofencesSlice.reducer,
  notifications: notificationsSlice.reducer,
  root: rootSlice.reducer,
});

export const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      thunk: true,
    }),

  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
