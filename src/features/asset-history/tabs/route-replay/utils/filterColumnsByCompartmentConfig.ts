import { CompartmentConfig, Maybe } from '@carrier-io/lynx-fleet-types';

import { filterGroupsByCompartmentConfig } from './filterGroupsByCompartmentConfig';

import { IColumnGroup, Columns } from '@/types';

export const filterColumnsByCompartmentConfig = (
  groups: IColumnGroup[],
  columns: Columns,
  compartmentConfig: Maybe<CompartmentConfig> | undefined
): Columns => {
  if (groups.length === 0) {
    return columns;
  }

  const fixedColIds = ['menu', 'location', 'gapColumn', 'event', 'time'];
  const filteredGroups = filterGroupsByCompartmentConfig(groups, compartmentConfig);

  const filteredColumnIds = filteredGroups.flatMap((group) => group.columnDataArr.map((col) => col.colId));

  const availableColumnIds = [...fixedColIds, ...filteredColumnIds];

  return columns.filter((obj) => 'colId' in obj && obj?.colId && availableColumnIds.includes(obj.colId));
};
