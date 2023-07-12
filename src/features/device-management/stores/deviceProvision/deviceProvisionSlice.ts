import { createSlice } from '@reduxjs/toolkit';

interface DeviceProvisionState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  associationErrors: any[];
  updatedDevicesCount?: number;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedRows: any[];
}

const initialState: DeviceProvisionState = {
  associationErrors: [],
  updatedDevicesCount: undefined,
  isLoading: false,
  error: null,
  parsedRows: [],
};

export const deviceProvisionSlice = createSlice({
  name: 'deviceProvision',
  initialState,
  reducers: {
    catchError: (state, action) => ({
      ...state,
      error: `${action.type}: ${action.payload.error}`,
      isLoading: false,
    }),
    startCall: (state) => ({
      ...state,
      error: null,
      isLoading: true,
    }),
    endCall: (state) => ({
      ...state,
      isLoading: false,
      error: null,
    }),
    setAssociationErrors: (state, action) => {
      let associationErrors = [];
      let updatedDevicesCount;
      if (action.payload !== null) {
        associationErrors = action.payload.filter((columns) => !!columns.device);
        const commonErrors = action.payload.filter((columns) => !columns.device);
        updatedDevicesCount = commonErrors.length ? 0 : state.parsedRows.length - associationErrors.length;
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        associationErrors,
        updatedDevicesCount,
      };
    },
    setParsedRows: (state, action) => ({
      ...state,
      isLoading: false,
      error: null,
      parsedRows: action.payload,
    }),
    clear: (state) => ({
      ...state,
      ...initialState,
    }),
  },
});
