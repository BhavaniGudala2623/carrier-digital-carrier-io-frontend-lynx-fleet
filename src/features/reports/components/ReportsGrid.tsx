/**
 * Generic AG grid results component for both
 * My Scheduled Reports and All Scheduled Reports
 */
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridApi } from '@ag-grid-community/core';
import Box from '@carrier-io/fds-react/Box';

import { reportGridColumnDefs } from '../utils';
import { ScheduledPlan } from '../types';

import {
  DeleteCellRenderer,
  RecipientCellRenderer,
  RecurrenceCellRenderer,
  ReportNameCellRenderer,
} from './column-renderers';
import { DeleteReportPopover } from './DeleteReportPopover';

import { Table } from '@/components';
import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';
import { useToggle } from '@/hooks';
import { LookerUserContext } from '@/features/reports';

export type ReportsGridProps = {
  data: ScheduledPlan[] | null;
};

export const ReportsGrid = ({ data }: ReportsGridProps) => {
  const { state: lookerState } = useContext(LookerUserContext);
  const { t } = useTranslation();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { reportsColumns, timezone, dateFormat } = userSettings;
  const [deleteId, setDeleteId] = useState<number | string>('');
  const [gridData, setGridData] = useState<ScheduledPlan[] | null>(data);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const {
    value: isDeleteReportOpen,
    toggleOn: handleOpenDeleteReportDialog,
    toggleOff: handleCloseDeleteReportDialog,
  } = useToggle(false);

  /**
   * cancelling the scheduled plan delete modal
   */
  const handleCancelClick = () => {
    setDeleteId('');
    handleCloseDeleteReportDialog();
  };

  /**
   * Handling the trash can click in the cell, which sets the ID of the
   * scheduled plan to be deleted.
   * @param planId
   */
  const handleDeleteClick = (planId: string | number) => {
    if (planId) {
      setDeleteId(planId);
      handleOpenDeleteReportDialog();
    }
  };

  /**
   * Callback for scheduled plan delete success.
   * We're not refreshing the grid here, persay...we're just removing the row with the matching
   * scheduled plan ID.
   * Manual refresh or next visit should clear it out permanently
   * @param planId
   */
  const handleDeleteSuccess = (planId: string | number) => {
    if (planId) {
      const newData = gridData?.filter((f) => f.id !== planId);
      setGridData(newData || []);
    }
  };

  const defaultColumns = reportGridColumnDefs(lookerState, handleDeleteClick, t, dateFormat, timezone);
  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, reportsColumns),
    [reportsColumns, defaultColumns]
  );

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'reportsColumns',
  });

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

  const onFirstDataRendered = useCallback(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi]);

  const getMainMenuItems = () => [
    'pinSubMenu',
    'separator',
    'autoSizeThis',
    'autoSizeAll',
    'separator',
    {
      name: t('common.reset-columns'),
      action: onResetColumnsState,
    },
  ];

  return (
    <>
      <Box height="100%" width="100%">
        {gridData && (
          <Table
            rowData={gridData}
            components={{
              deleteCellRenderer: DeleteCellRenderer,
              recipientCellRenderer: RecipientCellRenderer,
              recurrenceCellRenderer: RecurrenceCellRenderer,
              reportNameCellRenderer: ReportNameCellRenderer,
            }}
            columnDefs={savedColumns}
            onGridReady={onGridReady}
            onColumnMoved={onColumnsChanged}
            onColumnPinned={onColumnsChanged}
            onColumnVisible={onColumnsChanged}
            onSortChanged={onColumnsChanged}
            onColumnResized={onColumnsChangedDebounced}
            defaultColDef={{
              suppressSizeToFit: true,
            }}
            resizeColumnsToFit
            onFirstDataRendered={onFirstDataRendered}
            getMainMenuItems={getMainMenuItems}
            overlayNoRowsTemplate={`<span style="padding: 10px; border: 2px solid #9d9d9d; background: #fff; border-radius: 4px;">${t(
              'assets.reports.no-reports-to-show-at-this-time'
            )}</span>`}
            tooltipShowDelay={0}
          />
        )}
      </Box>
      {isDeleteReportOpen && (
        <DeleteReportPopover
          onCancelClick={handleCancelClick}
          lookerAccessToken={lookerState?.user?.accessToken}
          onDeleteSuccess={handleDeleteSuccess}
          scheduledPlanId={deleteId}
        />
      )}
    </>
  );
};
