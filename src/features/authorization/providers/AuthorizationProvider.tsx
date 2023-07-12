import { RbacProvider } from '@carrier-io/rbac-provider-react';

import { usePermissionsRequest } from '../hooks';
import { PermissionPreloadWrapper } from '../components';

export const AuthorizationProvider = ({ children }: { children: JSX.Element }) => {
  const request = usePermissionsRequest();

  return (
    <RbacProvider permissionsRequest={request} enabled>
      <PermissionPreloadWrapper>{children}</PermissionPreloadWrapper>
    </RbacProvider>
  );
};
