import { makeStyles } from '@mui/styles';
import { useMemo } from 'react';
import { AssetRow } from '@carrier-io/lynx-fleet-types';

import { isAssetPopulatedRow } from '../../../utils';

const useClasses = makeStyles(() => ({
  container: {
    height: '100%',
  },
  carrierAssetRow: {
    // borderLeft: `3px solid ${theme.palette.primary.main} !important`,
    borderLeft: '3px solid primary !important',
  },
}));

const hasNoParent = (params: { data: AssetRow }) =>
  isAssetPopulatedRow(params.data) && !params.data.tenant?.name;

export const useRowClassRules = () => {
  const classes = useClasses();

  return useMemo(
    () => ({
      [classes.carrierAssetRow]: hasNoParent,
    }),
    [classes]
  );
};
