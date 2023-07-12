import { useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { useAppSelector, useAppDispatch } from '@/stores';
import { fetchGeofences } from '@/stores/assets/geofence/actions';
import { fetchGeofenceGroups } from '@/stores/assets/geofenceGroup/actions';
import { geofenceGroupsSlice } from '@/stores/assets/geofenceGroup/slice';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';

const { actions } = geofenceGroupsSlice;

export const useAssetsPageData = () => {
  const { geofenceGroups, geofences } = useAppSelector(
    (state) => ({
      geofenceGroups: state.geofenceGroups,
      geofences: state.geofences,
    }),
    shallowEqual
  );

  const dispatch = useAppDispatch();

  const tenantId = useAppSelector(getAuthTenantId);

  const { hasPermission } = useRbac();
  const shouldFetchGeofences = hasPermission(companyActionPayload('geofence.list', tenantId));
  const shouldFetchGeofenceGroupActions = hasPermission(companyActionPayload('geofence.groupList', tenantId));

  useEffect(() => {
    const request = { isCancelled: false };

    if (shouldFetchGeofences) {
      dispatch(fetchGeofences(request, !!geofences?.entities?.length));
    }

    if (shouldFetchGeofenceGroupActions) {
      dispatch(fetchGeofenceGroups(request, !!geofenceGroups?.entities?.length, geofenceGroups.filters)).then(
        () => {
          const sessionFilters = JSON.parse(sessionStorage.getItem('geofenceGroupsFilters') || '[]');
          if (geofenceGroups.filters.length === 0 && sessionFilters.length === 0) {
            dispatch(
              actions.setGeofenceGroupFilterAll({
                newGeofenceAll: true,
              })
            );
          }
        }
      );
    }

    return () => {
      request.isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, shouldFetchGeofenceGroupActions, shouldFetchGeofences]);
};
