import { makeStyles } from '@mui/styles';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

export const useStyles = makeStyles(() => ({
  table: {
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
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  topElement: {
    alignItems: 'end',
    fontWeight: 600,
    fontSize: '16px',
    color: fleetThemeOptions.palette.text.primary,
    height: '20px',
    display: 'flex',
  },
  bottomElement: {
    alignItems: 'start',
    fontSize: '12px',
    fontWeight: 400,
    height: '15px',
    color: fleetThemeOptions.palette.text.secondary,
  },
  topCellElement: {
    alignItems: 'end',
    fontWeight: 400,
    fontSize: '14px',
    color: fleetThemeOptions.palette.text.primary,
    height: '15px',
  },
  arrowSort: {
    color: fleetThemeOptions.palette.text.secondary,
    alignSelf: 'start',
  },
  sortAsc: {
    transform: 'rotate(0.5turn)',
  },
  loader: {
    zIndex: 8,
  },
  popupButtonContainer: {
    transform: 'translate(-5px, -10px)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  popupButton: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  popupVisible: {
    color: fleetThemeOptions.palette.action.disabled,
  },
  popupHidden: {
    color: fleetThemeOptions.palette.text.secondary,
  },
}));
