import { TFunction } from 'i18next';

import { AssetTrackingColumns } from './DefaultColumnDefs';

import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';

export const addAlarmDetailsForExport = (
  columns: AssetTrackingColumns,
  t: TFunction
): AssetTrackingColumns | null => {
  const detailsIndex = columns?.findIndex((item, index) =>
    Object.keys(item).some((objKey) => objKey === 'groupId' && columns[index][objKey] === 'details')
  );

  if (detailsIndex) {
    Object.keys(columns[detailsIndex]).forEach((objKey) => {
      if (objKey === 'children') {
        const insertIndex = columns[detailsIndex][objKey].findIndex((elem) => elem.colId === 'alarms');

        return columns[detailsIndex][objKey].splice(insertIndex + 1, 0, {
          colId: 'activeAlarmDetails',
          field: 'freezerActiveAlarms.details',
          headerName: t('common.alarm-details'),
          hide: true,
          lockVisible: true,
          minWidth: DEFAULT_COLUMN_MIN_WIDTH,
          suppressColumnsToolPanel: true,
        });
      }

      return columns;
    });
  }

  return null;
};
