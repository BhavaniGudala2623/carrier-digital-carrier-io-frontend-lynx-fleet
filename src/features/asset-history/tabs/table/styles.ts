import { makeStyles } from '@mui/styles';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

export const useStyles = makeStyles(() => ({
  cellValueChanged: {
    '& .cell-value, svg, a': {
      border: `1px solid ${fleetThemeOptions.palette.primary.main}`,
      borderRadius: '3px',
    },
    '& span.label, .MuiChip-root': {
      boxShadow: `0 0 0 2px white, 0 0 0 3px ${fleetThemeOptions.palette.primary.main}`,
    },
    '& .cell-value, a': {
      padding: '3px',
    },
    '& .ag-cell-value': {
      overflow: 'visible',
    },
  },
  causedAlert: {
    border: '2px solid #FF0000 !important',
    color: '#FF0000',
  },
  affectedBy2WayCom: {
    border: '2px solid #3F51B5 !important',
  },
  hasAlerts: {
    borderLeftColor: '#FF0000 !important',
    borderLeftWidth: '3px !important',
  },
  hasAffectedBy2WayComField: {
    borderLeftColor: '#3F51B5 !important',
    borderLeftWidth: '3px !important',
  },
  hasAffectedBy2WayComFieldAndAlerts: {
    borderWidth: '0 1px 0 0 !important',

    '&:before': {
      display: 'block',
      content: "''",
      background: 'linear-gradient(to top, #FF0000 50%, #3F51B5 50%)',
      width: '3px',
      height: '100%',
      left: 0,
      position: 'absolute',
    },
  },
  grayRow: {
    opacity: 0.45,
  },
}));
