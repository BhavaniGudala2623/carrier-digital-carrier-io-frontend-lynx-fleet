import Box from '@carrier-io/fds-react/Box';

import { QuickFilterPanel } from '../../BatteryManagementQuickFilters';

import { ElectricAssetsTableContainer } from './ElectricAssetsTableContainer';
import { electricAssetsTabStyles } from './styles';

export const ElectricAssetsTab = () => {
  const classes = electricAssetsTabStyles();

  return (
    <Box className={classes.root}>
      <QuickFilterPanel />
      <ElectricAssetsTableContainer />
    </Box>
  );
};
