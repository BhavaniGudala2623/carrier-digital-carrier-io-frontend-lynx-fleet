import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { CheckCircleRounded } from '@mui/icons-material';

import { ProgressSpinner } from './ProgressSpinner';

interface ProgressDialogStepProps {
  title: string;
  isSuccess?: boolean;
}

export const ProgressDialogStep = ({ title, isSuccess }: ProgressDialogStepProps) => (
  <Box width="100%" display="flex" gap={1} alignItems="flex-start" mt={4}>
    {isSuccess ? <CheckCircleRounded color="success" /> : <ProgressSpinner size={24} />}
    <Typography variant="body1">{title}</Typography>
  </Box>
);
