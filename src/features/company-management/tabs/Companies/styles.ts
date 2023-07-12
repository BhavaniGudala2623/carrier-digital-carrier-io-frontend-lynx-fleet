import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
  companiesTable: {
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  headerCustom: {
    background: 'none !important',
    border: 'none',
  },
  carrierCompany: {
    // borderLeftColor: `${theme.palette.primary.main} !important`,
    borderLeftColor: 'primary !important',
  },
  firstColumn: {
    borderLeftWidth: '3px !important',
  },
}));
