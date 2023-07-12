import Grid from '@carrier-io/fds-react/Grid';
import Divider from '@carrier-io/fds-react/Divider';

import { AssetInfo } from './AssetInfo';
import { TruInfo } from './TruInfo';
import { CompartmentInfo } from './CompartmentInfo';
import { CompartmentSetup } from './CompartmentSetup';

import { useApplicationContext } from '@/providers/ApplicationContext';

export const AssetSection = () => {
  const { featureFlags } = useApplicationContext();

  return (
    <Grid container spacing={2.5} px={1} pb={1}>
      <Grid item xs={12}>
        <Divider variant="fullWidth" light />
      </Grid>
      <Grid item xs={4}>
        <AssetInfo />
      </Grid>
      <Grid item xs={4}>
        <TruInfo />
      </Grid>
      <Grid item xs={4}>
        {featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE ? (
          <CompartmentInfo />
        ) : (
          <CompartmentSetup />
        )}
      </Grid>
    </Grid>
  );
};
