import { CellClassParams } from '@ag-grid-community/core';
import { Command } from '@carrier-io/lynx-fleet-types';
import { useCallback } from 'react';

import { COLUMNS_TO_HIGHLIGHT } from '../utils';

export const useCellHighlighting = () => {
  const causedAlert = useCallback(({ data, colDef }: CellClassParams) => {
    const colId = colDef?.colId || '';
    const command = data?.['formattedFields.commands']?.find((commandItem: Command) =>
      commandItem?.affectedFields?.includes(colId)
    );

    if (!COLUMNS_TO_HIGHLIGHT.has(colId) || command) {
      return false;
    }

    const alertedRows = data?.alerts?.filter((alert: { triggers?: string }) =>
      alert?.triggers?.includes(colId)
    );

    return alertedRows?.length > 0;
  }, []);

  const affectedBy2WayCom = useCallback(({ data, colDef }: CellClassParams) => {
    const colId = colDef?.colId || '';

    if (!COLUMNS_TO_HIGHLIGHT.has(colId)) {
      return false;
    }

    return data?.['formattedFields.commands']?.find((command: Command) =>
      command?.affectedFields?.includes(colId)
    );
  }, []);

  return {
    causedAlert,
    affectedBy2WayCom,
  };
};
