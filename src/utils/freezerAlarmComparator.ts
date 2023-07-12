import type { RowNode } from '@ag-grid-community/core';

export function freezerAlarmComparator(nodeA: RowNode, nodeB: RowNode) {
  const numAlarmsA = nodeA?.data?.activeFreezerAlarms?.length || 0;
  const numAlarmsB = nodeB?.data?.activeFreezerAlarms?.length || 0;

  return numAlarmsA - numAlarmsB;
}
