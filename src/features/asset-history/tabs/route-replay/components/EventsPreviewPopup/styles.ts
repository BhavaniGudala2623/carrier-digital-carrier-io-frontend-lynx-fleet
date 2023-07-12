import { makeStyles } from '@mui/styles';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

export const useStyles = makeStyles(() => ({
  table: {
    '&': {
      width: '456px',
    },
    '& .ag-center-cols-viewport': {
      overflow: 'hidden',
    },
    '& .ag-header': {
      display: 'none',
    },
    '& .ag-row-selected': {
      '& .filledIcon': {
        fill: fleetThemeOptions.palette.primary.main,
        '& path': {
          fill: fleetThemeOptions.palette.primary.main,
        },
        '& rect': {
          fill: fleetThemeOptions.palette.primary.main,
        },
      },
      '& .filledStrokeIcon': {
        stroke: fleetThemeOptions.palette.primary.main,
        fill: 'none',
        '& rect': {
          stroke: fleetThemeOptions.palette.primary.main,
        },
        '& path': {
          stroke: fleetThemeOptions.palette.primary.main,
        },
      },
    },
  },
}));
