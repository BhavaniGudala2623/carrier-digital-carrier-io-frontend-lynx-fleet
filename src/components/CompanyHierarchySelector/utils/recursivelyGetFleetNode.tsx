import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { TenantsHierarchyFleet } from '@carrier-io/lynx-fleet-types';
import { LocalShipping } from '@mui/icons-material';

import { getNodeId } from './getNodeId';

import { Dictionary } from '@/types';

export const recursivelyGetFleetNode = (
  parentLevel: number,
  fleet: TenantsHierarchyFleet,
  fleetsByParentId: Dictionary<TenantsHierarchyFleet[]>
): TreeItemModel => {
  const level = parentLevel + 1;

  return {
    level,
    nodeId: getNodeId('FLEET', fleet.id),
    label: fleet.name,
    children:
      fleetsByParentId[fleet.id]?.map((item) => recursivelyGetFleetNode(level, item, fleetsByParentId)) ??
      null,
    adornment: <LocalShipping />,
    adornmentSx: {
      boxSizing: 'content-box',
    },
  };
};
