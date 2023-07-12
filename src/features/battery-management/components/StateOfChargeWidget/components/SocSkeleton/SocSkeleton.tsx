import Box from '@carrier-io/fds-react/Box';
import Skeleton, { SkeletonProps } from '@carrier-io/fds-react/Skeleton';

const skeletonStyles: SkeletonProps = {
  variant: 'rectangular',
  animation: 'pulse',
  sx: { margin: '10px 16px', maxWidth: '100%', height: '20px' },
};

export const SocSkeleton = () => (
  <Box sx={{ padding: '20px' }}>
    <Skeleton {...skeletonStyles} width="60%" height="40px" />
    <Skeleton {...skeletonStyles} />
    <Skeleton {...skeletonStyles} />
    <Skeleton {...skeletonStyles} />
    <Skeleton {...skeletonStyles} />
  </Box>
);
