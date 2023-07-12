import { Snackbar } from '@/components';
import { SnackbarAlert } from '@/types';
import { useAppDispatch, useAppSelector } from '@/stores';
import { rootSlice } from '@/stores/rootSlice';

const style = (i: number) => ({
  marginBottom: `${i * 56}px`,
});

export const SnackbarProvider = ({ children }: { children: JSX.Element }) => {
  const dispatch = useAppDispatch();
  const { alerts } = useAppSelector((state) => state.root);

  return (
    <>
      {children}
      {alerts.length > 0 &&
        alerts.slice(0, 3).map((alert: SnackbarAlert, i: number) => (
          <Snackbar
            action={alert.action}
            key={alert.id}
            message={alert.message}
            severity={alert.severity}
            style={style(i)}
            handleClose={(event, reason) => {
              if (reason === 'clickaway') {
                return;
              }

              alert?.handleClose?.(event);

              dispatch(rootSlice.actions.messageHidden(alert.id));
            }}
            autoHideDuration={alert.autoHideDuration}
          />
        ))}
    </>
  );
};
