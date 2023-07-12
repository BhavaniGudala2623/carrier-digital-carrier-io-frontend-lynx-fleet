import { bluetoothSensorsManagementSlice } from './bluetoothSensorsManagementSlice';

import { AppDispatch } from '@/stores';

const { actions } = bluetoothSensorsManagementSlice;

export const reloadBluetoothSensorsManagement = () => async (dispatch: AppDispatch) => {
  dispatch(actions.triggerBluetoothSensorsManagementLoading());
};

export const stopReloadBluetoothSensorsManagement = () => async (dispatch: AppDispatch) => {
  dispatch(actions.bluetoothSensorsFetched());
};
