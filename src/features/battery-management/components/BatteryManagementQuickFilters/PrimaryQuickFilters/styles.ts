import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { makeStyles } from '@mui/styles';

export const primaryFilterStyles = makeStyles(() => ({
  root: {
    padding: '0px',
    background: fleetThemeOptions.palette.background.paper,
    borderRadius: '8px',
    overflow: 'hidden',
    width: 'max-content',
  },
  totalBatteriesCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    paddingBottom: '6px',
  },
}));
