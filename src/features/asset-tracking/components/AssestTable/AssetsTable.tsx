import { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  RowClickedEvent,
} from '@ag-grid-community/core';
import Box from '@carrier-io/fds-react/Box';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { getFileNameToExport } from '@carrier-io/lynx-fleet-common';

import { FreezerAlarmModal } from '../../../common/components/FreezerAlarmModal';
import { useAssetsPageContext } from '../../providers';
import { useAssetsPageDataContext } from '../../providers/AssetsPageDataProvider';

import { useProcessCellForExport } from './useProcessCellForExport';
import { CustomAlarmFilter } from './column-filters/CustomAlarmFilter';
import { getColumns } from './DefaultColumnDefs';
import {
  AssetStatusRenderer,
  AssetIdRenderer,
  BatteryStatusRenderer,
  FreezerAlarmRenderer,
  AssetHealthRenderer,
} from './column-renderers';
import { useHideEmptyColumns } from './useHideEmptyColumns';
import { addAlarmDetailsForExport } from './addAlarmDetailsForExport';

import type { SnapshotDataEx } from '@/features/common';
import {
  cellChipRenderer,
  Table,
  SyntheticTruStatusRenderer,
  Loader,
  OperatingModeRenderer,
} from '@/components';
import {
  applyComposedColumnsUserSettings,
  getHideColumnsMap,
  useTableSaveColumnsWithAutoHide,
} from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';
import { defExcelSheetPageSetup } from '@/constants';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface AssetsTableProps {
  selectedAsset: Maybe<SnapshotDataEx>;
  filteredEntities: Maybe<SnapshotDataEx[]>;
  onAssetSelectionChanged: (snapshot: Maybe<SnapshotDataEx>) => void;
}

type AssetsTableCellRendererProps = Omit<ICellRendererParams, 'data'> & { data: SnapshotDataEx };

export function AssetsTable({ selectedAsset, onAssetSelectionChanged, filteredEntities }: AssetsTableProps) {
  const { t } = useTranslation();
  const { featureFlags } = useApplicationContext();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { temperature, assetListColumns, timezone, dateFormat } = userSettings;

  const { taskToExport, setTaskToExport } = useAssetsPageContext();
  const { responseCount } = useAssetsPageDataContext();

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [modalSelectedAsset, setModalSelectedAsset] = useState<SnapshotDataEx | null>(null);

  const isFeatureAssetHealthEnabled = featureFlags.REACT_APP_FEATURE_HEALTH_STATUS;
  const isFeatureAssetAddressColumnEnabled = featureFlags.REACT_APP_FEATURE_ASSET_ADDRESS_COLUMN;
  const isFeatureBluetoothSensorsManagementEnabled =
    featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT;

  const defaultColumns = useMemo(() => {
    const columns = getColumns(
      temperature,
      dateFormat,
      t,
      timezone,
      isFeatureAssetHealthEnabled,
      isFeatureAssetAddressColumnEnabled,
      isFeatureBluetoothSensorsManagementEnabled
    );
    const columnsPreProcessed = addAlarmDetailsForExport(columns, t);
    if (columnsPreProcessed) {
      return columnsPreProcessed;
    }

    return columns;
  }, [
    temperature,
    dateFormat,
    t,
    timezone,
    isFeatureAssetHealthEnabled,
    isFeatureAssetAddressColumnEnabled,
    isFeatureBluetoothSensorsManagementEnabled,
  ]);

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, assetListColumns),
    [assetListColumns, defaultColumns]
  );

  const { hideEmptyColumns, notVisibleColumnsIds } = useHideEmptyColumns({
    columnApi,
    assetListColumns: savedColumns,
  });

  const userSettingsHideColumnsMap = useMemo(
    () =>
      getHideColumnsMap(
        assetListColumns
          ? assetListColumns.find((columnConfig) => columnConfig.name === 'default')?.columns || []
          : []
      ),
    [assetListColumns]
  );

  const defaultColDef: ColDef = useMemo(
    () => ({
      suppressSizeToFit: true,
    }),
    []
  );

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } =
    useTableSaveColumnsWithAutoHide({
      onSaveColumn: onUserSettingsChange,
      gridApi,
      defaultColumns,
      columnsSettingKey: 'assetListColumns',
      autoHiddenColumnsIds: notVisibleColumnsIds,
      userSettingsHideColumnsMap,
    });

  const getMainMenuItems = () => [
    'pinSubMenu',
    'separator',
    'autoSizeThis',
    'autoSizeAll',
    'separator',
    {
      name: t('common.reset-columns'),
      action: () => {
        onResetColumnsState();
        hideEmptyColumns();
      },
    },
  ];

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }, []);

  const processCellCallback = useProcessCellForExport();

  useEffect(() => {
    if (gridApi && taskToExport !== 'NONE') {
      switch (taskToExport) {
        case 'CSV':
          gridApi.exportDataAsCsv({
            fileName: `${getFileNameToExport(t('assets.assets'))}.csv`,
            processCellCallback,
          });
          break;

        case 'EXCEL':
          gridApi.exportDataAsExcel({
            fileName: `${getFileNameToExport(t('assets.assets'))}.xlsx`,
            sheetName: t('assets.assets'),
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

  const onSelectRow = (assetId) => {
    if (gridApi) {
      setTimeout(() => {
        gridApi.forEachNode((node) => {
          if (node.data.asset.id === assetId) {
            node.setSelected(true);
            if (node.rowIndex !== null) {
              gridApi.ensureIndexVisible(node.rowIndex);
            }
          } else {
            node.setSelected(false);
          }
        });
      }, 0);
    }
  };

  const handleRowClicked = (event: RowClickedEvent<SnapshotDataEx>) => {
    const selectedRows = gridApi?.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      gridApi?.deselectAll();
      if (event.data?.asset?.id === selectedRows[0].asset.id) {
        onAssetSelectionChanged(null);
      } else {
        event.node.setSelected(true);
        onAssetSelectionChanged(event.data || null);
      }
    } else {
      event.node.setSelected(true);
      onAssetSelectionChanged(event.data || null);
    }
  };

  const isRowDisabled = ({ data }: { data: SnapshotDataEx }) =>
    data?.flespiData?.synthetic_tru_status === 'OFF';

  const getRowStyle = (params) =>
    isRowDisabled(params)
      ? {
          color: '#adadad !important',
        }
      : undefined;

  useEffect(() => {
    const assetId = selectedAsset?.asset?.id || '';
    onSelectRow(assetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, filteredEntities, gridApi]);

  return (
    <>
      <Box
        sx={{
          height: '100%',
        }}
      >
        <Table
          rowData={filteredEntities}
          getRowStyle={getRowStyle}
          defaultColDef={defaultColDef}
          columnDefs={savedColumns}
          suppressFieldDotNotation={false}
          getMainMenuItems={getMainMenuItems}
          onRowClicked={handleRowClicked}
          getRowId={({ data }) => data.asset.id}
          onGridReady={onGridReady}
          onColumnMoved={onColumnsChanged}
          onColumnPinned={onColumnsChanged}
          onColumnVisible={onColumnsChanged}
          onSortChanged={onColumnsChanged}
          onColumnResized={onColumnsChangedDebounced}
          resizeColumnsToFit
          components={{
            CellChipRenderer: (params) => cellChipRenderer(params, t),
            SyntheticTruStatusRenderer: (params: AssetsTableCellRendererProps) =>
              SyntheticTruStatusRenderer({
                flespiData: params.data.flespiData,
                table: 'assets',
                compartmentConfig: params.data.device?.compartmentConfig ?? null,
              }),
            AssetStatusRenderer: (params) => AssetStatusRenderer(params, t, getRowStyle(params)),
            OperatingModeRenderer: (params) => OperatingModeRenderer(params),
            AssetIdRenderer: (params) => AssetIdRenderer(params, t),
            FreezerAlarmRenderer: (params) => FreezerAlarmRenderer(params, t, setModalSelectedAsset),
            AssetHealthRenderer: (params) => AssetHealthRenderer(params, t),
            BatteryStatusRenderer: (params) => BatteryStatusRenderer(params, t),
            AlarmFilter: (params) => CustomAlarmFilter(params, t),
          }}
          tooltipShowDelay={0}
          skipHeaderOnAutoSize
          PaperProps={{
            sx: { '&.MuiPaper-rounded': { borderRadius: 0, paddingTop: 0 } },
          }}
        />
        {!responseCount && <Loader overlay />}
      </Box>
      {modalSelectedAsset && (
        <FreezerAlarmModal selectedAsset={modalSelectedAsset} setModalSelectedAsset={setModalSelectedAsset} />
      )}
    </>
  );
}
