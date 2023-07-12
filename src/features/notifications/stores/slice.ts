import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

import { NotificationsState } from '../types';

const initialState: NotificationsState = {
  isLoading: false,
  entities: null,
  error: null,
};

export const notificationsSlice = createSlice<NotificationsState, SliceCaseReducers<NotificationsState>>({
  name: 'notifications',
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
    notificationsFetched: (state, action) => {
      const { entities } = action.payload;

      return {
        ...state,
        isLoading: false,
        error: null,
        entities,
      };
    },
    notificationCreated: (state, action) => {
      const { notification } = action.payload;

      return {
        ...state,
        entities: [...(state?.entities || []), notification],
      };
    },
    notificationUpdated: (state, action) => {
      if (!state?.entities) {
        return state;
      }
      const { notification } = action.payload;
      const notificationToUpdateIndex = state.entities.findIndex(
        (item) => item.notificationId === notification.notificationId
      );
      if (notificationToUpdateIndex === -1) {
        return state;
      }

      return {
        ...state,
        entities: [
          ...state.entities.slice(0, notificationToUpdateIndex),
          {
            ...state.entities[notificationToUpdateIndex],
            ...notification,
          },
          ...state.entities.slice(notificationToUpdateIndex + 1),
        ],
      };
    },
    notificationDeleted: (state, action) => {
      if (!state?.entities) {
        return state;
      }
      const { notificationId } = action.payload;

      return {
        ...state,
        entities: state.entities.filter((item) => item.notificationId !== notificationId),
      };
    },
  },
});
