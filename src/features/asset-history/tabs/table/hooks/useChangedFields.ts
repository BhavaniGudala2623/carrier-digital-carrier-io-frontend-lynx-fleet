import { CellClassParams, GridApi } from '@ag-grid-community/core';
import { Sorting } from '@carrier-io/lynx-fleet-types';
import { useCallback } from 'react';

export type RowDataComparator<T> = (colField: string, data1: T, data2: T) => boolean;

interface UseChangedFieldsProps<T> {
  currentTimeSort: Sorting;
  defaultComparator: RowDataComparator<T>;
  comparatorsByColId?: { [key: string]: RowDataComparator<T> };
  ignoreCellChangesIn?: Set<string>;
}

export const useChangedFields = <T>(props: UseChangedFieldsProps<T>) => {
  const { currentTimeSort, ignoreCellChangesIn, comparatorsByColId, defaultComparator } = props;

  const hasCellValueChanged = useCallback(
    (params: CellClassParams & { rowIndex: number; api: GridApi; data: T }) => {
      const { api, colDef, data } = params;

      const prevRowIndex = currentTimeSort === 'ASC' ? params.rowIndex - 1 : params.rowIndex + 1;
      const prevRowNode = api.getModel().getRow(prevRowIndex);

      const columnField = colDef.field;
      const shouldIgnoreColumn = colDef.colId && ignoreCellChangesIn?.has(colDef.colId);

      if (!data || !prevRowNode?.data || !columnField || shouldIgnoreColumn) {
        return false;
      }

      const hasCustomComparator = !!colDef.colId && !!comparatorsByColId?.[colDef.colId];
      const comparator = hasCustomComparator ? comparatorsByColId[colDef.colId!] : defaultComparator;

      return !comparator(columnField, data, prevRowNode.data);
    },
    [currentTimeSort, ignoreCellChangesIn, comparatorsByColId, defaultComparator]
  );

  return { hasCellValueChanged };
};
