import Box from '@carrier-io/fds-react/Box';

import { ToolbarActions } from './ToolbarActions';

export const Toolbar = () => (
  <Box mx={2} mt={2} display="flex" alignItems="center" justifyContent="space-between" minHeight="36px">
    <ToolbarActions />
  </Box>
);
