import { SyntheticEvent } from 'react';
import Box from '@carrier-io/fds-react/Box';
import { MoreVert } from '@mui/icons-material';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { OptionsPopover } from './OptionsPopover';

interface IProps {
  onClose: () => void;
  onOpen: (event: SyntheticEvent) => void;
  anchorEl: Maybe<Element>;
  children: JSX.Element;
}

export const MoreActionsPopover = ({ children, anchorEl, onClose, onOpen }: IProps) => {
  const handleClick = (event: SyntheticEvent) => onOpen(event);

  const renderAnchor = () => (
    <Box sx={{ width: '24px', height: '24px', cursor: 'pointer' }}>
      <MoreVert onClick={handleClick} />
    </Box>
  );

  return (
    <OptionsPopover onClose={onClose} renderAnchor={renderAnchor} anchorEl={anchorEl}>
      {children}
    </OptionsPopover>
  );
};
