import Paper from '@carrier-io/fds-react/Paper';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { styled } from '@mui/material';

import { PrimaryQuickFilters } from './PrimaryQuickFilters';
import { SecondaryQuickfilters } from './SecondaryQuickFilters';

const ResponsiveQuickFilters = styled(Paper)(({ theme }) => ({
  marginBottom: '8px',
  border: 'none',
  minHeight: '60px',
  backgroundColor: fleetThemeOptions.palette.background.desktop,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  alignItems: 'center',
  [theme.breakpoints.down(1093)]: {
    gridTemplateColumns: 'auto',
  },
}));

export const QuickFilterPanel = () => (
  <ResponsiveQuickFilters variant="outlined">
    <PrimaryQuickFilters />
    <SecondaryQuickfilters />
  </ResponsiveQuickFilters>
);
