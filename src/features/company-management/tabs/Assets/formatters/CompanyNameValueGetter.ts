import type { ValueGetterParams } from '@ag-grid-community/core';

export const CompanyNameValueGetter = ({ data }: ValueGetterParams) => {
  if (data?.tenant?.name) {
    return data.tenant.name;
  }

  if (data?.parent?.type === 'TENANT') {
    return data.parent?.name;
  }

  return null;
};
