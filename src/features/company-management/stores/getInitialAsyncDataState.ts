import { AsyncCallStatus, AsyncDataState } from './types';

export const getInitialAsyncDataState = <T>(): AsyncDataState<T> => ({
  value: null,
  status: AsyncCallStatus.IDLE,
  error: null,
});
