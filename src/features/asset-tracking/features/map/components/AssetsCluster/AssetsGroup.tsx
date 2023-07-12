import { FC } from 'react';
import Box from '@carrier-io/fds-react/Box';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import Typography from '@carrier-io/fds-react/Typography';

export interface AssetsGroupProps {
  title: string;
  number: string | number;
  color?: string;
  last?: boolean;
}

export const AssetsGroup: FC<AssetsGroupProps> = ({ title, number, color, last }) => (
  <Box sx={{ mb: last ? 0 : 0.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box display="flex" alignItems="center" gap={0.25}>
      <Box display="flex" alignItems="center" color={color}>
        <FiberManualRecordRoundedIcon sx={{ mb: 0.25, width: (theme) => theme.spacing(1.75) }} />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
    </Box>
    <Typography variant="caption" color="text.secondary">
      {number}
    </Typography>
  </Box>
);
