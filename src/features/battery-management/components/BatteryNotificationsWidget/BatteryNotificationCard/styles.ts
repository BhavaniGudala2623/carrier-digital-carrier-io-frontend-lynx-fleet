import Box from '@carrier-io/fds-react/Box';
import { styled } from '@mui/material';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme/fleetThemeOptions';
import { makeStyles } from '@mui/styles';

export const batteryNotificationsStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    marginBottom: '10px',
    backgroundColor: fleetThemeOptions.palette.background.paper,
    overflow: 'hidden',
  },
  leftBorder: { borderLeft: '6px solid' },
  cardBox: { padding: '20px' },
  assetNameCloseIcon: { display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '4px' },
  titleBox: {
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'start',
    gap: '4px',
  },
  titleIcon: {
    marginTop: '2px',
  },
  detailsStepsBox: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  timestamp: { opacity: 0.9 },
}));

export const BatteryNotificationsDetailsBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'end',
  [theme.breakpoints.down(810)]: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '10px',
  },
}));
