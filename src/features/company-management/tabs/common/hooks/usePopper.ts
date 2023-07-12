import { MouseEvent, useState } from 'react';

export const usePopper = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleShowPopper = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClosePopper = () => {
    setOpen(false);
  };

  return { anchorEl, open, handleShowPopper, handleClosePopper };
};
