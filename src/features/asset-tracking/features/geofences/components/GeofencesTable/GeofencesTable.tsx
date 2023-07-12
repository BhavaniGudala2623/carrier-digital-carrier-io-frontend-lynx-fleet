import { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GridApi,
  GridReadyEvent,
  ProcessCellForExportParams,
  RowClickedEvent,
} from '@ag-grid-community/core';
import Box from '@carrier-io/fds-react/Box';
import { Geofence, Maybe } from '@carrier-io/lynx-fleet-types';
import { shallowEqual } from 'react-redux';
import { getFileNameToExport } from '@carrier-io/lynx-fleet-common';

import { useGeofenceContext } from '../../providers/GeofenceProvider';
import { getGeofenceAddressByLanguage } from '../../../../utils';

import { getGeoColumns } from './geofencesColumns';
import { GeofenceGroupRenderer, GeofenceAddressRenderer } from './column-renderers';

import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';
import { Table } from '@/components/Table';
import { useUserSettings } from '@/providers/UserSettings';
import { defExcelSheetPageSetup } from '@/constants';
import { dateTimeFormatter, Loader } from '@/components';
import { useAppSelector } from '@/stores';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface GeofencesTableProps {
  selectedGeofence: Maybe<Geofence>;
  filteredGeofences: Geofence[];
  onGeofenceSelectionChanged: (geofence: Maybe<Geofence>) => void;
}

export function GeofencesTable({
  selectedGeofence,
  filteredGeofences,
  onGeofenceSelectionChanged,
}: GeofencesTableProps) {
  const { t } = useTranslation();
  const { appLanguage } = useApplicationContext();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { geofenceListColumns, timezone, dateFormat } = userSettings;
  const { taskToExport, setTaskToExport } = useGeofenceContext();

  const {
    geofenceGroups: { entities: geofenceGroups },
    geofenceState,
  } = useAppSelector(
    (state) => ({
      geofenceGroups: state.geofenceGroups,
      geofenceState: state.geofences,
    }),
    shallowEqual
  );

  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const defaultColumns = useMemo(
    () => getGeoColumns(dateFormat, t, timezone, appLanguage),
    [dateFormat, t, timezone, appLanguage]
  );
  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, geofenceListColumns),
    [geofenceListColumns, defaultColumns]
  );

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'geofenceListColumns',
  });

  const getGeoMainMenuItems = () => [
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

  const onGeofenceGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const processCellCallback = useCallback(
    (params: ProcessCellForExportParams<Geofence>): string => {
      const { column, value, node } = params;
      const data = node?.data;

      switch (column.getColId()) {
        case 'geofenceGroup':
          return geofenceGroups?.find((element) => element.groupId === value)?.name ?? '';

        case 'createdAt':
        case 'updatedAt':
          return dateTimeFormatter(value, { dateFormat, timezone });

        case 'geofenceAddress':
          if (!data) {
            break;
          }

          return getGeofenceAddressByLanguage(data, appLanguage) || value; // TODO

        default:
          break;
      }

      return value;
    },
    [geofenceGroups, appLanguage, timezone, dateFormat]
  );

  useEffect(() => {
    if (gridApi && taskToExport !== 'NONE') {
      switch (taskToExport) {
        case 'CSV':
          gridApi.exportDataAsCsv({
            fileName: `${getFileNameToExport(t('geofences.geofences'))}.csv`,
            processCellCallback,
          });
          break;

        case 'EXCEL':
          gridApi.exportDataAsExcel({
            fileName: `${getFileNameToExport(t('geofences.geofences'))}.xlsx`,
            sheetName: t('geofences.geofences'),
            pageSetup: defExcelSheetPageSetup,
            processCellCallback,
          });
          break;

        default:
          break;
      }

      setTaskToExport('NONE');
    }
  }, [gridApi, processCellCallback, taskToExport, setTaskToExport, t]);

  const onSelectGeofenceRow = (geofenceId) => {
    if (gridApi) {
      setTimeout(() => {
        gridApi.forEachNode((node) => {
          if (node.data.geofenceId === geofenceId) {
            node.setSelected(true, false, true);
            if (node.rowIndex !== null) {
              gridApi.ensureIndexVisible(node.rowIndex);
            }
          } else {
            node.setSelected(false, false, true);
          }
        });
      }, 0);
    }
  };

  const handleRowClicked = (event: RowClickedEvent<Maybe<Geofence>>) => {
    const selectedRows = gridApi?.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      gridApi?.deselectAll();
      if (event.data?.geofenceId === selectedRows[0].geofenceId) {
        onGeofenceSelectionChanged(null);
      } else {
        event.node.setSelected(true);
        onGeofenceSelectionChanged(event.data || null);
      }
    } else {
      event.node.setSelected(true);
      onGeofenceSelectionChanged(event.data || null);
    }
  };

  useEffect(() => {
    const geofenceId = selectedGeofence?.geofenceId || '';
    onSelectGeofenceRow(geofenceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGeofence, filteredGeofences]);

  return (
    <Box
      sx={{
        position: 'relative',
        fontFamily: 'Gibson, Helvetica, "sans-serif" !important',
        fontSize: '13px',
        height: '100%',
      }}
    >
      <Box
        sx={{
          height: '100%',
        }}
      >
        {geofenceState.isLoading && <Loader overlay />}
        <Table
          rowData={filteredGeofences}
          columnDefs={savedColumns}
          suppressFieldDotNotation
          rowSelection="single"
          getMainMenuItems={getGeoMainMenuItems}
          getRowId={({ data }) => data.geofenceId}
          onGridReady={onGeofenceGridReady}
          onColumnMoved={onColumnsChanged}
          onColumnPinned={onColumnsChanged}
          onColumnVisible={onColumnsChanged}
          onSortChanged={onColumnsChanged}
          onColumnResized={onColumnsChangedDebounced}
          defaultColDef={{
            suppressSizeToFit: true,
          }}
          resizeColumnsToFit
          onRowClicked={handleRowClicked}
          components={{
            GeofenceGroupRenderer,
            GeofenceAddressRenderer,
          }}
          pivotPanelShow="always"
          PaperProps={{
            sx: { '&.MuiPaper-rounded': { borderRadius: 0, paddingTop: 0 } },
          }}
        />
      </Box>
    </Box>
  );
}
