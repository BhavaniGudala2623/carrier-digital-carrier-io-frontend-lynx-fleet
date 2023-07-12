import { createSlice } from '@reduxjs/toolkit';

import { DeviceManagementState } from '../../types';

const initialState: DeviceManagementState = {
  isLoading: false,
  error: null,
};

export const deviceManagementSlice = createSlice({
  name: 'deviceManagement',
  initialState,
  reducers: {
    triggerDeviceManagementLoading: (state) => ({
      ...state,
      error: null,
      isLoading: true,
    }),
    catchError: (state, action) => ({
      ...state,
      error: action.payload.error,
      isLoading: false,
    }),
    deviceManagementFetched: (state) => ({
      ...state,
      isLoading: false,
      error: null,
    }),
  },
});
