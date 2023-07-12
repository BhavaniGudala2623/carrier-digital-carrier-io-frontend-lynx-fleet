import { IGetRowsParams } from '@ag-grid-community/core';
import { Sorting } from '@carrier-io/lynx-fleet-types';

export const getSortDirectionFromParams = (
  params: IGetRowsParams,
  colIdToFind: string
): Sorting | undefined => {
  const sortData = params.sortModel.find(({ colId }) => colId === colIdToFind);

  return sortData?.sort?.toUpperCase() as Sorting;
};
