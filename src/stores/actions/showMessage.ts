import type { AlertColor } from '@mui/material';
import { nanoid } from 'nanoid';
import { Dispatch } from '@reduxjs/toolkit';
import { AlertProps } from '@carrier-io/fds-react/Alert';

import { rootSlice } from '../rootSlice';

import { SnackbarAlertAction, SnackbarAlert } from '@/types';

export const showMessage = (
  dispatch: Dispatch,
  message: AlertProps['children'],
  severity: AlertColor = 'info',
  action?: SnackbarAlertAction,
  autoHideDuration?: SnackbarAlert['autoHideDuration'],
  handleClose?: SnackbarAlert['handleClose']
) => {
  dispatch(
    rootSlice.actions.messageShow({
      id: nanoid(),
      message,
      severity,
      action,
      handleClose,
      autoHideDuration,
    })
  );
};
