import { AppState } from '@/stores';

export const selectDeviceProvisionState = (state: AppState) => state.deviceProvision;
export const getDeviceInfo = (state) => state.deviceInfo;
