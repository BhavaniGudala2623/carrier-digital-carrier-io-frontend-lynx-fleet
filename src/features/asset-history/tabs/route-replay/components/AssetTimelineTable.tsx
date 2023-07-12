import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CellMouseOverEvent,
  ColumnApi,
  ColumnState,
  GridReadyEvent,
  RowClickedEvent,
  SortChangedEvent,
} from '@ag-grid-community/core';
import { useTranslation } from 'react-i18next';

import {
  DateTimeRenderer,
  EventCellRenderer,
  HeaderRenderer,
  IconButtonHeaderRenderer,
} from '../column-renderers';
import {
  ALL_CUSTOM_EVENTS,
  MAP_HOVER_EVENT,
  MAP_HOVER_OUT_EVENT,
  TABLE_HOVER_EVENT,
  TABLE_OUT_EVENT,
} from '../features/map/constants';
import { replayMapEventEmitter, setMapEventData } from '../features/map/utils';
import { useColumnPopupContext, useReplayTabDataContext } from '../providers';
import { useAssetHistoryPageContext } from '../../../providers';
import { getTableViewPortWidth, filterColumnsByCompartmentConfig } from '../utils';
import { DEFAULT_TABLE_WIDTH } from '../constants';
import { useReplayMapEffects } from '../hooks/useReplayMapEffects';
import { EnrichedEventData } from '../types';

import { useStyles } from './styles';
import { generateColumns } from './generateColumns';
import { TimelinePopover } from './TimelinePopover';

import { useUserSettings } from '@/providers/UserSettings';
import { Loader, Table } from '@/components';
import { applyComposedColumnsUserSettings, getNoRowsTemplate, useTableSaveColumns } from '@/utils';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface EventTableMouseEvent {
  type: 'over' | 'out';
  eventId?: string;
  rowIndex?: number | null;
}

interface AssetTimelineTableProps {
  onChange: (width: number) => void;
  isResized: boolean;
}

export const AssetTimelineTable = ({ onChange, isResized }: AssetTimelineTableProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { onUserSettingsChange, userSettings } = useUserSettings();
  const { assetDetails } = useAssetHistoryPageContext();
  const { featureFlags } = useApplicationContext();
  const {
    filteredEvents,
    routeHistoryLoading,
    configuredFlespiFields,
    routeHistoryLoaded,
    selectedEventId,
    multiEvents,
    edgePoints,
    gridApi,
    setGridApi,
    regularEvents,
    prevAppLanguage,
  } = useReplayTabDataContext();
  const { handleTableClick } = useReplayMapEffects();
  const { addPopupColumns, popupColumnsConfig, visibleColumns, sensorColumnsConfig, groups } =
    useColumnPopupContext();
  const { assetTimelineColumns } = userSettings;
  const [columnsApi, setColumnsApi] = useState<ColumnApi | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [legendAnchorEl, setLegendAnchorEl] = useState(null);
  const hoveredEventRef = useRef<EventTableMouseEvent | null>();
  const [hoveredEventId, setHoveredEventId] = useState<{
    current: string | null;
    previous: string | null;
  } | null>(null);
  const popupHandler = (popupStatus: boolean, elementTarget) => {
    setIsPopupOpen(popupStatus);
    setLegendAnchorEl(elementTarget);
  };

  const defaultColumns = useMemo(
    () =>
      generateColumns({
        userSettings,
        popupHandler,
        isPopupOpen,
        configuredFlespiFields,
        sensorColumnsConfig,
        visibleColumns,
        deviceSensors: assetDetails?.sensors,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      userSettings,
      isPopupOpen,
      configuredFlespiFields,
      sensorColumnsConfig,
      visibleColumns,
      assetDetails?.sensors,
      isResized,
    ]
  );

  const columnDefs = useMemo(() => {
    const columns = applyComposedColumnsUserSettings(
      defaultColumns,
      popupColumnsConfig ? [] : assetTimelineColumns
    );

    return featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE
      ? filterColumnsByCompartmentConfig(groups, columns, assetDetails?.compartmentConfig)
      : columns;
  }, [
    defaultColumns,
    popupColumnsConfig,
    assetTimelineColumns,
    featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE,
    groups,
    assetDetails?.compartmentConfig,
  ]);

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'assetTimelineColumns',
  });

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

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const { api, columnApi } = params;
    setGridApi(api);
    addPopupColumns(columnApi.getColumns());
    setColumnsApi(columnApi);

    const defaultSortModel: ColumnState[] = [
      { colId: 'event', sort: 'asc', sortIndex: 1 },
      { colId: 'time', sort: 'asc', sortIndex: 0 },
    ];

    columnApi.applyColumnState({ state: defaultSortModel });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSortChanged = useCallback(
    (event: SortChangedEvent) => {
      const { columnApi, source } = event;

      if (source === 'uiColumnSorted') {
        const sortedColumns = columnApi.getColumnState().filter((s) => s.sort);

        if (sortedColumns.length === 1 && sortedColumns[0].colId === 'time') {
          const sortModel: ColumnState[] = [
            { colId: 'time', sort: sortedColumns[0].sort, sortIndex: 0 },
            { colId: 'event', sort: 'asc', sortIndex: 1 },
          ];

          columnApi.applyColumnState({ state: sortModel });
        }

        onColumnsChanged(event);
      }
    },
    [onColumnsChanged]
  );

  const showHoveredEventDebounced = useCallback(() => {
    if (!hoveredEventRef.current) {
      return;
    }

    const { type, eventId, rowIndex } = hoveredEventRef.current;

    if (type === 'over' && rowIndex != null && eventId !== selectedEventId) {
      const data = setMapEventData(eventId, multiEvents, edgePoints, regularEvents);
      replayMapEventEmitter.dispatch(TABLE_HOVER_EVENT, data);
    }

    if (type === 'out') {
      replayMapEventEmitter.dispatch(TABLE_OUT_EVENT, {});
    }
  }, [edgePoints, multiEvents, regularEvents, selectedEventId]);

  const handleCellMouseOver = useCallback(
    (event: CellMouseOverEvent<EnrichedEventData>) => {
      hoveredEventRef.current = { type: 'over', eventId: event.data?.eventId, rowIndex: event.rowIndex };
      showHoveredEventDebounced();
    },
    [showHoveredEventDebounced]
  );

  const handleCellMouseOut = useCallback(
    (event: CellMouseOverEvent<EnrichedEventData>) => {
      hoveredEventRef.current = { type: 'out', eventId: event.data?.eventId, rowIndex: null };
      showHoveredEventDebounced();
    },
    [showHoveredEventDebounced]
  );

  const getSelectedEventId = useCallback(
    (): string | undefined => gridApi?.getSelectedRows()?.[0]?.eventId,
    [gridApi]
  );

  const handleRowClicked = (event: RowClickedEvent<EnrichedEventData>) => {
    if (!event.data?.eventId || event.rowIndex == null) {
      handleTableClick();

      return;
    }
    gridApi?.deselectAll();
    if (!selectedEventId || event.data.eventId !== selectedEventId) {
      event.node.setSelected(true);
      const data = setMapEventData(event.data.eventId, multiEvents, edgePoints, regularEvents);
      if (data) {
        handleTableClick(data);

        return;
      }
    }
    handleTableClick();
  };

  useEffect(() => {
    const eventId = getSelectedEventId();
    if (selectedEventId === eventId) {
      return;
    }
    gridApi?.deselectAll();
    if (eventId && !selectedEventId) {
      handleTableClick();

      return;
    }
    gridApi?.forEachNode((node) => {
      if (node.data!.eventId === selectedEventId && node.rowIndex != null) {
        node.setSelected(true);
        gridApi?.ensureIndexVisible(node.rowIndex, 'middle');
      }
    });
  }, [getSelectedEventId, gridApi, handleTableClick, selectedEventId]);

  replayMapEventEmitter.on(MAP_HOVER_EVENT, (data) => {
    const mapEventData = setMapEventData(data.eventId, multiEvents, edgePoints, regularEvents, true);
    if (mapEventData?.eventId) {
      const { eventId } = mapEventData;
      if (eventId !== selectedEventId && eventId !== hoveredEventId?.current) {
        setHoveredEventId({ current: eventId, previous: hoveredEventId?.current ?? null });
      }
    }
  });

  replayMapEventEmitter.on(MAP_HOVER_OUT_EVENT, () => {
    if (hoveredEventId?.current) {
      setHoveredEventId({ current: null, previous: hoveredEventId?.current ?? null });
    }
  });

  useEffect(
    () => () => {
      if (replayMapEventEmitter) {
        replayMapEventEmitter.removeAll(ALL_CUSTOM_EVENTS);
      }
    },
    []
  );

  useEffect(() => {
    if (filteredEvents) {
      gridApi?.setRowData(filteredEvents);
    }
  }, [filteredEvents, gridApi]);

  useEffect(() => {
    if (routeHistoryLoaded) {
      const tableViewPortWidth = getTableViewPortWidth(columnsApi);
      if (tableViewPortWidth) {
        onChange(tableViewPortWidth);
        columnsApi?.sizeColumnsToFit(tableViewPortWidth);
      }
    } else {
      onChange(DEFAULT_TABLE_WIDTH);
      columnsApi?.sizeColumnsToFit(DEFAULT_TABLE_WIDTH);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsApi, popupColumnsConfig, routeHistoryLoaded]);

  const closePopup = useCallback(() => {
    setLegendAnchorEl(null);
    popupHandler(false, null);
  }, []);

  const rowClassRules = useMemo(
    () => ({
      'ag-row-hover': (params) => params.data.eventId === hoveredEventId?.current,
    }),
    [hoveredEventId]
  );

  useEffect(() => {
    const rowNodes = gridApi
      ?.getRenderedNodes()
      ?.filter(
        (node) =>
          hoveredEventId?.current === node.data?.eventId || hoveredEventId?.previous === node.data?.eventId
      );
    if (rowNodes && rowNodes.length > 0) {
      gridApi?.redrawRows({ rowNodes });
    }
  }, [gridApi, hoveredEventId]);

  useEffect(() => {
    if (routeHistoryLoaded && regularEvents && edgePoints && multiEvents) {
      gridApi?.refreshCells({ force: true, columns: ['event'] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevAppLanguage]);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 70px)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Table
          headerProps={{
            sx: {
              justifyContent: 'end',
              borderBottom: 1,
              borderColor: 'addition.divider',
            },
          }}
          sortingOrder={['desc', 'asc']}
          className={classes.table}
          columnDefs={columnDefs}
          suppressFieldDotNotation
          onGridReady={onGridReady}
          onColumnVisible={onColumnsChanged}
          onSortChanged={onSortChanged}
          onColumnResized={onColumnsChangedDebounced}
          onRowClicked={handleRowClicked}
          onCellMouseOver={handleCellMouseOver}
          onCellMouseOut={handleCellMouseOut}
          getMainMenuItems={getMainMenuItems}
          onColumnMoved={onColumnsChanged}
          getRowId={({ data }) => data.eventId}
          loadingOverlayComponent={null}
          pivotPanelShow="always"
          tooltipShowDelay={0}
          overlayNoRowsTemplate={`<span style="padding-top: 5rem">${getNoRowsTemplate(t)}</span>`}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: false,
          }}
          gridOptions={{
            headerHeight: 60,
            rowHeight: 60,
          }}
          rowClassRules={rowClassRules}
          components={{
            headerRenderer: HeaderRenderer,
            eventCellRenderer: EventCellRenderer,
            dateTimeCellRenderer: DateTimeRenderer,
            iconButtonHeaderRenderer: IconButtonHeaderRenderer,
          }}
          accentedSort
        />
        {routeHistoryLoading && <Loader className={classes.loader} overlay />}
      </div>
      <TimelinePopover isOpen={isPopupOpen} legendAnchorEl={legendAnchorEl} onClose={closePopup} />
    </>
  );
};
