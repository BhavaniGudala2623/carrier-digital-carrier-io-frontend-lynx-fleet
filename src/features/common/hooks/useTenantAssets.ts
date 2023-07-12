import { useCallback } from 'react';
import { ApolloError } from '@apollo/client';
import { AssetRow } from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { showError } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { sortArrayOfObjectsByStringField } from '@/utils';

export const useTenantAssets = (
  tenantId?: string
): { assets: AssetRow[]; isAssetsLoading: boolean; error?: { message: string } } => {
  const dispatch = useAppDispatch();
  const handleQueryError = useCallback((e: ApolloError) => showError(dispatch, e.message), [dispatch]);

  const assetsData = AssetService.useGetAssetsRow(
    {
      for: {
        id: tenantId,
        type: 'COMPANY',
      },
    },
    {
      onError: handleQueryError,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      skip: !tenantId,
    }
  );

  return {
    assets:
      assetsData?.data?.getAssets?.items
        ?.filter(({ tenant }) => tenant?.id === tenantId)
        .sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name')) ?? [],
    isAssetsLoading: assetsData.loading,
    error: assetsData?.error,
  };
};
