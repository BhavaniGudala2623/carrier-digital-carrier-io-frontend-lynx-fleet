import { makeStyles } from '@mui/styles';

export const batteryNotificationSkeletonStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    cursor: 'pointer',
    marginBottom: '10px',
    backgroundColor: 'background.paper',
    userSelect: 'none',
    overflow: 'hidden',
    padding: '20px',
  },
  shimmer1: { marginBottom: '10px', width: '33%', height: '10px' },
  shimmer2: { marginBottom: '10px', width: '50%', height: '20px' },
  shimmer3: { width: '100%', height: '14px' },
}));
