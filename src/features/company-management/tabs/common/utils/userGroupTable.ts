import type { ColDef } from '@ag-grid-community/core';

import { DEFAULT_COLUMN_WIDTH } from '@/constants';

export const defaultColDef: ColDef = {
  resizable: true,
  sortable: true,
  filter: false,
  width: DEFAULT_COLUMN_WIDTH,
  getQuickFilterText: () => '',
  suppressSizeToFit: true,
};
