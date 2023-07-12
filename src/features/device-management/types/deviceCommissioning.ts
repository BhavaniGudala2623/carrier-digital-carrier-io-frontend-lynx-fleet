import { ColDef, ColGroupDef } from '@ag-grid-community/core';

export type ParamsProps = {
  // eslint-disable-next-line
  value: any;
  data: {
    // eslint-disable-next-line
    [key: string]: any;
    changedFields?: Set<string>;
  };
  // eslint-disable-next-line
  [key: string]: any;
};

export const NOT_INSTALLED = 'NOT_INSTALLED';
export type IColDefColGroupDef = ColDef | ColGroupDef;

export type SectionId = 'device' | 'asset' | 'sensors' | 'datacold' | 'notes';

export interface Section {
  id: SectionId;
  title: string;
}
