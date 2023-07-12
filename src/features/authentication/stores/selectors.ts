import { createSelector } from '@reduxjs/toolkit';

import type { AppState } from '@/stores';

export const getAuth = (state: AppState) => state.auth;

export const getAuthUser = createSelector(getAuth, (auth) => auth.user);

export const getAuthUserGroups = createSelector(getAuthUser, (user) => user?.groups || []);

export const getAuthUserIsCarrierAdmin = createSelector(
  getAuthUser,
  (user): boolean => !!user?.isCarrierAdmin
);

export const getAuthUserEmail = createSelector(getAuthUser, (user) => user?.email?.toLowerCase() ?? '');

export const getAuthTenant = createSelector(getAuth, (auth) => auth.tenant);

export const getAuthTenantId = createSelector(getAuthTenant, (tenant) => tenant?.id ?? '');

export const getAuthTenantsHierarchy = createSelector(getAuth, (auth) => auth.tenantsHierarchy);

export const getTenantByIdFromHierarchy = (state: AppState, tenantId?: string | null) => {
  const tenantsHierarchy = getAuthTenantsHierarchy(state);

  return tenantsHierarchy?.tenants?.find(({ id }) => id === tenantId) || null;
};

export const getUserAccessibleTenantIds = (state: AppState) => {
  const tenantsHierarchy = getAuthTenantsHierarchy(state);

  return tenantsHierarchy?.tenants?.map(({ id }) => id) || [];
};

export const getUserAccessibleFleetIds = (state: AppState) => {
  const tenantsHierarchy = getAuthTenantsHierarchy(state);

  return tenantsHierarchy?.fleets?.map(({ id }) => id) || [];
};
