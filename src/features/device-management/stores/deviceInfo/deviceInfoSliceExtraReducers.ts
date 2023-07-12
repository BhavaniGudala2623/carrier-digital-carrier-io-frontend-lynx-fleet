import { createAsyncThunk } from '@reduxjs/toolkit';
import { CheckTaskStatusInput, ConfigureDeviceInput } from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { TFunction } from 'i18next';

import { ApiError } from '@/features/device-management/types';
import { showMessage } from '@/stores/actions';

interface CheckTaskStatusArgs extends CheckTaskStatusInput {
  t: TFunction;
  showSuccessMessage?: boolean;
}

export const updateDeviceConfigAction = createAsyncThunk(
  'deviceInfo/updateConfig',
  async (input: ConfigureDeviceInput, thunkAPI) => {
    try {
      const response = await AssetService.updateDeviceConfig({ input });

      const deviceConfig = response?.data?.updateDeviceConfig;
      const payload = {
        configTaskStatus: deviceConfig?.device?.configTaskStatus,
        firmwareTask: deviceConfig?.device?.firmwareTask,
        configTask: deviceConfig?.device?.configTask,
      };

      return deviceConfig?.error ? thunkAPI.rejectWithValue(deviceConfig.error) : payload || {};
    } catch (error) {
      if (
        (error as ApiError).message?.includes('503') ||
        (error as ApiError).message === 'Response not successful: Received status code 500'
      ) {
        return null; // API Gateway 29 sec timeout lambda in process
      }

      return thunkAPI.rejectWithValue((error as ApiError).response?.data ?? (error as ApiError)?.message);
    }
  }
);

export const checkAndUpdateTaskStatusAction = createAsyncThunk(
  'deviceInfo/checkAndUpdateTaskStatus',
  async (args: CheckTaskStatusArgs, thunkAPI) => {
    const { t, showSuccessMessage = true, ...input } = args;

    try {
      const response = await AssetService.checkAndUpdateTaskStatus({ input });

      const taskStatus = response.data?.checkAndUpdateTaskStatus;
      const payload = {
        configTaskStatus: taskStatus?.device?.configTaskStatus,
        firmwareTask: taskStatus?.device?.firmwareTask,
        configTask: taskStatus?.device?.configTask,
      };

      if (taskStatus?.error) {
        return thunkAPI.rejectWithValue(taskStatus.error);
      }

      if (showSuccessMessage && payload?.configTaskStatus?.status === 'completed') {
        showMessage(
          thunkAPI.dispatch,
          `${t('device.management.device.commissioning.configured-successfully')}`,
          'info'
        );
      }

      return payload;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as ApiError).response.data ?? (error as ApiError)?.message);
    }
  }
);
