import AgGrid, { AgGridProps } from '@carrier-io/fds-react/AgGrid';
import { LicenseManager } from '@ag-grid-enterprise/core';
import { AgGridReactProps } from '@ag-grid-community/react';
import { BoxProps } from '@carrier-io/fds-react/Box';
import { PaperProps } from '@carrier-io/fds-react/Paper';
import { useTranslation } from 'react-i18next';

import { registerModules } from './modules';
import { LoadingOverlay } from './LoadingOverlay';

import './tableUtilityClasses.scss';
import { DEFAULT_COLUMN_WIDTH } from '@/constants';
import { getAgGridLocaleText, getNoRowsTemplate } from '@/utils';

if (typeof process.env.REACT_APP_AG_GRID_ENTERPRISE_KEY === 'string') {
  LicenseManager.setLicenseKey(process.env.REACT_APP_AG_GRID_ENTERPRISE_KEY);
}

export type TableProps = {
  resizeColumnsToFit?: boolean;
  headerContent?: JSX.Element;
  headerProps?: BoxProps;
  paperProps?: PaperProps;
} & AgGridProps &
  AgGridReactProps;

export function Table({
  resizeColumnsToFit = false,
  headerContent,
  headerProps,
  paperProps,
  components,
  defaultColDef,
  ...restProps
}: TableProps) {
  registerModules();
  const { t } = useTranslation();

  const defaultExportParams = { allColumns: true };

  return (
    <AgGrid
      HeaderProps={headerProps}
      PaperProps={paperProps}
      TableWrapperProps={{
        sx: {
          // it allows to use ellipsis in columns
          '& .ag-header-cell .ag-header-cell-comp-wrapper': {
            width: '100%',
          },
          '& .ag-header-group-cell-label .MuiIconButton-root': {
            fontSize: '18px',
          },
        },
      }}
      headerContent={headerContent}
      defaultColDef={{
        minWidth: DEFAULT_COLUMN_WIDTH,
        cellStyle: { textAlign: 'left' },
        menuTabs: ['generalMenuTab', 'columnsMenuTab'],
        ...defaultColDef,
      }}
      components={{
        LoadingOverlay,
        ...components,
      }}
      loadingOverlayComponent="LoadingOverlay"
      resizeColumnsToFit={resizeColumnsToFit}
      immutableData={undefined}
      enableCellTextSelection
      suppressContextMenu
      defaultExcelExportParams={defaultExportParams}
      defaultCsvExportParams={defaultExportParams}
      tooltipShowDelay={0.5}
      localeText={getAgGridLocaleText(t)}
      overlayNoRowsTemplate={getNoRowsTemplate(t)}
      {...restProps}
    />
  );
}
