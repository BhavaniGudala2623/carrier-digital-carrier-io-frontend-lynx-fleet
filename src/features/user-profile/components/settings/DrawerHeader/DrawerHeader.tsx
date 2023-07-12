import { FC } from 'react';
import Grid from '@carrier-io/fds-react/Grid';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';

import { GroupsTooltip } from './GroupsTooltip';

interface DrawerHeaderProps {
  fullName: string;
  groupNames: string[];
  email: string;
}

export const DrawerHeader: FC<DrawerHeaderProps> = ({ fullName, groupNames, email }) => (
  <Box sx={{ marginBottom: '1rem' }}>
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ marginBottom: '.5rem' }}
    >
      <Typography data-testid="user-profile-full-name">{fullName}</Typography>
      <GroupsTooltip groupNames={groupNames} />
    </Grid>
    <Typography color="text.secondary" data-testid="user-profile-email">
      {email}
    </Typography>
  </Box>
);

DrawerHeader.displayName = 'DrawerHeader';
