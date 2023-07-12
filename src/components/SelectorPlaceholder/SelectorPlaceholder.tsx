import { styled } from '@mui/material';

const PlaceholderStyled = styled('div')(({ theme }) => ({
  color: theme.palette.text.disabled,
}));

export const SelectorPlaceholder = ({ children }) => <PlaceholderStyled>{children}</PlaceholderStyled>;
