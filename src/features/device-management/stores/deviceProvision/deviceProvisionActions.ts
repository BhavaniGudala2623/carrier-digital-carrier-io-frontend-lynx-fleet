import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { CreateDeviceInput, DeviceMutationResponse } from '@carrier-io/lynx-fleet-types';

import { deviceProvisionSlice } from './deviceProvisionSlice';

import type { AppDispatch } from '@/stores';
import { getErrorMessage } from '@/utils';
import { showError, showMessage } from '@/stores/actions';

const { actions } = deviceProvisionSlice;

export const provisionDevice =
  (device: CreateDeviceInput, onSuccessMessage: string, onSuccess?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(actions.startCall());

    try {
      const response = await AssetService.provisionDevice({
        input: device,
      });
      dispatch(actions.endCall());

      if (response.data?.createDevice?.error) {
        dispatch(
          actions.catchError({
            error: response.data.createDevice.error,
          })
        );
        showError(dispatch, response.data.createDevice.error);
      } else {
        dispatch(actions.endCall());
        showMessage(dispatch, onSuccessMessage);

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      dispatch(actions.catchError({ error: getErrorMessage(error) }));
      showError(dispatch, error);
    }
  };

export const processBatchDeviceEventResults =
  (data?: DeviceMutationResponse[]) => async (dispatch: AppDispatch) => {
    let errorMessages: string[] = [];
    let results: DeviceMutationResponse[] = [];
    try {
      if (Array.isArray(data)) {
        results = data || [];
        errorMessages = results.filter((result) => result.error).map((result) => result.error as string);
      }

      if (errorMessages.length > 0) {
        dispatch(
          actions.catchError({
            error: errorMessages.join('; '),
          })
        );
      }
    } catch (error) {
      dispatch(actions.catchError({ error: getErrorMessage(error) }));
    }
  };

export const batchProvisionDevice = (device) => async (dispatch: AppDispatch) => {
  dispatch(actions.startCall());

  try {
    const response = await AssetService.batchProvisionDevice(device);
    dispatch(processBatchDeviceEventResults(response.data?.batchCreateDevice));
    dispatch(actions.endCall());
  } catch (error) {
    dispatch(actions.endCall());
    dispatch(actions.catchError({ error: getErrorMessage(error) }));
  }
};

export const batchAssociateDevice = (device) => async (dispatch: AppDispatch) => {
  dispatch(actions.startCall());

  try {
    const response = await AssetService.batchAssociateDevice(device);

    dispatch(actions.setAssociationErrors(response.data?.batchAssociateDevice));
  } catch (error) {
    dispatch(actions.catchError({ error: getErrorMessage(error) }));
  }
};

export const clearProvisionState = () => (dispatch: AppDispatch) => {
  dispatch(actions.clear());
};

export const setParsedRows = (input) => (dispatch: AppDispatch) => {
  dispatch(actions.setParsedRows(input));
};

export const startProvisionLoading = () => (dispatch: AppDispatch) => {
  dispatch(actions.startCall());
};

export const setAssociationErrors = (input) => (dispatch: AppDispatch) => {
  dispatch(actions.setAssociationErrors(input));
};
