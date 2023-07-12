import { CircularProgress } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';

interface ProgressSpinnerProps {
  size?: string | number;
}

export const ProgressSpinner = ({ size = 20 }: ProgressSpinnerProps) => (
  <Box position="relative" display="flex" flexDirection="column" alignItems="flex-end">
    <CircularProgress size={size} sx={{ color: '#7A97FF' }} thickness={6} value={100} variant="determinate" />
    <Box sx={{ left: '0', position: 'absolute', top: '0' }}>
      <CircularProgress size={size} thickness={6} value={30} variant="indeterminate" />
    </Box>
  </Box>
);
