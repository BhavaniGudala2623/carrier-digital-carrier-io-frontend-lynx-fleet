import type { AppState } from '@/stores';

export const selectExtLoading = (state: AppState) => state.root.extLoading;
