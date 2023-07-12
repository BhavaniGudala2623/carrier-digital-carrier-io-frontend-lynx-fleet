import { isNull } from 'lodash-es';
import { Maybe, AssetRow, HierarchicalFleet } from '@carrier-io/lynx-fleet-types';

import { FleetRow } from '@/types';

const filterHierarchyByFleetId = (
  hierarchy: (AssetRow | Partial<HierarchicalFleet>)[],
  selectedFleetId: string
) => hierarchy.filter((item) => item?.hierarchy?.includes(selectedFleetId));

const getAllFleetsMap = (fleets: FleetRow[]): Map<string, FleetRow> =>
  fleets.reduce((acc, fleetRow) => acc.set(fleetRow.fleet.id, fleetRow), new Map<string, FleetRow>());

const makeFleetHierarchy = (allFleets: Map<string, FleetRow>, selectedFleetId: Maybe<string>) => {
  const fleetHierarchy: AssetRow['fleets'] = [];

  allFleets.forEach(({ fleet, ...rest }) => {
    if (fleet?.id) {
      if (fleet.parent && fleet.parent.type === 'FLEET') {
        if (!selectedFleetId || selectedFleetId !== fleet.id) {
          fleetHierarchy.push({
            ...fleet,
            hierarchy: [fleet.parent.id, fleet.id],
            ...rest,
          });
        } else if (selectedFleetId === fleet.id) {
          fleetHierarchy.push({
            ...fleet,
            hierarchy: [fleet.id],
            ...rest,
          });
        }
      } else {
        fleetHierarchy.push({
          ...fleet,
          hierarchy: [fleet.id],
          ...rest,
        });
      }
    }
  });

  return fleetHierarchy;
};

const makeAssetHierarchy = (rows: AssetRow[], fleetHierarchy: AssetRow['fleets']) => {
  const assetHierarchy: AssetRow[] = [];

  rows.forEach((row) => {
    if (Array.isArray(row.fleets) && row.fleets.length > 0) {
      row.fleets.forEach((fleet) => {
        const foundHierarchicalFleet = fleetHierarchy.find(({ id }) => id === fleet.id);
        if (foundHierarchicalFleet?.hierarchy?.length && row.id) {
          assetHierarchy.push({
            ...row,
            hierarchy: [...foundHierarchicalFleet.hierarchy, row.id],
            nearestFleetIdInHierarchy:
              foundHierarchicalFleet.hierarchy[foundHierarchicalFleet.hierarchy.length - 1],
          });
        }
      });
    } else if (row?.id) {
      assetHierarchy.push({
        ...row,
        hierarchy: [row.id],
      });
    }
  });

  return assetHierarchy;
};

export const makeHierarchy = (rows: AssetRow[], rowFleets: FleetRow[], selectedFleetId: Maybe<string>) => {
  if (!rows) {
    return rows;
  }

  const filteredRows = rows.filter((row) => Array.isArray(row?.fleets) && row.fleets.length > 0);

  const allFleetsMap = getAllFleetsMap(rowFleets);
  const fleetHierarchy: AssetRow['fleets'] = makeFleetHierarchy(allFleetsMap, selectedFleetId);
  const assetHierarchy = makeAssetHierarchy(filteredRows, fleetHierarchy);
  const hierarchy = [...assetHierarchy, ...fleetHierarchy];
  if (!isNull(selectedFleetId)) {
    return filterHierarchyByFleetId(hierarchy, selectedFleetId);
  }

  return hierarchy;
};
