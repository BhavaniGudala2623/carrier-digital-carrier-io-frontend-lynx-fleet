import { useEffect, useState } from 'react';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { LynxActionRequest } from '@carrier-io/lynx-fleet-types';

import { getAuthTenantId, getAuthUserEmail } from '../../authentication/stores/selectors';
import { authSlice } from '../../authentication/stores';
import { actionPayload, companyActionPayload } from '../utils';

import { useAppDispatch, useAppSelector } from '@/stores/hooks';

const { actions } = authSlice;

const getBasicPermissionList = ({
  tenantId,
  email,
}: {
  tenantId: string;
  email: string;
}): LynxActionRequest[] => [
  actionPayload({ action: 'apiPortal.view', subjectType: 'USER', subjectId: email }),
  companyActionPayload('2WayCmd.historyList', tenantId),
  companyActionPayload('2WayCmd.send', tenantId),
  companyActionPayload('asset.list', tenantId),
  companyActionPayload('company.list', tenantId),
  companyActionPayload('dashboard.assetList', tenantId),
  companyActionPayload('device.list', tenantId),
  companyActionPayload('fleet.list', tenantId),
  companyActionPayload('geofence.create', tenantId),
  companyActionPayload('geofence.groupList', tenantId),
  companyActionPayload('geofence.list', tenantId),
  companyActionPayload('group.list', tenantId),
  companyActionPayload('notification.create', tenantId),
  companyActionPayload('notification.list', tenantId),
  companyActionPayload('scheduledReports.view', tenantId),
  companyActionPayload('user.list', tenantId),
  companyActionPayload('wialon.view', tenantId),
];

export const PermissionPreloadWrapper = ({ children }: { children: JSX.Element }) => {
  const { preloadPermissions } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);
  const email = useAppSelector(getAuthUserEmail);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId || !email) {
      return;
    }

    setLoading(true);

    preloadPermissions(getBasicPermissionList({ tenantId, email }))
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.error(`Error preloading permissions data: ${e}`);
      });
  }, [preloadPermissions, tenantId, email]);

  useEffect(() => {
    dispatch(actions.setBasicPermissionsLoaded(!loading));
  }, [dispatch, loading]);

  return children;
};
