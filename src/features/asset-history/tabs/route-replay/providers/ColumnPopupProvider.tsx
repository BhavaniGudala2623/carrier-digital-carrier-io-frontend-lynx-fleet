import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { Column } from '@ag-grid-community/core';
import { isEqual } from 'lodash-es';

import { RouteHistoryDefaultColIds } from '../types';
import { getAllColumnData, getSensorColumnsConfig } from '../utils';
import { useAssetHistoryPageContext } from '../../../providers';

import { useReplayTabDataContext } from './ReplayTabDataProvider';

import { useNullableContext } from '@/hooks';
import { useUserSettings } from '@/providers/UserSettings';
import { IColumn, IColumnData, IColumnGroup, TimelineHeaderDef } from '@/types';

type ColumnPopupContextValue = {
  groups: IColumnGroup[];
  addPopupColumns: (allColumnsData: Maybe<Column[]>) => void;
  toggleVisibility: (groupId: string, columnData: IColumnData) => void;
  setGroupVisible: (groupId: string, isVisible: boolean) => void;
  setAllColumnsVisible: (isVisible: boolean) => void;
  selectedGroups: string[];
  isAllSelected: boolean;
  popupColumnsConfig: IColumn[];
  visibleColumns: string[];
  sensorColumnsConfig: Record<RouteHistoryDefaultColIds, TimelineHeaderDef>;
  setViewPortWidth: (width: number) => void;
  viewPortColumnsWidth: number;
};

const ColumnPopupContext = createContext<Maybe<ColumnPopupContextValue>>(null);

export const useColumnPopupContext = () => useNullableContext(ColumnPopupContext);

export const ColumnPopupProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<IColumnGroup[]>([]);
  const { configuredFlespiFields } = useReplayTabDataContext();
  const { assetDetails } = useAssetHistoryPageContext();
  const {
    onUserSettingsChange,
    userSettings: { routeReplayVisibleColumns },
  } = useUserSettings();
  const [viewPortWidth, setViewPortWidth] = useState<number>(0);
  const sensorColumnsConfig = useMemo(
    () => getSensorColumnsConfig(configuredFlespiFields, assetDetails?.sensors),
    [assetDetails?.sensors, configuredFlespiFields]
  );

  const getGroupById = (groupId: string) => groups.find((group: IColumnGroup) => group.groupId === groupId);

  useEffect(() => {
    const allAssetColumns: string[] = groups.flatMap((item) => item.columnDataArr.map((el) => el.colId));

    const visibleAssetColumns: string[] = groups.flatMap((item) =>
      item.columnDataArr.filter((el) => el.isVisible).map((el) => el.colId)
    );

    const visibleColumns: string[] = [
      ...(routeReplayVisibleColumns?.filter((item) => !allAssetColumns.includes(item)) ?? []),
      ...visibleAssetColumns,
    ].sort();

    if (!isEqual(visibleColumns, routeReplayVisibleColumns)) {
      onUserSettingsChange('routeReplayVisibleColumns', visibleColumns);
    }
  }, [groups, onUserSettingsChange, routeReplayVisibleColumns]);

  const saveGroups = (group: IColumnGroup) => {
    const index = groups.findIndex((item: IColumnGroup) => item.groupId === group.groupId);
    if (index >= 0) {
      const newGroups = [...groups.slice(0, index), group, ...groups.slice(index + 1)];
      setGroups(newGroups);
    }
  };

  const updateColumns = (columns: IColumnGroup['columnDataArr'], columnToAdd: IColumnData) => {
    const colToUpdateIndex = columns.findIndex((columnData) => columnData.colId === columnToAdd.colId);
    if (colToUpdateIndex >= 0) {
      return [...columns.slice(0, colToUpdateIndex), columnToAdd, ...columns.slice(colToUpdateIndex + 1)];
    }

    return [...columns, columnToAdd];
  };

  const updateGroups = (initialGroups: IColumnGroup[], columnData: IColumnData): IColumnGroup[] => {
    const { groupId, ...dataToAdd } = columnData;
    const index = initialGroups.findIndex((group) => group.groupId === groupId);
    if (index >= 0) {
      const columns = updateColumns(initialGroups[index].columnDataArr, dataToAdd);

      return [
        ...initialGroups.slice(0, index),
        { groupId, columnDataArr: columns },
        ...initialGroups.slice(index + 1),
      ];
    }

    return [...initialGroups, { groupId, columnDataArr: [dataToAdd] }];
  };

  const addPopupColumns = (columns: Maybe<Column[]>) => {
    const allColumnData = getAllColumnData(columns, sensorColumnsConfig);
    if (!allColumnData || allColumnData.length === 0) {
      return;
    }

    let popupConfig: IColumnGroup[] = [];
    allColumnData.forEach((columnData: IColumnData) => {
      popupConfig = updateGroups(popupConfig, columnData);
    });

    const groupsWithVisibleColumns = popupConfig.map((item) => {
      const columnsArray = item.columnDataArr.map((column) => ({
        ...column,
        isVisible: routeReplayVisibleColumns?.includes(column.colId),
      }));

      return {
        groupId: item.groupId,
        columnDataArr: columnsArray,
      };
    });

    setGroups(groupsWithVisibleColumns);
  };

  const toggleVisibility = (groupId: string, columnData: IColumnData) => {
    const group = getGroupById(groupId);
    if (!group) {
      return;
    }
    const index = group?.columnDataArr.findIndex((data: IColumnData) => data.colId === columnData.colId);
    if (index >= 0) {
      const columnDataArr = [
        ...group.columnDataArr.slice(0, index),
        columnData,
        ...group.columnDataArr.slice(index + 1),
      ];
      saveGroups({ ...group, columnDataArr });
    }
  };

  const setGroupVisible = (groupId: string, isVisible: boolean) => {
    const group = getGroupById(groupId);
    if (group) {
      const columnDataArr = group.columnDataArr.map((colData: IColumnData) => ({ ...colData, isVisible }));
      saveGroups({ ...group, columnDataArr });
    }
  };

  const setAllColumnsVisible = (isVisible: boolean) => {
    const updatedGroups: IColumnGroup[] = [];
    groups.forEach((group: IColumnGroup) => {
      const columnDataArr = group.columnDataArr.map((colData: IColumnData) => ({ ...colData, isVisible }));
      updatedGroups.push({ groupId: group.groupId, columnDataArr });
    });
    setGroups(updatedGroups);
  };

  const selectedGroups = useMemo(() => {
    const filter: string[] = [];
    groups.forEach((group: IColumnGroup) => {
      if (group.columnDataArr.every((columnData: IColumnData) => columnData.isVisible) && group.groupId) {
        filter.push(group.groupId);
      }
    });

    return filter;
  }, [groups]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isAllSelected = useMemo(() => selectedGroups.length === groups.length, [selectedGroups]);

  const popupColumns = useMemo(() => {
    const allColumns: IColumn[] = [];
    const visibleColumns: string[] = [];
    groups.forEach((group: IColumnGroup) => {
      group.columnDataArr.forEach((columnData: IColumnData) => {
        allColumns.push({ colId: columnData.colId, isVisible: columnData.isVisible });
        if (columnData.isVisible) {
          visibleColumns.push(columnData.colId);
        }
      });
    });

    return { allColumns, visibleColumns };
  }, [groups]);

  const contextValue: ColumnPopupContextValue = useMemo(
    () => ({
      groups,
      addPopupColumns,
      toggleVisibility,
      setGroupVisible,
      setAllColumnsVisible,
      selectedGroups,
      isAllSelected,
      popupColumnsConfig: popupColumns.allColumns,
      visibleColumns: popupColumns.visibleColumns,
      sensorColumnsConfig,
      setViewPortWidth,
      viewPortColumnsWidth: viewPortWidth,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, sensorColumnsConfig]
  );

  return <ColumnPopupContext.Provider value={contextValue}>{children}</ColumnPopupContext.Provider>;
};
