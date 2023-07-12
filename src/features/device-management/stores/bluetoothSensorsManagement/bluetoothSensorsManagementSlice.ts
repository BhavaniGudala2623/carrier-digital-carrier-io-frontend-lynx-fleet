import { createSlice } from '@reduxjs/toolkit';

import { BluetoothSensorsManagementState } from '../../types';

const initialState: BluetoothSensorsManagementState = {
  isLoading: false,
  error: null,
};

export const bluetoothSensorsManagementSlice = createSlice({
  name: 'bluetoothSensorsManagement',
  initialState,
  reducers: {
    triggerBluetoothSensorsManagementLoading: (state) => ({
      ...state,
      error: null,
      isLoading: true,
    }),
    catchError: (state, action) => ({
      ...state,
      error: action.payload.error,
      isLoading: false,
    }),
    bluetoothSensorsFetched: (state) => ({
      ...state,
      isLoading: false,
      error: null,
    }),
  },
});
