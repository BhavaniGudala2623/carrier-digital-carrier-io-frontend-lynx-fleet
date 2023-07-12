import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { TenantsHierarchyFleet, TenantsHierarchyTenant } from '@carrier-io/lynx-fleet-types';
import { Business } from '@mui/icons-material';

import { recursivelyGetFleetNode } from './recursivelyGetFleetNode';
import { getNodeId } from './getNodeId';

import { Dictionary } from '@/types';

export const recursivelyGetCompaniesChildren = (
  parentLevel: number,
  treeCompanies: TenantsHierarchyTenant[],
  companiesByParentId: Dictionary<TenantsHierarchyTenant[]>,
  fleetsByParentId: Dictionary<TenantsHierarchyFleet[]>
): TreeItemModel[] => {
  const level = parentLevel + 1;

  return (
    treeCompanies?.map((company): TreeItemModel => {
      const children = [
        ...recursivelyGetCompaniesChildren(
          level,
          companiesByParentId[company.id],
          companiesByParentId,
          fleetsByParentId
        ),
        ...(fleetsByParentId[company.id]?.map((item) =>
          recursivelyGetFleetNode(level, item, fleetsByParentId)
        ) ?? []),
      ];

      return {
        level,
        nodeId: getNodeId('COMPANY', company.id),
        label: company.name,
        children: children.length ? children : undefined,
        adornment: <Business />,
        adornmentSx: {
          boxSizing: 'content-box',
        },
      };
    }) ?? []
  );
};
