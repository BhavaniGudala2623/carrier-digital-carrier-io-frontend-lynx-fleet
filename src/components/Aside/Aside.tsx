import { memo } from 'react';
import Box from '@carrier-io/fds-react/Box';

import { Navigation } from '../Navigation';

import { PageDrawerEvent } from '@/events';
import { Z_INDEXES } from '@/constants';

export const Aside = memo(() => (
  <Box
    sx={{
      width: 56,
      height: '100%',
      zIndex: Z_INDEXES.drawerMenu,
    }}
  >
    <Navigation onClick={PageDrawerEvent.toggle} />
  </Box>
));

Aside.displayName = 'Aside';
