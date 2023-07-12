import { Maybe, Command } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import Popover from '@carrier-io/fds-react/Popover';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';

import { CommandTable } from './CommandTable';

interface CommandPopoverProps {
  commands?: Maybe<Command[]>;
  onClose: () => void;
  anchorEl: Maybe<Element>;
  children: JSX.Element;
}

export const CommandPopover = ({ commands, onClose, anchorEl, children }: CommandPopoverProps) => (
  <Box position="relative">
    {children}
    <Popover open={!!anchorEl} anchorEl={anchorEl}>
      <ClickAwayListener onClickAway={onClose}>
        <Box sx={{ p: 2 }}>
          <Grid direction="column" container>
            {commands && commands?.length > 0 && (
              <Grid item xs={12}>
                <CommandTable commands={commands} />
              </Grid>
            )}
          </Grid>
        </Box>
      </ClickAwayListener>
    </Popover>
  </Box>
);
