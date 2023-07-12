import { createSlice } from '@reduxjs/toolkit';
import { ConfigTaskStatus, Maybe } from '@carrier-io/lynx-fleet-types';

import { CONFIGURATION_STATUS_PENDING } from '../../constants';

import { checkAndUpdateTaskStatusAction, updateDeviceConfigAction } from './deviceInfoSliceExtraReducers';

export interface DeviceInfoState {
  isLoading: boolean;
  error: unknown | null;
  configStatus: Maybe<ConfigTaskStatus>;
  configTask: Maybe<ConfigTaskStatus>;
  firmwareTask: Maybe<ConfigTaskStatus>;
}

const initialState: DeviceInfoState = {
  isLoading: false,
  error: null,
  configStatus: { status: undefined },
  configTask: {},
  firmwareTask: {},
};

export const deviceInfoSlice = createSlice({
  name: 'deviceInfo',
  initialState,
  reducers: {
    saveDeviceRequest: (state) => {
      state.isLoading = true;
    },
    saveDeviceSuccess: (state) => {
      state.isLoading = false;
    },
    catchError: (state, action) => {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    setConfigTaskStatus: (state, action) => {
      state.error = null;
      state.configStatus = action.payload ?? {};
      state.isLoading = false;
    },
    setConfig: (state, action) => {
      state.configTask = action.payload ?? {};
    },
    setFirmware: (state, action) => {
      state.firmwareTask = action.payload ?? {};
    },
    clear: (state) => ({
      ...state,
      ...initialState,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(checkAndUpdateTaskStatusAction.fulfilled, (state, { payload }) => {
      const { configTaskStatus, firmwareTask, configTask } = payload ?? {};
      state.configStatus = configTaskStatus ?? {};
      state.firmwareTask = firmwareTask ?? {};
      state.configTask = configTask ?? {};
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(checkAndUpdateTaskStatusAction.rejected, (state, action) => {
      state.error = action.payload ?? action?.error;
      state.isLoading = false;
    });
    builder.addCase(checkAndUpdateTaskStatusAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateDeviceConfigAction.fulfilled, (state, { payload }) => {
      const { configTaskStatus, firmwareTask, configTask } = payload ?? {};
      state.configStatus = configTaskStatus ?? {};
      state.firmwareTask = firmwareTask ?? {};
      state.configTask = configTask ?? {};
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateDeviceConfigAction.rejected, (state, action) => {
      state.error = action.payload ?? action?.error;
      state.isLoading = false;
    });
    builder.addCase(updateDeviceConfigAction.pending, (state) => {
      state.isLoading = true;
      state.configStatus = { status: CONFIGURATION_STATUS_PENDING };
    });
  },
});

export const {
  saveDeviceRequest,
  saveDeviceSuccess,
  catchError,
  setConfigTaskStatus,
  clear,
  setConfig,
  setFirmware,
} = deviceInfoSlice.actions;
