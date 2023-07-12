import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GridApi, ICellRendererParams, ProcessCellForExportParams } from '@ag-grid-community/core';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { NotificationPageItem } from '@carrier-io/lynx-fleet-types';
import { DateRange as DateRangeType } from '@carrier-io/fds-react/DateTime/DateRangePicker';
import { getFileNameToExport } from '@carrier-io/lynx-fleet-common';

import { translateNotificationRuleConditionType } from '../../utils';
import { EditNotificationDialog } from '../EditNotificationDialog';
import { DeleteNotificationConfirmationDialog } from '../DeleteNotification';
import { updateNotificationAction } from '../../stores';
import { selectConvertedNotifications } from '../../stores/selectors';

import { getDefaultNotificationsTableColumns } from './columns';
import { ActionsMenu, NotificationTableAction } from './ActionsMenu';
import { RuleRenderer, StatusRenderer, EmailRenderer, ActionsRenderer } from './column-renderers';
import { NotificationRuleViewAction, RuleView } from './RuleView';

import { applyComposedColumnsUserSettings } from '@/utils/saved-columns';
import { companyActionPayload } from '@/features/authorization';
import { Table, PrivacyRenderer, dateTimeFormatter } from '@/components';
import { useAppDispatch, useAppSelector } from '@/stores';
import { useUserSettings } from '@/providers/UserSettings';
import { useToggle } from '@/hooks';
import { getAuthTenantId } from '@/features/authentication';
import { defExcelSheetPageSetup } from '@/constants';
import { useTableSaveColumns } from '@/utils';

export interface NotificationsTableProps {
  exportCsv: boolean;
  exportExcel: boolean;
  headerContent: JSX.Element;
  searchText: string;
  dateRange: DateRangeType<Date>;
}

export function NotificationsTable({
  exportCsv,
  exportExcel,
  headerContent,
  searchText,
  dateRange,
}: NotificationsTableProps) {
  const { t } = useTranslation();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { notificationsColumns, timezone, dateFormat } = userSettings;
  const dispatch = useAppDispatch();
  const { hasPermission } = useRbac();
  const notifications = useAppSelector((state) => selectConvertedNotifications(state, dateRange));
  const tenantId = useAppSelector(getAuthTenantId);

  const {
    value: openEditNotificationDialog,
    toggleOn: handleOpenEditNotificationDialog,
    toggleOff: handleCloseEditNotificationDialog,
  } = useToggle(false);
  const {
    value: openDeleteNotificationDialog,
    toggleOn: handleOpenDeleteNotificationDialog,
    toggleOff: handleCloseDeleteNotificationDialog,
  } = useToggle(false);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [currentRecord, setCurrentRecord] = useState<{
    notificationId: string;
    anchor: HTMLElement | null;
  }>({
    notificationId: '',
    anchor: null,
  });
  const [ruleViewRecord, setRuleViewRecord] = useState<{
    anchor: HTMLElement | null;
    notification?: NotificationPageItem;
  }>({
    anchor: null,
  });

  const hasNotificationEditPermission = hasPermission(companyActionPayload('notification.edit', tenantId));
  const hasNotificationDeletePermission = hasPermission(
    companyActionPayload('notification.delete', tenantId)
  );
  const showActionsColumn = hasNotificationEditPermission || hasNotificationDeletePermission;

  const defaultColumns = getDefaultNotificationsTableColumns(t, dateFormat, showActionsColumn, timezone);
  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, notificationsColumns),
    [notificationsColumns, defaultColumns]
  );

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'notificationsColumns',
  });

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

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

  const resetCurrentRecordAnchor = () => {
    setCurrentRecord({ ...currentRecord, anchor: null });
  };

  const isNotificationActive = (notificationId: NotificationPageItem['notificationId']): boolean =>
    notifications?.find((item) => item.notificationId === notificationId)?.active ?? false;

  const handleActiveToggle = () => {
    const { notificationId } = currentRecord;
    const isActive = !isNotificationActive(notificationId);

    setCurrentRecord({ notificationId, anchor: null });

    dispatch(
      updateNotificationAction({
        notificationId,
        active: isActive,
      })
    );
  };

  const handleActionsMenuCallback = (action: NotificationTableAction): void => {
    switch (action) {
      case 'CLOSE':
        resetCurrentRecordAnchor();
        break;

      case 'DELETE':
        resetCurrentRecordAnchor();
        handleOpenDeleteNotificationDialog();
        break;

      case 'EDIT':
        resetCurrentRecordAnchor();
        handleOpenEditNotificationDialog();
        break;

      case 'TOGGLE':
        handleActiveToggle();
        break;

      default:
        break;
    }
  };

  const processCellCallback = useCallback(
    (params: ProcessCellForExportParams): string => {
      const { column, value } = params;

      switch (column.getColId()) {
        case 'rule':
        case 'type':
          return translateNotificationRuleConditionType(t, value?.condition?.type);

        case 'active':
          return value ? t('common.active') : t('common.inactive');

        case 'sendEmail':
          return value ? t('common.yes') : t('common.no');

        case 'createdAt':
        case 'updatedAt':
          return dateTimeFormatter(value, { dateFormat, timezone });

        default:
          break;
      }

      return value;
    },
    [t, dateFormat, timezone]
  );

  useEffect(() => {
    if (exportCsv) {
      gridApi?.exportDataAsCsv({
        fileName: `${getFileNameToExport(t('notifications.notifications'))}.csv`,
        processCellCallback,
      });
    }
  }, [exportCsv, gridApi, processCellCallback, t]);

  useEffect(() => {
    if (exportExcel) {
      gridApi?.exportDataAsExcel({
        fileName: `${getFileNameToExport(t('notifications.notifications'))}.xlsx`,
        sheetName: t('notifications.notifications'),
        pageSetup: defExcelSheetPageSetup,
        processCellCallback,
      });
    }
  }, [exportExcel, gridApi, processCellCallback, t]);

  const handleActionMenuStateChange = useCallback((anchor: HTMLElement | null, notificationId: string) => {
    setCurrentRecord({ anchor, notificationId });
  }, []);

  const handleRuleViewChange = useCallback(
    (anchor: HTMLElement | null, notification: NotificationPageItem | undefined) => {
      setRuleViewRecord({ anchor, notification });
    },
    []
  );

  const resetRuleViewRecord = () => {
    setRuleViewRecord({
      anchor: null,
    });
  };

  const handleRuleViewCallback = (action: NotificationRuleViewAction): void => {
    switch (action) {
      case 'CLOSE':
        resetRuleViewRecord();
        break;

      case 'EDIT':
        if (ruleViewRecord.notification?.notificationId) {
          setCurrentRecord({ anchor: null, notificationId: ruleViewRecord.notification.notificationId });
        }
        resetRuleViewRecord();
        handleOpenEditNotificationDialog();
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Table
        headerProps={{
          sx: {
            justifyContent: 'end',
            borderBottom: 1,
            borderColor: 'addition.divider',
          },
        }}
        headerContent={headerContent}
        columnDefs={savedColumns}
        components={{
          EmailRenderer,
          StatusRenderer,
          RuleRenderer: (params: ICellRendererParams) =>
            RuleRenderer(params, {
              onRuleViewChange: handleRuleViewChange,
            }),
          ActionsRenderer: (params: ICellRendererParams) =>
            ActionsRenderer(params, {
              onStateChange: handleActionMenuStateChange,
            }),
          PrivacyRenderer,
        }}
        getMainMenuItems={getMainMenuItems}
        getRowId={(row) => row.data.notificationId}
        onColumnMoved={onColumnsChanged}
        onColumnPinned={onColumnsChanged}
        onColumnVisible={onColumnsChanged}
        onSortChanged={onColumnsChanged}
        onColumnResized={onColumnsChangedDebounced}
        onGridReady={onGridReady}
        rowData={notifications}
        resizeColumnsToFit
        defaultColDef={{
          suppressSizeToFit: true,
        }}
        quickFilterText={searchText}
      />
      {openEditNotificationDialog && (
        <EditNotificationDialog
          onClose={handleCloseEditNotificationDialog}
          notificationId={currentRecord.notificationId}
        />
      )}
      {openDeleteNotificationDialog && (
        <DeleteNotificationConfirmationDialog
          onClose={handleCloseDeleteNotificationDialog}
          notificationId={currentRecord.notificationId}
        />
      )}
      {currentRecord.anchor && (
        <ActionsMenu
          anchor={currentRecord.anchor}
          active={isNotificationActive(currentRecord.notificationId)}
          hasNotificationEditPermission={hasNotificationEditPermission}
          hasNotificationDeletePermission={hasNotificationDeletePermission}
          onCallback={handleActionsMenuCallback}
        />
      )}
      {ruleViewRecord.anchor && ruleViewRecord.notification && (
        <RuleView
          anchor={ruleViewRecord.anchor}
          notification={ruleViewRecord.notification}
          hasNotificationEditPermission={hasNotificationEditPermission}
          onCallback={handleRuleViewCallback}
        />
      )}
    </>
  );
}
