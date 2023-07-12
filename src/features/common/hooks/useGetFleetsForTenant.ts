import { useMemo } from 'react';
import { FleetService } from '@carrier-io/lynx-fleet-data-lib';

import { showError } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { filterFleetRowsByTenantId, getErrorMessage, sortArrayOfObjectsByStringField } from '@/utils';

export const useGetFleetsForTenant = (tenantId?: string) => {
  const dispatch = useAppDispatch();

  const { data, loading } = FleetService.useGetFleetsByTenantId(
    { tenantId: tenantId ?? '' },
    {
      onError: (e) => showError(dispatch, getErrorMessage(e)),
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      skip: !tenantId,
    }
  );

  const fleets = useMemo(
    () =>
      data && tenantId
        ? filterFleetRowsByTenantId(data.getFleetsByTenantId ?? [], tenantId)
            .map((item) => item.fleet)
            .sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name'))
        : [],
    [data, tenantId]
  );

  return { fleets, loading };
};
