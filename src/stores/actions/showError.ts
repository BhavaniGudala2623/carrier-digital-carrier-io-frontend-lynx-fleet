import { nanoid } from 'nanoid';
import { Dispatch } from '@reduxjs/toolkit';

import { rootSlice } from '../rootSlice';

import { getErrorMessage } from '@/utils/getErrorMessage';

export const showError = (dispatch: Dispatch, error: unknown) => {
  dispatch(
    rootSlice.actions.messageShow({
      id: nanoid(),
      message: getErrorMessage(error),
      severity: 'error',
    })
  );
};
