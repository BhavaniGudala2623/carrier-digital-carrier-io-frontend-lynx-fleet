import { deviceManagementSlice } from './deviceManagementSlice';

import { AppDispatch } from '@/stores';

const { actions } = deviceManagementSlice;

export const reloadDeviceManagement = () => async (dispatch: AppDispatch) => {
  dispatch(actions.triggerDeviceManagementLoading());
};

export const stopReloadDeviceManagement = () => async (dispatch: AppDispatch) => {
  dispatch(actions.deviceManagementFetched());
};
