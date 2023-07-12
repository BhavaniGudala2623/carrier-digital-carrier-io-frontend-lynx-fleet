import Box from '@carrier-io/fds-react/Box';
import Skeleton from '@carrier-io/fds-react/Skeleton';
import { makeStyles } from '@mui/styles';

export const secondaryFilterSkeletonStyles = makeStyles(() => ({
  shimmer: { width: '95px', height: '130px' },
}));

export const SecondaryFiltersSekeleton = () => {
  const classes = secondaryFilterSkeletonStyles();

  return (
    <Box display="flex" gap="6px">
      <Skeleton variant="rectangular" animation="pulse" className={classes.shimmer} />
      <Skeleton variant="rectangular" animation="pulse" className={classes.shimmer} />
      <Skeleton variant="rectangular" animation="pulse" className={classes.shimmer} />
      <Skeleton variant="rectangular" animation="pulse" className={classes.shimmer} />
    </Box>
  );
};
