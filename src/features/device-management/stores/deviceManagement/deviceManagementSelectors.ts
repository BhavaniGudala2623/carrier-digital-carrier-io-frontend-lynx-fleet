import type { AppState } from '@/stores';

export const getDeviceSnapshotsLoading = (state: AppState) => state.deviceManagement.isLoading;

export const getDeviceInfoState = (state: AppState) => state.deviceInfo;
