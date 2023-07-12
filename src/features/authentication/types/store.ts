import { Maybe, TenantInfo, TenantsHierarchy, UserInfo } from '@carrier-io/lynx-fleet-types';

export interface AuthenticationState {
  user: Maybe<UserInfo>;
  tenant: Maybe<TenantInfo>;
  loading: boolean;
  error: Maybe<unknown>;
  basicPermissionsLoaded: boolean;
  tenantsHierarchy: Maybe<TenantsHierarchy>;
}
