import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { makeStyles } from '@mui/styles';

export const batteryNotificationsNoIssueStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '14px',
    height: '128px',
    background: fleetThemeOptions.palette.background.default,
  },
}));
