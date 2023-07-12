import { ConfigTaskStatus } from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { DeviceCommissioningFormValues } from '../../types';
import { DeviceCommissioningContextInterface } from '../../providers';
import { getPreparedSensors } from '../../utils';

import {
  saveDeviceRequest,
  saveDeviceSuccess,
  catchError,
  setConfigTaskStatus,
  setConfig,
  setFirmware,
  clear,
} from './deviceInfoSlice';

import type { AppDispatch } from '@/stores';
import { getErrorMessage } from '@/utils';

export const setConfigStatus = (taskStatus: ConfigTaskStatus) => (dispatch: AppDispatch) => {
  dispatch(setConfigTaskStatus(taskStatus));
};

export const setConfigTask = (taskStatus: ConfigTaskStatus) => (dispatch: AppDispatch) => {
  dispatch(setConfig(taskStatus));
};

export const setFirmwareTask = (taskStatus: ConfigTaskStatus) => (dispatch: AppDispatch) => {
  dispatch(setFirmware(taskStatus));
};

export const clearState = () => (dispatch: AppDispatch) => {
  dispatch(clear());
};

export const commissionDeviceAction =
  (values: DeviceCommissioningFormValues, includeDatacoldSensors: boolean) => (dispatch: AppDispatch) => {
    const { asset, device, sensorConfiguration } = values;
    const sensors = getPreparedSensors(sensorConfiguration, includeDatacoldSensors);

    dispatch(saveDeviceRequest());

    AssetService.commissionDevice({
      input: {
        deviceId: device.id,
        name: asset.name,
        licensePlateNumber: asset.licensePlateNumber,
        notes: asset.notes,
      },
    })
      .then((response) => {
        if (response.data?.createAsset?.error) {
          dispatch(catchError({ error: response.data.createAsset.error }));

          return;
        }

        AssetService.updateDevice({
          input: {
            id: device.id,
            sensors,
            productFamily: device.productFamily,
            truControlSystemType: device.truControlSystemType,
            truModelNumber: device.truModelNumber,
            truSerialNumber: device.truSerialNumber,
          },
        })
          .then((sensorsResponse) => {
            if (sensorsResponse.data?.updateDevice?.error) {
              dispatch(catchError({ error: sensorsResponse.data?.updateDevice?.error }));

              return;
            }

            dispatch(saveDeviceSuccess());
          })
          .catch((error) => {
            dispatch(catchError({ error: error.message }));
          });
      })
      .catch((error) => {
        dispatch(catchError({ error: error.message }));
      });
  };

export const updateCommissionedDevice =
  (
    values: DeviceCommissioningFormValues,
    context: DeviceCommissioningContextInterface,
    includeDatacoldSensors: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(saveDeviceRequest());
    const { asset, device, sensorConfiguration } = values;
    const { permissions } = context;
    const { assetEditAllowed } = permissions;

    const sensors = getPreparedSensors(sensorConfiguration, includeDatacoldSensors);

    const assetId = asset.id ? asset.id : context.snapshot.asset?.id;

    if (!assetId) {
      return;
    }

    try {
      if (assetEditAllowed) {
        const response = await AssetService.updateAssetInfo({
          input: {
            id: assetId,
            notes: asset.notes,
            name: asset.name,
            licensePlateNumber: asset.licensePlateNumber,
          },
        });
        if (response.data?.updateAsset?.error) {
          dispatch(catchError({ error: response.data.updateAsset.error }));

          return;
        }
      }

      const updateDeviceResponse = await AssetService.updateDevice({
        input: {
          id: device.id,
          sensors,
          compartmentConfig: device.compartmentConfig,
          productFamily: device.productFamily,
          truControlSystemType: device.truControlSystemType,
          truModelNumber: device.truModelNumber,
          truSerialNumber: device.truSerialNumber,
        },
      });

      if (updateDeviceResponse.data?.updateDevice?.error) {
        dispatch(catchError({ error: updateDeviceResponse.data.updateDevice.error }));
      } else {
        dispatch(saveDeviceSuccess());
      }
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(catchError({ error: message }));
    }
  };
