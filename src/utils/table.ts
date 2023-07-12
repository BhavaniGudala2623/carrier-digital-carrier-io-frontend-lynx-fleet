import { debounce, omit } from 'lodash-es';
import type { ColDef, ColGroupDef } from '@ag-grid-community/core';
import {
  ColumnMovedEvent,
  ColumnPinnedEvent,
  ColumnResizedEvent,
  ColumnVisibleEvent,
  SortChangedEvent,
  GridApi,
} from '@ag-grid-community/core';
import { Maybe, User } from '@carrier-io/lynx-fleet-types';

import { composeColumnsUserSettings } from '@/utils/saved-columns';
import { Columns, ComposedColDef, ComposedColGroupDef, trackingSettings } from '@/types';

interface TableColumnConfig {
  columns: string[] | undefined;
}

export function resolveColumns(columnList: TableColumnConfig, defaultColumnList: (ColDef | ColGroupDef)[]) {
  if (!columnList) {
    return defaultColumnList;
  }

  const savedColumns: (ColDef | ColGroupDef)[] = [];

  columnList?.columns?.forEach((column) => {
    // Columns in correct new order, but without functions like valueFormatter
    const columnJSON = JSON.parse(column);

    // Find matching default column from original list
    const outputColumn = defaultColumnList.find((defaultColumn: ColDef | ColGroupDef) => {
      if ((defaultColumn as ColDef).colId) {
        return (defaultColumn as ColDef).colId === columnJSON.colId;
      }

      if ((defaultColumn as ColDef).field) {
        return (defaultColumn as ColDef).field === columnJSON.field;
      }

      if ((defaultColumn as ColGroupDef).headerName) {
        return (defaultColumn as ColGroupDef).headerName === columnJSON.headerName;
      }

      return null;
    });

    // Get default column (in new order) with functions and overlay sort, hide, and pinned settings and push to savedColumns array
    if (outputColumn) {
      savedColumns.push({
        ...outputColumn,
        sort: columnJSON.sort,
        sortIndex: columnJSON.sortIndex,
        width: parseInt(columnJSON.width, 10),
        hide: columnJSON.hide,
        pinned: columnJSON.pinned,
      });
    }
  });

  // Safety mechanism to prevent all columns from disappearing in case of corrupted or empty columnList input
  if (savedColumns.length === 0) {
    savedColumns.push(defaultColumnList[0]);
  }

  return savedColumns;
  // return defaultColumnList;
}

interface SaveColumnsWithAutoHideConfig {
  onSaveColumn: (key: string, value: unknown) => void;
  gridApi: Maybe<GridApi>;
  defaultColumns: Columns;
  columnsSettingKey: keyof Pick<
    User,
    | 'assetListColumns'
    | 'commandHistoryColumns'
    | 'geofenceListColumns'
    | 'temperatureChartColumns'
    | 'assetHistoryColumns'
    | 'deviceProvisioningColumns'
    | 'wirelessSensorsColumns'
    | 'deviceCommissioningSensorsColumns'
    | 'deviceCommissioningDatacoldSensorsColumns'
    | 'reportsColumns'
    | 'companiesColumns'
    | 'companiesParentsColumns'
    | 'companyAssetsColumns'
    | 'companyFleetsColumns'
    | 'companyUsersColumns'
    | 'companyGroupsColumns'
    | 'notificationsColumns'
    | 'assetTimelineColumns'
    | 'batteryNotificationsColumns'
  >;
  autoHiddenColumnsIds?: string[];
  userSettingsHideColumnsMap?: Record<string, boolean>;
}

type SaveTableColumnsConfig = Pick<
  SaveColumnsWithAutoHideConfig,
  'onSaveColumn' | 'gridApi' | 'defaultColumns' | 'columnsSettingKey'
>;

export const getTrackingSettingType = (
  params: ColumnMovedEvent | ColumnPinnedEvent | ColumnVisibleEvent | SortChangedEvent | ColumnResizedEvent
): (typeof trackingSettings)[number] | 'multiHide' | 'index' | 'Unknown' => {
  if (params.type === 'sortChanged' && params.source === 'uiColumnSorted') {
    return 'sort';
  }

  if (params.type === 'columnVisible' && params.source === 'toolPanelUi') {
    return 'hide';
  }

  if (params.type === 'columnVisible' && params.source === 'columnMenu') {
    return 'multiHide';
  }

  if (params.type === 'columnPinned' && params.source === 'contextMenu') {
    return 'pinned';
  }

  if (params.type === 'columnPinned' && params.source === 'uiColumnDragged') {
    return 'pinned';
  }

  if (params.type === 'columnResized' && params.source === 'uiColumnDragged') {
    return 'width';
  }

  if (params.type === 'columnMoved' && params.source === 'uiColumnDragged') {
    return 'index';
  }

  return 'Unknown';
};

const getManualChangedColumnVisibility = (
  params: ColumnVisibleEvent
): Maybe<{ id: string; hide: boolean }[]> => {
  const { columns } = params;
  if (!columns) {
    return null;
  }

  return columns.map((col) => ({ id: col.getColId(), hide: !col.isVisible() }));
};

const excludeAutoHiddenColumn = (autoHiddenColumnsIds: string[], composedColumns: string[]): string[] => {
  if (autoHiddenColumnsIds.length === 0) {
    return composedColumns;
  }

  const composedColumnsParsed: (ComposedColDef | ComposedColGroupDef)[] = composedColumns.map((c) =>
    JSON.parse(c)
  );

  const composedColumnsFiltered = composedColumnsParsed.map((col) => {
    if ('children' in col) {
      return {
        ...col,
        children: col.children
          ? [
              ...col.children.map((c) =>
                'id' in c && 'hide' in c && c.hide === true && autoHiddenColumnsIds.includes(c.id)
                  ? omit(c, 'hide')
                  : c
              ),
            ]
          : [],
      };
    }

    return 'id' in col && 'hide' in col && col.hide === true && autoHiddenColumnsIds.includes(col.id)
      ? omit(col, 'hide')
      : col;
  });

  return composedColumnsFiltered.map((e) => JSON.stringify(e));
};

export const getHideColumnsMap = (columnsSettings: string[]): Record<string, boolean> => {
  if (columnsSettings.length === 0) {
    return {};
  }

  const columnsSettingsParsed: (ComposedColDef | ComposedColGroupDef)[] = columnsSettings.map((c) =>
    JSON.parse(c)
  );

  return columnsSettingsParsed.reduce((acc, col) => {
    if ('children' in col) {
      const childrenMap: Record<string, boolean> = col.children
        ? col.children.reduce(
            (res, child) =>
              'hide' in child && 'id' in child ? { ...res, [child.id]: !!child.hide } : { ...res },
            {} as Record<string, boolean>
          )
        : {};

      return { ...acc, ...childrenMap };
    }

    return { ...acc, ...('hide' in col && 'id' in col ? { [col.id]: !!col.hide } : {}) };
  }, {});
};

const saveSettings = ({
  gridApi,
  defaultColumns,
  userSettingsHideColumnsMap,
  manualChangedColumnVisibility,
  autoHiddenColumnsIds = [],
  onSaveColumn,
  columnsSettingKey,
}: Pick<
  SaveColumnsWithAutoHideConfig,
  | 'gridApi'
  | 'defaultColumns'
  | 'userSettingsHideColumnsMap'
  | 'autoHiddenColumnsIds'
  | 'onSaveColumn'
  | 'columnsSettingKey'
> & {
  manualChangedColumnVisibility?: Maybe<{ id: string; hide: boolean }[]>;
}) => {
  const newColumnDefs = gridApi?.getColumnDefs();

  if (!newColumnDefs) {
    return;
  }

  const composedColumns = composeColumnsUserSettings({
    defaultColumns,
    changedColumns: newColumnDefs,
    userSettingsHideColumnsMap,
    manualChangedColumnVisibility,
  });
  const composedColumnsFiltered = excludeAutoHiddenColumn(autoHiddenColumnsIds, composedColumns);

  const saveColumnsPayload = [
    {
      name: 'default',
      columns: autoHiddenColumnsIds.length === 0 ? composedColumns : composedColumnsFiltered,
    },
  ];
  onSaveColumn(columnsSettingKey, saveColumnsPayload);
};

export const useTableSaveColumnsWithAutoHide = ({
  onSaveColumn,
  gridApi,
  defaultColumns,
  columnsSettingKey,
  autoHiddenColumnsIds = [],
  userSettingsHideColumnsMap = {},
}: SaveColumnsWithAutoHideConfig) => {
  const onColumnsChanged = (
    params: ColumnMovedEvent | ColumnPinnedEvent | ColumnVisibleEvent | SortChangedEvent | ColumnResizedEvent
  ) => {
    const trackingSettingType = getTrackingSettingType(params);
    if (trackingSettingType === 'Unknown') {
      return;
    }

    if ((trackingSettingType === 'hide' || trackingSettingType === 'multiHide') && 'columns' in params) {
      const manualChangedColumnVisibility = getManualChangedColumnVisibility(params);
      const manualChangedColumnVisibilityIds = manualChangedColumnVisibility?.map((c) => c.id) || [];
      const autoHiddenColumnsIdsFiltered = autoHiddenColumnsIds.filter(
        (id) => !manualChangedColumnVisibilityIds.includes(id)
      );

      saveSettings({
        gridApi,
        onSaveColumn,
        columnsSettingKey,
        defaultColumns,
        autoHiddenColumnsIds: autoHiddenColumnsIdsFiltered,
        userSettingsHideColumnsMap,
        manualChangedColumnVisibility,
      });

      return;
    }

    saveSettings({
      gridApi,
      onSaveColumn,
      columnsSettingKey,
      defaultColumns,
      autoHiddenColumnsIds,
      userSettingsHideColumnsMap,
    });
  };

  const onColumnsChangedDebounced = debounce(onColumnsChanged, 300);

  const onResetColumnsState = () => {
    const defaultColumnsConfig = [
      {
        name: 'default',
        columns: [],
      },
    ];

    gridApi?.setColumnDefs([]); // to force column defs update
    gridApi?.setColumnDefs(defaultColumns);

    onSaveColumn(columnsSettingKey, defaultColumnsConfig);
  };

  return { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState };
};

export const useTableSaveColumns = ({
  onSaveColumn,
  gridApi,
  defaultColumns,
  columnsSettingKey,
}: SaveTableColumnsConfig) => {
  const onColumnsChanged = (
    params: ColumnMovedEvent | ColumnPinnedEvent | ColumnVisibleEvent | SortChangedEvent | ColumnResizedEvent
  ) => {
    if (getTrackingSettingType(params) === 'Unknown') {
      return;
    }

    const newColumnDefs = gridApi?.getColumnDefs();
    if (!newColumnDefs) {
      return;
    }

    const composedColumns = composeColumnsUserSettings({
      defaultColumns,
      changedColumns: newColumnDefs,
    });

    const saveColumnsPayload = [
      {
        name: 'default',
        columns: composedColumns,
      },
    ];
    onSaveColumn(columnsSettingKey, saveColumnsPayload);
  };

  const onColumnsChangedDebounced = debounce(onColumnsChanged, 300);

  const onResetColumnsState = () => {
    const defaultColumnsConfig = [
      {
        name: 'default',
        columns: [],
      },
    ];

    gridApi?.setColumnDefs([]); // to force column defs update
    gridApi?.setColumnDefs(defaultColumns);

    onSaveColumn(columnsSettingKey, defaultColumnsConfig);
  };

  return { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState };
};
