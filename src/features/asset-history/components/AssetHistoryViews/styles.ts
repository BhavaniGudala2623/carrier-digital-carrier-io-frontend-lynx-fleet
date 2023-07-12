import { styled } from '@mui/material';
import MenuItem from '@carrier-io/fds-react/MenuItem';

export const MenuItemStyled = styled(MenuItem)({
  margin: '0 !important',
  borderRadius: '0 !important',
});

export const menuItemContainerStyle = {
  pl: 5,
  py: 1.5,
  zIndex: 100,
  width: '100%',
  display: 'flex',
  flexWrap: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const menuIconsContainerStyle = {
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  pl: 1,
};

export const controlIconsStyles = {
  width: '20px',
  height: '20px',
  color: (theme) => theme.palette.grey['500'],
};

export const iconsStyles = {
  width: '16px',
  height: '16px',
};
