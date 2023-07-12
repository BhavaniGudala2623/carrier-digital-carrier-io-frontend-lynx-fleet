import Alert from '@carrier-io/fds-react/Alert';
import SnackbarFDS, { SnackbarProps } from '@carrier-io/fds-react/Snackbar';
import type { AlertColor, SnackbarCloseReason, AlertProps } from '@mui/material';
import { SyntheticEvent } from 'react';
import Button from '@carrier-io/fds-react/Button';
import Box from '@carrier-io/fds-react/Box';

import { SnackbarAlertAction } from '@/types';

interface SnackbarComponentProps {
  message: AlertProps['children'];
  severity?: AlertColor;
  handleClose: (event?: Event | SyntheticEvent, reason?: SnackbarCloseReason) => void;
  style: { [key: string]: string };
  action?: SnackbarAlertAction;
  autoHideDuration?: SnackbarProps['autoHideDuration'];
}

export function Snackbar({
  message,
  severity,
  handleClose,
  style,
  action,
  autoHideDuration = 6000,
}: SnackbarComponentProps) {
  return (
    <SnackbarFDS
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      open
      autoHideDuration={autoHideDuration}
      onClose={(event, reason) => handleClose(event, reason)}
      style={style}
    >
      <Alert
        action={
          action && (
            <Box sx={{ backgroundColor: (theme) => theme.palette.common.white, borderRadius: 1 }}>
              <Button color="secondary" size="small" variant="outlined" onClick={action?.callback}>
                {action?.label}
              </Button>
            </Box>
          )
        }
        variant="filled"
        onClose={handleClose}
        severity={severity || 'info'}
        icon={false}
        // use either this or theme config override
        sx={{
          backgroundColor: (theme) => (severity === 'info' ? theme.palette.primary.dark : ''),
        }}
      >
        {message}
      </Alert>
    </SnackbarFDS>
  );
}
