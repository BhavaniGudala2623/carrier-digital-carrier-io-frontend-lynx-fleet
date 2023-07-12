import { makeStyles } from '@mui/styles';

export const batteryNotificationsWidgetStyles = makeStyles(() => ({
  root: {
    p: 1,
    border: 'none',
    padding: '20px',
    flexGrow: 1,
    height: 'fit-content',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingBottom: '20px',
  },
  viewAllNotifications: {
    cursor: 'pointer',
    marginTop: '20px',
    backgroundColor: 'background.paper',
    userSelect: 'none',
    textAlign: 'center',
    padding: '4px',
    borderRadius: '4px',
  },
  criticalityFiltersContainer: {
    minWidth: '140px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    marginLeft: '0px',
    paddingRight: '10px',
    borderRadius: '8px',
  },
  criticalityFiltersLabelContainer: {},
  criticalityFiltersLabel: {
    marginLeft: '10px',
    marginTop: '2px',
    alignSelf: 'end',
  },
  criticalityFiltersCount: {
    marginLeft: '10px',
    fontFamily: 'Nunito Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '16px',
    color: '#001665',
    alignSelf: 'end',
  },
}));
