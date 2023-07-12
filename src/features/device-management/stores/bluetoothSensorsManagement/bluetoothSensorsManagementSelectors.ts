import type { AppState } from '@/stores';

export const getBluetoothSensorsLoading = (state: AppState) => state.bluetoothSensorsManagement.isLoading;
