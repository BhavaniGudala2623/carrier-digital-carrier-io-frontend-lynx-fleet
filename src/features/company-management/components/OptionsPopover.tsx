import Box from '@carrier-io/fds-react/Box';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';
import Popover from '@carrier-io/fds-react/Popover';
import { Maybe } from '@carrier-io/lynx-fleet-types';

interface OptionsPopoverProps {
  onClose: () => void;
  anchorEl: Maybe<Element>;
  children: JSX.Element;
  renderAnchor: () => JSX.Element;
}

export const OptionsPopover = ({ renderAnchor, children, anchorEl, onClose }: OptionsPopoverProps) => (
  <Box position="relative">
    {renderAnchor()}
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <ClickAwayListener onClickAway={onClose}>{children}</ClickAwayListener>
    </Popover>
  </Box>
);
