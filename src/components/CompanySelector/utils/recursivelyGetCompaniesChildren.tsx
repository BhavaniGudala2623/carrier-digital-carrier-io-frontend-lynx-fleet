import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { TenantsHierarchyFleet, TenantsHierarchyTenant } from '@carrier-io/lynx-fleet-types';

import { recursivelyGetFleetNode } from './recursivelyGetFleetNode';
import { getNodeId } from './getNodeId';

import { Dictionary } from '@/types';
import { sortArrayOfObjectsByStringField } from '@/utils';

export const recursivelyGetCompaniesChildren = (
  parentLevel: number,
  treeCompanies: TenantsHierarchyTenant[],
  companiesByParentId: Dictionary<TenantsHierarchyTenant[]>,
  fleetsByParentId: Dictionary<TenantsHierarchyFleet[]>,
  includeFleets: boolean
): (TreeItemModel & { [key: string]: unknown })[] => {
  const level = parentLevel + 1;

  return (
    treeCompanies
      ?.map((company) => {
        const children = [
          ...recursivelyGetCompaniesChildren(
            level,
            companiesByParentId[company.id],
            companiesByParentId,
            fleetsByParentId,
            includeFleets
          ),
          ...(includeFleets
            ? fleetsByParentId[company.id]?.map((item) =>
                recursivelyGetFleetNode(level, item, fleetsByParentId)
              ) ?? []
            : []),
        ].sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'label'));

        return {
          level,
          nodeId: getNodeId('COMPANY', company.id),
          label: company.name,
          children: children.length ? children : undefined,
        };
      })
      ?.sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'label')) ?? []
  );
};
