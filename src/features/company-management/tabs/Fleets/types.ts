import { AssetGql, Fleet, Tenant } from '@carrier-io/lynx-fleet-types';

export type CreateFleetState = {
  assetIds: string[];
  name: string;
  tenantId: Tenant['id'];
  parentType: FleetParentType;
};

export enum FleetParentType { // TODO change to type literal
  TENANT = 'TENANT',
  FLEET = 'FLEET',
}

export type FleetDetails = {
  fleet: Fleet;
  tenant: Tenant;
  assets: AssetGql[];
};
