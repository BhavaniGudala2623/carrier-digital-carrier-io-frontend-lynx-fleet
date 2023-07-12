import { parseActivationDate } from '../utils';

import type { AppState } from '@/stores';

export const getAssetHistoryState = (state: AppState) => state.assetHistory;

export const getDeviceActivationDate = (state: AppState) =>
  parseActivationDate(state.assetHistory.device?.activationDate);
