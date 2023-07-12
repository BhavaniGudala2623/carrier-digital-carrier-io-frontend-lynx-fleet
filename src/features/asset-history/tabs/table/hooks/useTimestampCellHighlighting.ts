import { CellClassParams } from '@ag-grid-community/core';
import { useCallback } from 'react';

import { TIMESTAMP_COL_ID, getCommandFieldAffected, getRowHasAlerts } from '../utils';

export const useTimestampCellHighlighting = () => {
  const hasAffectedBy2WayComFieldAndAlerts = useCallback(({ data, colDef }: CellClassParams) => {
    if (colDef.colId !== TIMESTAMP_COL_ID) {
      return false;
    }

    const commandFieldAffected = getCommandFieldAffected(data);
    const rowHasAlerts = getRowHasAlerts(data);

    return rowHasAlerts && commandFieldAffected;
  }, []);

  const hasAffectedBy2WayComField = useCallback(({ data, colDef }: CellClassParams) => {
    if (colDef.colId !== TIMESTAMP_COL_ID) {
      return false;
    }

    const commandFieldAffected = getCommandFieldAffected(data);
    const rowHasAlerts = getRowHasAlerts(data);

    return !rowHasAlerts && commandFieldAffected;
  }, []);

  const hasAlerts = useCallback(({ data, colDef }: CellClassParams) => {
    if (colDef.colId !== TIMESTAMP_COL_ID) {
      return false;
    }

    const commandFieldAffected = getCommandFieldAffected(data);
    const rowHasAlerts = getRowHasAlerts(data);

    return rowHasAlerts && !commandFieldAffected;
  }, []);

  return {
    hasAffectedBy2WayComField,
    hasAffectedBy2WayComFieldAndAlerts,
    hasAlerts,
  };
};
