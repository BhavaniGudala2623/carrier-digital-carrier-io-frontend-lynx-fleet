import { ColumnApi } from '@ag-grid-community/core';

import { DEFAULT_MAX_COLUMNS_NUMBER, MENU_BUTTON_WIDTH, RIGHT_EDGE_COLUMNS_NUMBER } from '../constants';

export const getTableViewPortWidth = (columns: ColumnApi | null, columnNumber?: number): number | null => {
  const displayedColumns = columns?.getAllDisplayedColumns().slice(0, -RIGHT_EDGE_COLUMNS_NUMBER);
  if (displayedColumns) {
    const viePortColumnNumber =
      columnNumber ||
      (displayedColumns.length >= DEFAULT_MAX_COLUMNS_NUMBER
        ? DEFAULT_MAX_COLUMNS_NUMBER
        : displayedColumns.length);

    return displayedColumns
      .slice(0, viePortColumnNumber)
      .reduce((acc, col) => acc + col.getActualWidth(), MENU_BUTTON_WIDTH);
  }

  return null;
};
