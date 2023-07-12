import { ColDef, Column, IAggFuncParams, ColGroupDef } from '@ag-grid-community/core';

export interface AgGridCellProps {
  value: unknown;
  valueFormatted: unknown;
  colDef: ColDef;
  column: Column;
  data: Record<string, unknown>;
}

export type { ColDef, IAggFuncParams };

export const trackingSettings = ['sort', 'hide', 'pinned', 'width'] as const;

export type TrackingSettings = Partial<Pick<ColDef, (typeof trackingSettings)[number]>>;

export type ColDefExt = ColDef & {
  colId?: ColDef['colId'];
  field: NonNullable<ColDef['field']>;
};

export type ColGroupDefExt = ColGroupDef & {
  groupId: NonNullable<ColGroupDef['groupId']>;
  children?: (ColDefExt | ColGroupDefExt)[];
};

export type ComposedColDef = TrackingSettings & {
  id: string; // colId || field
  index?: number;
};

export type ComposedColGroupDef = TrackingSettings & {
  groupId: NonNullable<ColGroupDef['groupId']>;
  index?: number;
  children?: (ComposedColDef | ComposedColGroupDef)[];
};

export type Columns = (ColDefExt | ColGroupDefExt)[];

export type ColDefEx<D, C> = Omit<ColDef<D>, 'colId'> & {
  colId: C;
  field: NonNullable<ColDef['field']>;
};

export type ColGroupDefEx<D, C, G> = Omit<ColGroupDef<D>, 'groupId' | 'children'> & {
  groupId: G;
  children: ColumnsEx<D, C, G>;
};

export type ColumnsEx<D, C, G = void> = (ColDefEx<D, C> | ColGroupDefEx<D, C, G>)[];
