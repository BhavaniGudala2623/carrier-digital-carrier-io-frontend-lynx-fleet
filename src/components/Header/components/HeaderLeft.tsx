import { Link } from 'react-router-dom';
import Box from '@carrier-io/fds-react/Box';

import { routes } from '@/routes';
import { LynxLogoIcon } from '@/components/icons';
import { Breadcrumbs } from '@/components';
import '../styles.scss';

export const HeaderLeft = () => (
  <Box display="flex">
    <Link to={routes.assets.path}>
      <LynxLogoIcon sx={{ width: '32px', height: '32px' }} fill="white" />
    </Link>
    <Box display="flex" alignItems="center" ml={3}>
      <Breadcrumbs />
    </Box>
  </Box>
);
