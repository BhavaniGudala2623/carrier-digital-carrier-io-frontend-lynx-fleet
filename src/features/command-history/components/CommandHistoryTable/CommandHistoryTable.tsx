import { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { GridApi, ProcessCellForExportParams } from '@ag-grid-community/core';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { DateRange as DateRangeType } from '@carrier-io/fds-react/DateTime/DateRangePicker';
import Box from '@carrier-io/fds-react/Box';
import { getFileNameToExport } from '@carrier-io/lynx-fleet-common';

import { CommandHistoryPageItem } from '../../types';

import { getDefaultCommandHistoryTableColumns } from './columns';
import { StatusRenderer, AssetNameRenderer, responseFormatter, ValueRenderer } from './column-formatters';
import { getCompartmentAndValueText } from './column-formatters/ValueRenderer';

import { dateTimeFormatter, PrivacyRenderer } from '@/components/formatters';
import { Table } from '@/components/Table';
import { useUserSettings } from '@/providers/UserSettings';
import { applyComposedColumnsUserSettings } from '@/utils/saved-columns';
import { defExcelSheetPageSetup } from '@/constants';
import { ExportButton, Loader } from '@/components';
import { getAuthTenantId } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { HasPermission } from '@/features/authorization';
import { useTableSaveColumns } from '@/utils';

interface CommandHistoryTableProps {
  data: Maybe<CommandHistoryPageItem[]>;
  dateRange: DateRangeType<Date>;
  searchText: string;
  isHistoryLoading: boolean;
}

export const CommandHistoryTable = ({
  isHistoryLoading,
  data,
  dateRange,
  searchText,
}: CommandHistoryTableProps) => {
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { temperature, commandHistoryColumns, timezone, dateFormat } = userSettings;
  const { t } = useTranslation();
  const tenantId = useAppSelector(getAuthTenantId);

  const defaultColumns = getDefaultCommandHistoryTableColumns(t, dateFormat, temperature, timezone);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, commandHistoryColumns),
    [commandHistoryColumns, defaultColumns]
  );

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'commandHistoryColumns',
  });

  const resetColumnsLabel: string = t('common.reset-columns');

  const getMainMenuItems = () => [
    'pinSubMenu',
    'separator',
    'autoSizeThis',
    'autoSizeAll',
    'separator',
    {
      name: resetColumnsLabel,
      action: onResetColumnsState,
    },
  ];

  const processCellCallback = (params: ProcessCellForExportParams): string => {
    const { column, value } = params;

    switch (column.getColId()) {
      case 'status':
        return t(`command-history.command-status.${value.toLowerCase()}`);

      case 'value':
        return getCompartmentAndValueText(temperature, params, t, true);

      case 'createdOn':
      case 'sentOn':
      case 'responseOn':
        return dateTimeFormatter(value, { dateFormat, timezone });

      case 'response':
        return responseFormatter(value, params.node?.data?.status);

      default:
        break;
    }

    return value;
  };

  const handleCsvExport = () => {
    gridApi?.exportDataAsCsv({
      fileName: `${getFileNameToExport(
        t('company.management.command-history'),
        `${dateRange[0]?.toLocaleString()}-${dateRange[1]?.toLocaleString()}`
      )}.csv`,
      processCellCallback,
    });
  };

  const handleExcelExport = () => {
    gridApi?.exportDataAsExcel({
      fileName: `${getFileNameToExport(
        t('company.management.command-history'),
        `${dateRange[0]?.toLocaleString()}-${dateRange[1]?.toLocaleString()}`
      )}.xlsx`,
      sheetName: t('company.management.command-history'),
      pageSetup: defExcelSheetPageSetup,
      processCellCallback,
    });
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <>
        {isHistoryLoading && <Loader overlay />}
        <Table
          columnDefs={savedColumns}
          getMainMenuItems={getMainMenuItems}
          getRowId={(row) => row.data.createdOn}
          onColumnMoved={onColumnsChanged}
          onColumnPinned={onColumnsChanged}
          onColumnVisible={onColumnsChanged}
          onGridReady={onGridReady}
          onSortChanged={onColumnsChanged}
          onColumnResized={onColumnsChangedDebounced}
          loadingOverlayComponent={null}
          quickFilterText={searchText}
          defaultColDef={{
            suppressSizeToFit: true,
          }}
          components={{
            AssetNameRenderer,
            PrivacyRenderer,
            StatusRenderer,
            ValueRenderer,
          }}
          rowData={data}
          headerContent={
            <Box textAlign="right" flex="1">
              <HasPermission action="2WayCmd.historyReportExport" subjectType="COMPANY" subjectId={tenantId}>
                <ExportButton onExportCsv={handleCsvExport} onExportExcel={handleExcelExport} />
              </HasPermission>
            </Box>
          }
          HeaderProps={{
            borderBottom: 1,
            borderColor: 'addition.divider',
          }}
          resizeColumnsToFit
        />
      </>
    </Box>
  );
};
