import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { TenantsHierarchyFleet } from '@carrier-io/lynx-fleet-types';

import { getNodeId } from './getNodeId';

import { Dictionary } from '@/types';
import { sortArrayOfObjectsByStringField } from '@/utils';

export const recursivelyGetFleetNode = (
  parentLevel: number,
  fleet: TenantsHierarchyFleet,
  fleetsByParentId: Dictionary<TenantsHierarchyFleet[]>
): TreeItemModel & { [key: string]: unknown } => {
  const level = parentLevel + 1;

  return {
    level,
    nodeId: getNodeId('FLEET', fleet.id),
    label: fleet.name,
    children:
      fleetsByParentId[fleet.id]
        ?.map((item) => recursivelyGetFleetNode(level, item, fleetsByParentId))
        .sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'label')) ?? null,
  };
};
