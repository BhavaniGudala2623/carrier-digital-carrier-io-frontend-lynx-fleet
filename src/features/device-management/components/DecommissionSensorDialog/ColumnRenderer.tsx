import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';

interface ColumnRendererProps {
  header: string;
  value: string;
  size?: number | boolean;
}

export const ColumnRenderer = ({ header, value, size }: ColumnRendererProps) => (
  <Grid item xs={size ?? true}>
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start">
      <Typography variant="body2" color="text.secondary">
        {header}
      </Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Box>
  </Grid>
);
