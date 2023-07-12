import { useCallback } from 'react';
import type { CellClassParams } from '@ag-grid-community/core';

import { CompaniesTableParams } from '../types';
import { CompanyType } from '../../../types';
import { NAME_COL_ID } from '../../../constants';

export const useFirstColumnHighlighting = () => {
  const isCarrierCompany = useCallback(
    ({ data, colDef }: CellClassParams & { data: CompaniesTableParams['data'] }) => {
      if (colDef.colId !== NAME_COL_ID) {
        return false;
      }

      return data?.companyType === CompanyType.CarrierWarehouse;
    },
    []
  );

  const isFirstColumn = useCallback(({ colDef }: CellClassParams) => colDef.colId === NAME_COL_ID, []);

  return {
    isFirstColumn,
    isCarrierCompany,
  };
};
