import { TenantsHierarchyFleet } from '@carrier-io/lynx-fleet-types';

import { recursivelyGetTenantIdsFromFleetsByParent } from './recursivelyGetTenantIdsFromFleetsByParent';

export const getFleetTenantIds = (fleetId: string, fleets: TenantsHierarchyFleet[]): string[] => {
  const result: string[] = [];
  const fleet = fleets.find((item) => item.id === fleetId);

  if (fleet?.tenantId) {
    result.push(fleet.tenantId);
  }

  const tenantIds = recursivelyGetTenantIdsFromFleetsByParent(fleetId, fleets);

  if (tenantIds.length) {
    result.push(...tenantIds);
  }

  return result;
};
