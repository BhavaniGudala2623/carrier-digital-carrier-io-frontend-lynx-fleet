import { TFunction } from 'i18next';

import { assetChipRenderer } from './assetChipRenderer';

import { AgGridCellProps } from '@/types';

export const cellChipRenderer = (props: AgGridCellProps, t: TFunction): JSX.Element => {
  const { column, value } = props;

  const { field } = column.getColDef();

  return assetChipRenderer(field, value, t);
};
