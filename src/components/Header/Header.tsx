import { memo } from 'react';
import Container from '@carrier-io/fds-react/Container';
import AppBarTopHeader from '@carrier-io/fds-react/patterns/AppBarTopHeader';

import { HeaderRight } from './components/HeaderRight';
import { HeaderLeft } from './components/HeaderLeft';

import { PageLoader } from '@/components/PageLoader/PageLoader';

import './styles.scss';

export const Header = memo(() => (
  <Container className="header">
    <PageLoader className="header__progress-bar" />
    <AppBarTopHeader
      AppBarProps={{
        sx: {
          boxShadow: 'none',
        },
      }}
      ToolbarProps={{
        disableGutters: true,
        variant: 'dense',
        sx: {
          backgroundColor: 'primary.dark',
        },
      }}
      LeftJustifiedGridProps={{ className: 'app-bar-left' }}
      RightJustifiedGridProps={{ className: 'app-bar-right' }}
      leftJustifiedComponent={HeaderLeft}
      rightJustifiedComponent={HeaderRight}
    />
  </Container>
));

Header.displayName = 'Header';
