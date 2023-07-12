import { memo } from 'react';
import Box from '@carrier-io/fds-react/Box';

import { AlarmsWidget } from './AlarmsWidget/AlarmsWidget';
import { StatusWidget } from './StatusWidget/StatusWidget';
import { AssetHealthWidget } from './AssetHealthWidget';

import { useApplicationContext } from '@/providers/ApplicationContext';

export const AssetsDrawer = memo(() => {
  const { featureFlags } = useApplicationContext();

  return (
    <Box
      sx={{
        typography: 'body1',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 1,
      }}
    >
      <StatusWidget />
      {featureFlags.REACT_APP_FEATURE_HEALTH_STATUS && <AssetHealthWidget />}
      <AlarmsWidget />
    </Box>
  );
});

AssetsDrawer.displayName = 'AssetsDrawer';
