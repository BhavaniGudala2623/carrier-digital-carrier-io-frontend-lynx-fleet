import type { ColDef } from '@ag-grid-community/core';
import { TFunction } from 'i18next';
import { FreezerControlType } from '@carrier-io/lynx-fleet-types';

export const getColumns = (t: TFunction, modelType?: FreezerControlType, activeAlarms = false): ColDef[] => {
  const columns: ColDef[] = [];

  if (modelType && ['APX', 'Advance', 'AT52'].includes(modelType)) {
    columns.push(
      ...[
        {
          field: 'response',
          headerName: t('common.response'),
        },
        {
          field: 'type',
          headerName: t('asset.alarm-type'),
        },
        {
          field: 'code',
          headerName: t('common.code'),
        },
        {
          field: 'description',
          headerName: t('common.description'),
        },
      ]
    );
  } else {
    columns.push(
      ...[
        {
          field: 'response',
          headerName: t('common.response'),
        },
        {
          field: 'code',
          headerName: t('common.code'),
        },
        {
          field: 'description',
          headerName: t('common.description'),
        },
      ]
    );
  }

  return activeAlarms
    ? [
        ...columns,
        {
          colId: 'recommendation',
          field: 'recommendation',
          headerName: t('common.recommendation'),
        },
      ]
    : columns;
};
