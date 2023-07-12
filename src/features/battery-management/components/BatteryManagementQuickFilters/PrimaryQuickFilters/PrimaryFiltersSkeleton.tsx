import Box from '@carrier-io/fds-react/Box';
import Skeleton from '@carrier-io/fds-react/Skeleton';
import { makeStyles } from '@mui/styles';

export const primaryFilterSkeletonStyles = makeStyles(() => ({
  shimmer: { width: '390px', height: '130px' },
}));

export const PrimaryFiltersSkeleton = () => {
  const classes = primaryFilterSkeletonStyles();

  return (
    <Box>
      <Skeleton variant="rectangular" animation="pulse" className={classes.shimmer} />
    </Box>
  );
};
