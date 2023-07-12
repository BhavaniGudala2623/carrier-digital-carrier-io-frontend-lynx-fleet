import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnState, GridApi, GridReadyEvent, RowClickedEvent } from '@ag-grid-community/core';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { DateTimeRenderer, EventCellRenderer } from '../../column-renderers';
import { EnrichedEventData } from '../../types';

import { generateColumns } from './generateColumns';
import { useStyles } from './styles';

import { Table } from '@/components';
import { UserSettings } from '@/providers/UserSettings';

interface EventsPreviewTableProps {
  events: EnrichedEventData[];
  userSettings: UserSettings;
  setSelectedEventId: (eventId: string) => void;
  selectedEventId?: string;
}

export const EventsPreviewTable = ({
  events,
  userSettings,
  setSelectedEventId,
  selectedEventId,
}: EventsPreviewTableProps) => {
  const classes = useStyles();

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const isMultiEvent = useMemo(() => events?.length > 1, [events]);

  const onGridReady = useCallback((event: GridReadyEvent) => {
    setGridApi(event.api);
    const defaultSortModel: ColumnState[] = [
      { colId: 'event', sort: 'asc', sortIndex: 1 },
      { colId: 'time', sort: 'asc', sortIndex: 0 },
    ];

    event.columnApi.applyColumnState({ state: defaultSortModel });
  }, []);

  useEffect(() => {
    gridApi?.setRowData(events);
    if (!isMultiEvent) {
      return;
    }
    gridApi?.forEachNode((node) => {
      let rowNode;
      if (
        (!selectedEventId && node?.rowIndex === 0) ||
        (selectedEventId === node.data.eventId && node?.rowIndex != null)
      ) {
        rowNode = node;
      }
      if (rowNode) {
        rowNode.setSelected(true);
        gridApi?.ensureIndexVisible(rowNode.rowIndex);
      }
    });
  }, [events, gridApi, isMultiEvent, selectedEventId, setSelectedEventId]);

  const getSelectedEventId = useCallback(
    (): string | undefined => gridApi?.getSelectedRows()?.[0]?.eventId,
    [gridApi]
  );

  const handleRowClicked = (event: RowClickedEvent<EnrichedEventData>) => {
    if (isMultiEvent) {
      const selectedInPopupEventId = getSelectedEventId();
      gridApi?.deselectAll();
      if (!selectedInPopupEventId || event.data?.eventId !== selectedInPopupEventId) {
        setSelectedEventId(event.data?.eventId || '');
        event.node.setSelected(true);
      } else {
        setSelectedEventId('');
      }
    }
  };

  const defaultColumns = useMemo(
    () =>
      generateColumns({
        userSettings,
      }),
    [userSettings]
  );

  const getRowStyle = () =>
    !isMultiEvent
      ? {
          border: 'none',
          backgroundColor: fleetThemeOptions.palette.common.white,
        }
      : undefined;

  useEffect(() => {
    gridApi?.sizeColumnsToFit();
  }, [gridApi]);

  return (
    <Table
      className={classes.table}
      columnDefs={defaultColumns}
      onGridReady={onGridReady}
      onRowClicked={handleRowClicked}
      getRowStyle={getRowStyle}
      getRowId={({ data }) => data.eventId}
      gridOptions={{
        suppressRowHoverHighlight: !isMultiEvent,
        suppressCellFocus: !isMultiEvent,
        suppressHorizontalScroll: true,
      }}
      defaultColDef={{
        sortable: true,
      }}
      components={{
        eventCellRenderer: EventCellRenderer,
        dateTimeCellRenderer: DateTimeRenderer,
      }}
      suppressFieldDotNotation
      accentedSort
    />
  );
};
