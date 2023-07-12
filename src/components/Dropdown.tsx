import { ReactNode, ReactElement } from 'react';
import Menu from '@carrier-io/fds-react/Menu';

interface DropdownProps {
  children: ReactNode;
  handleClose: () => void;
  anchorEl: HTMLElement | null;
  trigger: ReactElement;
}

export const Dropdown = ({ children, anchorEl, handleClose, trigger }: DropdownProps) => (
  <>
    {trigger}
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      MenuListProps={{
        disablePadding: true,
      }}
    >
      {children}
    </Menu>
  </>
);
