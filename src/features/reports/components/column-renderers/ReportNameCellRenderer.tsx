/**
 * A special tooltip cell renderer for the recipients in the <ReportGrid>
 */
import { ICellRendererParams } from '@ag-grid-community/core';

import { TableCellLink } from '@/components';

export function ReportNameCellRenderer({ data, value }: ICellRendererParams): JSX.Element {
  let display = value;
  const parts = value.split('__');

  if (parts.length >= 3) {
    [, display] = parts;
  }

  const url =
    data.lookml_dashboard_id && !data.dashboard_id
      ? `/reports/running-hours/${data.lookml_dashboard_id}${data.filters_string || ''}`
      : `/reports/${data.dashboard_id}`;

  return <TableCellLink to={url}>{display}</TableCellLink>;
}
