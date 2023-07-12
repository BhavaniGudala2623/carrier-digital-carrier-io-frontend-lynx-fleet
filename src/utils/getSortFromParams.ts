import { IGetRowsParams } from '@ag-grid-community/core';
import { Sorting, SortingParams } from '@carrier-io/lynx-fleet-types';

export const getSortFromParams = (
  params: IGetRowsParams,
  defaultColId: string,
  defaultDirection: Sorting
): SortingParams => {
  const sortData = params.sortModel.find(({ sort }) => !!sort);

  return {
    field: sortData?.colId || defaultColId,
    direction: (sortData?.sort?.toUpperCase() as Sorting) || defaultDirection,
  };
};
