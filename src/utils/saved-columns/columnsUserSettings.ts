import type { ColDef, ColGroupDef } from '@ag-grid-community/core';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import type { SavedColumns } from '@/providers/UserSettings';
import {
  ColDefExt,
  ColGroupDefExt,
  Columns,
  ComposedColDef,
  ComposedColGroupDef,
  trackingSettings,
} from '@/types';
import { DEFAULT_COLUMN_WIDTH } from '@/constants';

function getIdKey(colId?: string) {
  return colId ? 'colId' : 'field';
}

export function isColGroupGuard(
  column: ColDef | ColGroupDef | ColDefExt | ColGroupDefExt
): column is ColGroupDefExt {
  return !!(column as ColGroupDefExt).groupId;
}

export function isColNotGroupGuard(
  column: ColDef | ColGroupDef | ColDefExt | ColGroupDefExt
): column is ColDefExt {
  return !('groupId' in column);
}

function isColComposedGroupGuard(
  columnComposed: ComposedColDef | ComposedColGroupDef
): columnComposed is ComposedColGroupDef {
  return !!(columnComposed as ColGroupDefExt).groupId;
}

function isApplyingOnTopRecursionLevelGuard(
  composedColumns: SavedColumns | (ComposedColDef | ComposedColGroupDef)[]
): composedColumns is SavedColumns {
  return !!composedColumns?.[0] && 'name' in composedColumns[0] && 'columns' in composedColumns[0];
}

type ComposeColumnsUserSettingsType = {
  defaultColumns: Columns;
  changedColumns: (ColDef | ColGroupDef)[];
  userSettingsHideColumnsMap?: Record<string, boolean>;
  manualChangedColumnVisibility?: Maybe<{ id: string; hide: boolean }[]>;
  _insideRecursion?: boolean;
};

export const composeColumnsUserSettings = ({
  defaultColumns,
  changedColumns,
  userSettingsHideColumnsMap = {} as Record<string, boolean>,
  manualChangedColumnVisibility,
  _insideRecursion,
}: ComposeColumnsUserSettingsType): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const composedColumns: any[] = [];

  for (const [indexString, defaultColumn] of Object.entries(defaultColumns)) {
    const index = Number(indexString);
    if (isColGroupGuard(defaultColumn)) {
      // If column is a group with another columns in children - check recursively each child
      const { children } = defaultColumn;

      if (!children.length) {
        continue;
      }

      let changedIndex: number | undefined;

      const changedColumn = changedColumns.find((column, i) => {
        if ('groupId' in column && column.groupId === defaultColumn.groupId) {
          changedIndex = i;

          return true;
        }

        return false;
      });

      if (!changedColumn || !isColGroupGuard(changedColumn)) {
        continue;
      }

      const { children: changedChildren } = changedColumn;

      const composedGroupColumns = composeColumnsUserSettings({
        defaultColumns: children,
        changedColumns: changedChildren,
        userSettingsHideColumnsMap,
        manualChangedColumnVisibility,
        _insideRecursion: true,
      });

      if (composedGroupColumns.length || changedIndex !== index) {
        composedColumns.push({
          groupId: defaultColumn.groupId,
          index: changedIndex,
          children: composedGroupColumns,
        });
      }
    } else {
      // If column is not a group
      const idKey = getIdKey(defaultColumn.colId);

      let changedIndex: number;

      const changedColumn = changedColumns.find((column, i) => {
        // If there is no 'colId' in the default config - AG-Grid will create it with a 'field' value
        if ('colId' in column && column.colId === defaultColumn[idKey]) {
          changedIndex = i;

          return true;
        }

        return false;
      });

      if (!changedColumn || !isColNotGroupGuard(changedColumn)) {
        continue;
      }

      const newColumnSettings = trackingSettings.reduce(
        (acc, trackingKey) => {
          if (trackingKey === 'hide') {
            const columnId = changedColumn[idKey] || '';
            if (
              manualChangedColumnVisibility &&
              manualChangedColumnVisibility.map((c) => c.id).includes(columnId)
            ) {
              acc[trackingKey] = manualChangedColumnVisibility.find((c) => c.id === columnId)!.hide;
              acc.index = changedIndex;
            } else if (columnId in userSettingsHideColumnsMap) {
              acc[trackingKey] = userSettingsHideColumnsMap[columnId];
              acc.index = changedIndex;
            }
            // Old logic
            if (defaultColumn[trackingKey] !== changedColumn[trackingKey]) {
              acc[trackingKey] = !!changedColumn[trackingKey];
              acc.index = changedIndex;
            }
          } else if (trackingKey === 'width') {
            if (
              changedColumn[trackingKey] &&
              Math.max(defaultColumn[trackingKey] || DEFAULT_COLUMN_WIDTH, defaultColumn.minWidth || 0) !==
                changedColumn[trackingKey]
            ) {
              acc[trackingKey] = changedColumn[trackingKey];
            }
          } else if (
            changedColumn[trackingKey] &&
            defaultColumn[trackingKey] !== changedColumn[trackingKey]
          ) {
            // @ts-ignore
            acc[trackingKey] = changedColumn[trackingKey];
          }

          if (index !== changedIndex) {
            acc.index = changedIndex;
          }

          return acc;
        },
        { id: defaultColumn[idKey] } as ComposedColDef
      );

      if (Object.keys(newColumnSettings).length > 1) {
        composedColumns.push(newColumnSettings);
      }
    }
  }

  return _insideRecursion ? composedColumns : composedColumns.map((e) => JSON.stringify(e));
};

export const applyComposedColumnsUserSettings = (
  defaultColumns: Columns,
  composedColumns: SavedColumns | (ComposedColDef | ComposedColGroupDef)[]
): Columns => {
  if (!composedColumns) {
    return defaultColumns;
  }

  let parsedColumns: (ComposedColDef | ComposedColGroupDef)[] | undefined;

  if (isApplyingOnTopRecursionLevelGuard(composedColumns)) {
    const savedColumnStrings = composedColumns.find((columnConfig) => columnConfig.name === 'default');
    try {
      parsedColumns = savedColumnStrings?.columns?.map((e) => JSON.parse(e));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Parsing error', e);

      return defaultColumns;
    }
  } else {
    parsedColumns = composedColumns;
  }

  if (!parsedColumns) {
    return defaultColumns;
  }

  const getSortingIndex = (column: Columns[number]) => {
    if ('groupId' in column) {
      const parsedColumn = parsedColumns?.find((e) => 'groupId' in e && e.groupId === column.groupId);
      if (parsedColumn?.index !== undefined) {
        return parsedColumn?.index;
      }
    } else {
      const idKey = getIdKey(column.colId);
      const parsedColumn = parsedColumns?.find((e) => 'id' in e && e.id === column[idKey]);
      if (parsedColumn?.index !== undefined) {
        return parsedColumn?.index;
      }
    }

    return undefined;
  };

  const defaultColumnsSorted = defaultColumns
    .map((e, i) => ({ ...e, indexOriginal: i }))
    .sort((a, b) => (getSortingIndex(a) ?? a.indexOriginal) - (getSortingIndex(b) ?? b.indexOriginal))
    .map(({ indexOriginal, ...e }) => e);

  const appliedColumns = [...defaultColumnsSorted];

  for (const [defaultIndex, defaultColumn] of Object.entries(defaultColumnsSorted)) {
    // If column is a group with another columns in children - check recursively each child
    if (isColGroupGuard(defaultColumn)) {
      const { children } = defaultColumn;

      if (!children.length) {
        continue;
      }

      const parsedColumn = parsedColumns.find(
        (column) => 'groupId' in column && column.groupId === defaultColumn.groupId
      );

      if (!parsedColumn || !isColComposedGroupGuard(parsedColumn)) {
        continue;
      }

      const { children: parsedChildren } = parsedColumn;

      const appliedComposedGroupColumns = applyComposedColumnsUserSettings(children, parsedChildren);

      const appliedColumnsGroup = {
        ...defaultColumn,
        children: appliedComposedGroupColumns,
      };

      appliedColumns[defaultIndex] = appliedColumnsGroup;
    } else {
      // If column is not a group
      const idKey = getIdKey(defaultColumn.colId);

      const parsedColumn = parsedColumns.find(
        (column) => 'id' in column && column.id === defaultColumn[idKey]
      );

      if (!parsedColumn || isColComposedGroupGuard(parsedColumn)) {
        continue;
      }

      const { id, index, ...parsedColumnApplicableFields } = parsedColumn;

      const appliedColumn = { ...defaultColumn, ...parsedColumnApplicableFields };

      appliedColumns[defaultIndex] = appliedColumn;
    }
  }

  return appliedColumns;
};
