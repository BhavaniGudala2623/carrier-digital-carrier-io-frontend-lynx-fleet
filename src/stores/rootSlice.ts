import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

import { SnackbarAlert } from '@/types';

interface RootState {
  extLoading: boolean;
  alerts: SnackbarAlert[];
}

const initialState: RootState = {
  extLoading: false,
  alerts: [],
};

export const rootSlice = createSlice<RootState, SliceCaseReducers<RootState>>({
  name: 'root',
  initialState,
  reducers: {
    setExtLoading: (state, action: PayloadAction<boolean>) => {
      state.extLoading = action.payload;
    },
    messageShow: (state, action: PayloadAction<SnackbarAlert>) => {
      state.alerts = [action.payload, ...state.alerts];
    },
    messageHidden: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    },
  },
});
