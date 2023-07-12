import { FleetRow } from '@/types';

export const filterFleetRowsByTenantId = (fleetData: FleetRow[], selectedItemId?: null | string) =>
  fleetData.filter(
    ({ fleet, tenant }) => fleet.tenantId === selectedItemId || tenant.parentId === selectedItemId
  );
