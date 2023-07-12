import Paper from '@carrier-io/fds-react/Paper';
import Skeleton from '@carrier-io/fds-react/Skeleton';

import { batteryNotificationSkeletonStyles } from './styles';

export const BatteryNotificationSkeleton = () => {
  const classes = batteryNotificationSkeletonStyles();
  const rows = [1, 2, 3];

  return (
    <>
      {rows.map((val) => (
        <Paper key={val} variant="outlined" className={classes.root}>
          <Skeleton variant="rectangular" animation="pulse" className={classes.shimmer1} />
          <Skeleton variant="rectangular" animation="pulse" className={classes.shimmer2} />
          <Skeleton variant="rectangular" animation="pulse" className={classes.shimmer3} />
        </Paper>
      ))}
    </>
  );
};
