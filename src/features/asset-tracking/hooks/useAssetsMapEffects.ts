import { useCallback, useEffect, useRef, useState } from 'react';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { debounce, isEqual } from 'lodash-es';
import { GeoJSONSource, MapLayerMouseEvent } from 'mapbox-gl';

import { useMap } from '../features/map/providers';
import { useAssetsPageContext } from '../providers';
import { useAssetsPageDataContext } from '../providers/AssetsPageDataProvider';
import { getAssetCoordinatesFromSnapshotData } from '../utils';
import { ASSETS_SOURCE_NAME, UNCLUSTERED_POINTS_LAYER, UNCLUSTERED_POINT_LAYER } from '../constants';
import {
  flyToAssets,
  geoJson,
  handleMapZoom,
  moveAssetLayersUp,
  setMapLabels,
  showClusterPopup,
} from '../features/map/utils';
import { updateMap } from '../features/map/updateMap';
import { mapPopup } from '../features/map/mapPopup';
import { AssetFeatureProperties } from '../types';
import { useGeofenceMapEffects } from '../features/geofences/hooks/useGeofenceMapEffects';

import type { SnapshotDataEx } from '@/features/common';
import { usePrevious } from '@/hooks';
import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';
import { getAssetTypes, isAppDebugLogActive } from '@/utils';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface MapClusterMouseEvent {
  type: 'enter' | 'leave';
  clusterId: number;
}

interface MapAssetMouseEvent {
  type: 'enter' | 'leave';
  event: MapLayerMouseEvent;
}

const POPUP_DELAY_MS = 250;

export const useAssetsMapEffects = ({
  selectedRow,
  onClickOpen,
  onGeofenceClick,
}: {
  selectedRow?: SnapshotDataEx | null;
  onClickOpen: () => void;
  onGeofenceClick: (geofenceId: string) => void;
}) => {
  const tenantId = useAppSelector(getAuthTenantId);

  const { hasPermission } = useRbac();
  const shouldShowAssets = hasPermission(companyActionPayload('dashboard.assetList', tenantId));

  const { tableTab, filter, setSelectedAssetSearchFilterId, setAssetDetailsDialogAssetId } =
    useAssetsPageContext();
  const { filteredSnapshots } = useAssetsPageDataContext();

  const { appLanguage, featureFlags } = useApplicationContext();
  const isAssetHealthEnabled = featureFlags.REACT_APP_FEATURE_HEALTH_STATUS;

  const [selectedDetailsId, setSelectedDetailsId] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const clusterPopupRef = useRef<MapClusterMouseEvent | null>();
  const clusterPopupClusterIdRef = useRef<number | null>();

  const assetPopupRef = useRef<MapAssetMouseEvent | null>();
  const assetPopupAssetIdRef = useRef<string | null>();

  const { map, popup, changeMapState, assetsCreated, showAssetHoverPopup, keepPopupOpen, geofencesCreated } =
    useMap();

  const prevFilteredSnapshots = usePrevious(filteredSnapshots);

  const assetTypes = getAssetTypes();

  const canProcessGeofenceMarkerClick = useCallback(
    () => clusterPopupRef.current?.type !== 'enter' && assetPopupRef.current?.type !== 'enter',
    []
  );

  const handleGeofenceClick = useCallback(
    (geofenceId: string) => {
      setSelectedAssetSearchFilterId(null);
      setSelectedDetailsId(null);
      setAssetDetailsDialogAssetId(null);
      onGeofenceClick(geofenceId);
    },
    [onGeofenceClick, setAssetDetailsDialogAssetId, setSelectedAssetSearchFilterId]
  );

  useGeofenceMapEffects({ onGeofenceClick: handleGeofenceClick, canProcessGeofenceMarkerClick });

  const showAssetHover = useCallback(
    (event: MapLayerMouseEvent) => {
      // Display a popup on hover
      // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
      if (!event.features) {
        return;
      }

      const { properties, geometry } = event.features[0];
      const coordinates = (geometry as GeoJSON.Point).coordinates.slice();

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const snapshot = filteredSnapshots?.find((data) => data.asset?.id === properties?.assetId);
      if (snapshot) {
        showAssetHoverPopup(snapshot, [coordinates[0], coordinates[1]]);
      }
    },
    [filteredSnapshots, showAssetHoverPopup]
  );

  const showAssetPopupDebounced = debounce(() => {
    if (!assetPopupRef.current) {
      return;
    }

    const { type, event } = assetPopupRef.current;

    const assetId = (event.features?.[0].properties as AssetFeatureProperties | undefined)?.assetId ?? '';

    if (type === 'enter') {
      if (mapPopup.isOpen()) {
        mapPopup.remove();
      }

      if (assetPopupAssetIdRef.current !== assetId) {
        if (popup.isOpen()) {
          popup.remove();
        }
      }

      assetPopupAssetIdRef.current = assetId;
      setPopupOpen(true);
      showAssetHover(event);

      return;
    }

    if (type === 'leave') {
      assetPopupAssetIdRef.current = null;
      if (popup.isOpen()) {
        popup.remove();
      }
      setPopupOpen(false);
    }
  }, POPUP_DELAY_MS);

  const handleAssetMouseEnter = useCallback(
    (event: MapLayerMouseEvent) => {
      // eslint-disable-next-line no-param-reassign
      event.target.getCanvas().style.cursor = 'pointer';
      assetPopupRef.current = { type: 'enter', event };
      showAssetPopupDebounced();
    },
    [showAssetPopupDebounced]
  );

  const handleAssetMouseLeave = useCallback(
    (event: MapLayerMouseEvent) => {
      // eslint-disable-next-line no-param-reassign
      event.target.getCanvas().style.cursor = '';
      assetPopupRef.current = { type: 'leave', event };
      showAssetPopupDebounced();
    },
    [showAssetPopupDebounced]
  );

  const handleAssetClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const features = map?.queryRenderedFeatures(event.point);

      // When a click event occurs on a feature
      if (
        features &&
        features[0].geometry.type === 'Point' &&
        features[0].layer.id.includes(UNCLUSTERED_POINT_LAYER) &&
        event.features
      ) {
        const { properties } = event.features[0];
        const { assetId } = properties as { assetId: string };

        if (assetId) {
          handleAssetMouseLeave(event);
          setSelectedAssetSearchFilterId(assetId);
          setSelectedDetailsId(assetId);
          setAssetDetailsDialogAssetId(assetId);
          onClickOpen();
          flyToAssets(map, geoJson, [assetId], false);
        }
      }
    },
    [map, onClickOpen, setSelectedAssetSearchFilterId, setAssetDetailsDialogAssetId, handleAssetMouseLeave]
  );

  useEffect(() => {
    if (map) {
      assetTypes.forEach((_assetType, index) => {
        map.on('click', `${UNCLUSTERED_POINTS_LAYER}${index}`, handleAssetClick);
        map.on('mouseenter', `${UNCLUSTERED_POINTS_LAYER}${index}`, handleAssetMouseEnter);
        map.on('mouseleave', `${UNCLUSTERED_POINTS_LAYER}${index}`, handleAssetMouseLeave);
      });

      return () => {
        assetTypes.forEach((_assetType, index) => {
          map.off('click', `${UNCLUSTERED_POINTS_LAYER}${index}`, handleAssetClick);
          map.off('mouseenter', `${UNCLUSTERED_POINTS_LAYER}${index}`, handleAssetMouseEnter);
          map.off('mouseleave', `${UNCLUSTERED_POINTS_LAYER}${index}`, handleAssetMouseLeave);
        });
      };
    }

    return undefined;
  }, [assetTypes, handleAssetClick, handleAssetMouseEnter, handleAssetMouseLeave, map]);

  useEffect(() => {
    if (!keepPopupOpen && !popupOpen) {
      popup.remove();
    }
  }, [popup, keepPopupOpen, popupOpen]);

  const handleCloseAssetDetails = () => {
    setSelectedDetailsId(null);
    setAssetDetailsDialogAssetId(null);
  };

  const onAssetsCreated = useCallback(() => {
    changeMapState('assetsCreated', true);
  }, [changeMapState]);

  useEffect(() => {
    if (map && assetsCreated && selectedRow?.asset?.id) {
      if (tableTab === 'assets') {
        showAssetHoverPopup(selectedRow);
        flyToAssets(map, geoJson, [selectedRow.asset.id], true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow?.asset?.id, map, tableTab, assetsCreated, showAssetHoverPopup]);

  useEffect(() => {
    const currentCoordinates = getAssetCoordinatesFromSnapshotData(filteredSnapshots, selectedRow?.asset?.id);
    const prevCoordinates = getAssetCoordinatesFromSnapshotData(
      prevFilteredSnapshots,
      selectedRow?.asset?.id
    );
    const isCoordinatesEqual = isEqual(currentCoordinates, prevCoordinates);
    if (selectedRow?.asset?.id && currentCoordinates && prevCoordinates && !isCoordinatesEqual) {
      showAssetHoverPopup(selectedRow);
      if (tableTab === 'assets') {
        flyToAssets(map, geoJson, [selectedRow?.asset?.id], true);
      }
    }
  }, [
    map,
    selectedRow,
    selectedRow?.asset?.id,
    tableTab,
    prevFilteredSnapshots,
    filteredSnapshots,
    showAssetHoverPopup,
  ]);

  const getAssetsClusterSource = useCallback(
    (): GeoJSONSource | undefined => map?.getSource(ASSETS_SOURCE_NAME) as GeoJSONSource,
    [map]
  );

  /* DON'T REMOVE THIS CODE, we use it for debug purposes
  const getClusterChildrenAsync = async (
    clusterId: number
  ): Promise<Feature<Geometry, GeoJsonProperties>[]> =>
    new Promise((resolve) => {
      const source = getAssetsClusterSource();
      if (!source) {
        resolve([]);
      } else {
        source.getClusterChildren(clusterId, (error, features) => {
          if (error) {
            resolve([]);
          } else {
            resolve(features);
          }
        });
      }
    }); */

  const getClusterById = useCallback(
    (clusterId?: number): mapboxgl.MapboxGeoJSONFeature | undefined => {
      if (!clusterId || !map) {
        return undefined;
      }

      const clusters = map
        .querySourceFeatures(ASSETS_SOURCE_NAME)
        ?.filter((item) => item.properties?.cluster && item.properties?.cluster_id === clusterId);

      return clusters[0];
    },
    [map]
  );

  const showClusterPopupDebounced = debounce(() => {
    if (!clusterPopupRef.current || !map) {
      return;
    }

    const { type, clusterId } = clusterPopupRef.current;

    if (type === 'enter') {
      if (popup.isOpen()) {
        popup.remove();
      }

      if (clusterPopupClusterIdRef.current !== clusterId) {
        if (mapPopup.isOpen()) {
          mapPopup.remove();
        }
      }

      clusterPopupClusterIdRef.current = clusterId;

      const cluster = getClusterById(clusterId);

      if (!cluster) {
        return;
      }

      showClusterPopup(map, cluster);

      if (isAppDebugLogActive()) {
        // eslint-disable-next-line no-console
        console.log('Cluster:', cluster);

        const source = getAssetsClusterSource();

        if (source) {
          // Get Next level cluster Children
          source.getClusterChildren(clusterId, (error, features) => {
            if (!error) {
              // eslint-disable-next-line no-console
              console.log('Cluster children:', features);
            }
          });

          // Get all points under a cluster
          source.getClusterLeaves(clusterId, 10000, 0, (error, features) => {
            if (!error) {
              // eslint-disable-next-line no-console
              console.log('Cluster leaves:', features);
            }
          });
        }
      }

      return;
    }

    if (type === 'leave') {
      clusterPopupClusterIdRef.current = null;
      if (mapPopup.isOpen()) {
        mapPopup.remove();
      }
    }
  }, POPUP_DELAY_MS);

  const handleClusterMouseEnter = useCallback(
    (clusterId: number) => {
      clusterPopupRef.current = { type: 'enter', clusterId };
      showClusterPopupDebounced();
    },
    [showClusterPopupDebounced]
  );

  const handleClusterMouseLeave = useCallback(
    (clusterId: number) => {
      clusterPopupRef.current = { type: 'leave', clusterId };
      showClusterPopupDebounced();
    },
    [showClusterPopupDebounced]
  );

  const handleClusterClick = useCallback(
    (clusterId: number) => {
      getAssetsClusterSource()?.getClusterExpansionZoom(clusterId, (error, zoom: number) => {
        if (error) {
          return;
        }

        const cluster = getClusterById(clusterId);

        if (!cluster) {
          return;
        }

        const coords = (cluster.geometry as GeoJSON.Point).coordinates;

        map?.easeTo({
          center: [coords[0], coords[1]],
          zoom,
        });
      });
    },
    [getAssetsClusterSource, getClusterById, map]
  );

  const handleClusterRemoveFromScreen = useCallback(
    (clusterId: number) => {
      if (clusterPopupRef.current?.type === 'enter' && clusterPopupRef.current.clusterId === clusterId) {
        clusterPopupRef.current = { type: 'leave', clusterId };
        showClusterPopupDebounced();
      }
    },
    [showClusterPopupDebounced]
  );

  useEffect(() => {
    if (filteredSnapshots && map && shouldShowAssets) {
      updateMap(
        map,
        filteredSnapshots,
        filter.selectedAssetLayers,
        onAssetsCreated,
        handleClusterMouseEnter,
        handleClusterMouseLeave,
        handleClusterClick,
        handleClusterRemoveFromScreen,
        isAssetHealthEnabled
      );

      map.on('zoom', handleMapZoom);
    }

    return () => {
      if (map) {
        map.off('zoom', handleMapZoom);
      }
    };
  }, [
    map,
    filteredSnapshots,
    filter.selectedAssetLayers,
    onAssetsCreated,
    shouldShowAssets,
    handleClusterMouseEnter,
    handleClusterMouseLeave,
    handleClusterClick,
    handleClusterRemoveFromScreen,
    isAssetHealthEnabled,
  ]);

  useEffect(() => {
    if (map) {
      setMapLabels(map, appLanguage);
    }
  }, [map, appLanguage]);

  useEffect(() => {
    if (assetsCreated && geofencesCreated && map) {
      moveAssetLayersUp(map, assetTypes);
    }
  }, [assetsCreated, geofencesCreated, map, assetTypes]);

  return {
    handleCloseAssetDetails,
    selectedDetailsId,
  };
};
