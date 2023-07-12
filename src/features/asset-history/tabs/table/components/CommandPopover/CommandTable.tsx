import { Command } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';

interface CommandTableInterface {
  commands: Command[];
}

export const CommandTable = ({ commands }: CommandTableInterface) => (
  <Box minWidth="250px" width="100%">
    {commands.map(
      (command) =>
        command.name && (
          <Grid container spacing={1} direction="row" alignItems="center" key={command.name}>
            <Grid item xs={8}>
              <Box>{command.name}</Box>
            </Grid>
            <Grid item xs={4}>
              <Box fontWeight="fontWeightBold">{command.value}</Box>
            </Grid>
          </Grid>
        )
    )}
  </Box>
);
