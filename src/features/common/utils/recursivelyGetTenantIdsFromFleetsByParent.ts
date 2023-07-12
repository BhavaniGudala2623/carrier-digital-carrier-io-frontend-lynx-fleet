import { TenantsHierarchyFleet } from '@carrier-io/lynx-fleet-types';

export const recursivelyGetTenantIdsFromFleetsByParent = (
  parentId: string,
  fleets: TenantsHierarchyFleet[]
): string[] => {
  const filteredFleets = fleets.filter((item) => item.parent.id === parentId && item.parent.type === 'FLEET');

  return filteredFleets.flatMap((item) => [
    item.tenantId,
    ...recursivelyGetTenantIdsFromFleetsByParent(item.id, fleets),
  ]);
};
