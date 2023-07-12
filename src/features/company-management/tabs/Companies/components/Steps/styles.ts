import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
  formInput: {
    // marginBottom: theme.spacing(2),
    maxWidth: '330px',
    '& .MuiOutlinedInput-root': {
      maxHeight: '42px',
      fontSize: 17,
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: '11px',
      paddingBottom: '11px',
    },
    '& .MuiSelect-select': {
      fontSize: 17,
      display: 'flex',
      alignItems: 'center',
    },
  },
  formInputShort: {
    width: '163px',
    '& .MuiOutlinedInput-root': {
      maxHeight: '42px',
      fontSize: 17,
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: '11px',
      paddingBottom: '11px',
    },
  },
  formHeadline: {
    fontSize: 18,
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '330px',
  },
  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    // marginBottom: theme.spacing(2),
  },
  notification: {
    // margin: `${theme.spacing(2)}px 0`,
    fontSize: 12,
    opacity: 0.6,
  },
  toggleButtonFont: {
    '& .MuiToggleButton-root': {
      fontSize: 10,
    },
  },
  label: {
    color: '#00000061',
    fontSize: 12,
  },
  featureLabel: {
    fontSize: 15,
  },
  iconButton: {
    padding: '6px',
  },
}));
