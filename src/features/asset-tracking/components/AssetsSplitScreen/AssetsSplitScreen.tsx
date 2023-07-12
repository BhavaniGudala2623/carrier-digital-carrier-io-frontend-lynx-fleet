import { useEffect, useCallback, useMemo } from 'react';
import { Resizable } from 're-resizable';
import Box from '@carrier-io/fds-react/Box';
import { Geofence, Maybe } from '@carrier-io/lynx-fleet-types';
import Paper from '@carrier-io/fds-react/Paper';
import ResizeObserver from 'rc-resize-observer';

import { flyToGeofence } from '../../features/map/mapGeofences';
import { useMap } from '../../features/map';
import { useGeofenceContext } from '../../features/geofences/providers/GeofenceProvider';
import { AssetsTableSplit } from '../AssetsTableSplit';
import { MapContainer } from '../MapContainer';
import { AssetListView, TableTab } from '../../types';
import { useAssetsPageContext } from '../../providers';
import { getGeofenceData } from '../../utils';
import { useAssetsPageDataContext } from '../../providers/AssetsPageDataProvider';
import { flyToAssets, geoJson } from '../../features/map/utils';

import type { SnapshotDataEx } from '@/features/common';
import { useAppDispatch, useAppSelector } from '@/stores';
import { geofencesSlice } from '@/stores/assets';
import { useUserSettings } from '@/providers/UserSettings';
import { Loader } from '@/components';

const tableHeightByView: Record<AssetListView, string> = {
  TableView: '100%',
  SplitView: '50%',
  MapView: '0%',
};

export const AssetsSplitScreen = () => {
  const dispatch = useAppDispatch();
  const selectedGeofenceRowId = useAppSelector((state) => state.geofences.selectedRowId);

  const { userSettings } = useUserSettings();
  const { assetListColumns } = userSettings;

  const { filteredGeofences, handleSetGeofenceProperties } = useGeofenceContext();
  const { map, popup, assetsCreated, geofencesCreated, showAssetHoverPopup } = useMap();
  const {
    selectedView,
    tableTab,
    selectedAssetSearchFilterId,
    setTableTab,
    setSelectedAssetRowId,
    selectedAssetRowId,
  } = useAssetsPageContext();
  const { filteredSnapshots } = useAssetsPageDataContext();

  useEffect(() => {
    if (selectedAssetSearchFilterId) {
      setSelectedAssetRowId(selectedAssetSearchFilterId);
    }
  }, [selectedAssetSearchFilterId, setSelectedAssetRowId]);

  const selectedRow = useMemo(
    () => filteredSnapshots?.find((snapshot) => snapshot?.asset?.id === selectedAssetRowId) || null,
    [filteredSnapshots, selectedAssetRowId]
  );

  const selectedGeofenceRow = useMemo(
    () => filteredGeofences?.find((e) => e.geofenceId === selectedGeofenceRowId) || null,
    [filteredGeofences, selectedGeofenceRowId]
  );

  const showGeofenceClickFromTable = useCallback(
    (selectedGeofence: Geofence | null, isNeedToFly = true) => {
      if (selectedGeofence) {
        const geofenceData = getGeofenceData(selectedGeofence);

        if (geofenceData) {
          handleSetGeofenceProperties(geofenceData);
          if (isNeedToFly) {
            flyToGeofence(map, selectedGeofence.geofenceId);
          }
        }
      } else {
        handleSetGeofenceProperties(null);
      }
    },
    [map, handleSetGeofenceProperties]
  );

  const showAssetHoverFromTable = useCallback(
    (selectedAsset: Maybe<SnapshotDataEx>) => {
      if (!map) {
        return;
      }

      if (selectedAsset?.asset?.id) {
        showAssetHoverPopup(selectedAsset);
        popup.on('close', () => {
          // intentionaly left blank to override popup close event
        });
        flyToAssets(map, geoJson, [selectedAsset?.asset?.id]);
      } else if (!selectedAssetSearchFilterId) {
        popup.remove();
      }
    },
    [map, popup, selectedAssetSearchFilterId, showAssetHoverPopup]
  );

  const handleTableTabChange = useCallback(
    (tab: TableTab) => {
      setTableTab(tab);

      if (tab === 'assets') {
        if (selectedRow) {
          showAssetHoverFromTable(selectedRow);
        }
      } else if (tab === 'geofences') {
        if (selectedGeofenceRow) {
          flyToGeofence(map, selectedGeofenceRow?.geofenceId);
        }
      }
    },
    [selectedRow, selectedGeofenceRow, map, showAssetHoverFromTable, setTableTab]
  );

  // run this hook like a componentDidMount right after map and assets are created
  // but do not track updates
  useEffect(() => {
    if (map && assetsCreated) {
      if (selectedRow && tableTab === 'assets') {
        showAssetHoverFromTable(selectedRow);
      } else if (filteredSnapshots) {
        const updatedAssetIds = filteredSnapshots.map((snapshot) => snapshot.asset?.id);
        // according to https://github.com/mapbox/mapbox-gl-js/pull/5518
        // seems like resizing before seeting initial bounds is a fix for proper fit bounds
        map.resize();
        flyToAssets(map, geoJson, updatedAssetIds as string[]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, assetsCreated]);

  useEffect(() => {
    if (map && geofencesCreated && tableTab === 'geofences') {
      showGeofenceClickFromTable(selectedGeofenceRow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, geofencesCreated]);

  const handleSelectAssetRow = useCallback(
    (row: Maybe<SnapshotDataEx>) => {
      if (row?.asset?.id) {
        setSelectedAssetRowId(row.asset.id);
      } else if (!selectedAssetSearchFilterId) {
        setSelectedAssetRowId(null);
      }
      showAssetHoverFromTable(row);
    },
    [selectedAssetSearchFilterId, showAssetHoverFromTable, setSelectedAssetRowId]
  );

  const handleSelectGeofenceRow = useCallback(
    (row: Maybe<Geofence>) => {
      dispatch(geofencesSlice.actions.selectGeofenceRow(row ? row.geofenceId : null));

      showGeofenceClickFromTable(row);
    },
    [dispatch, showGeofenceClickFromTable]
  );

  const handleClickOpen = useCallback(() => {
    if (tableTab !== 'assets') {
      setTableTab('assets');
    }
  }, [tableTab, setTableTab]);

  const handleGeofenceClickOpen = useCallback(
    (geofenceId: string) => {
      if (tableTab !== 'geofences') {
        setTableTab('geofences');
      }

      if (selectedGeofenceRowId !== geofenceId) {
        dispatch(geofencesSlice.actions.selectGeofenceRow(geofenceId));
      } else {
        const geofence = filteredGeofences.find((item) => item.geofenceId === geofenceId);
        if (geofence) {
          showGeofenceClickFromTable(geofence);
        }
      }
    },
    [tableTab, selectedGeofenceRowId, setTableTab, dispatch, filteredGeofences, showGeofenceClickFromTable]
  );

  const resizeMap = useCallback(() => {
    if (map) {
      map.resize();
    }
  }, [map]);

  const shouldShowTable = typeof assetListColumns !== 'undefined';

  if (map && !map.loaded) {
    return <Loader />;
  }

  return (
    <ResizeObserver onResize={resizeMap}>
      <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', mb: 1 }}>
        <Box sx={{ flex: '1' }}>
          <MapContainer
            selectedRow={selectedRow}
            onClickOpen={handleClickOpen}
            onGeofenceClick={handleGeofenceClickOpen}
          />
        </Box>
        {shouldShowTable && (
          <Resizable
            defaultSize={{ width: '100%', height: tableHeightByView[selectedView] }}
            enable={{ top: true }}
            onResize={resizeMap}
            maxHeight="100%"
          >
            <Box height="100%">
              <AssetsTableSplit
                selectedTab={tableTab}
                selectedAsset={selectedRow}
                selectedGeofence={selectedGeofenceRow}
                filteredGeofences={filteredGeofences}
                onAssetSelectionChanged={handleSelectAssetRow}
                onGeofenceSelectionChanged={handleSelectGeofenceRow}
                onTabChanged={handleTableTabChange}
              />
            </Box>
          </Resizable>
        )}
      </Paper>
    </ResizeObserver>
  );
};
