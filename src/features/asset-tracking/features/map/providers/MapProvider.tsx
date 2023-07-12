import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import mapboxgl, { Popup } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { createRoot } from 'react-dom/client';

import { createMap, removeSources } from '../createMap';
import { AssetHoverPopup } from '../../../components/AssetHoverPopup';
import { useAssetsPageContext } from '../../../providers';
import { getAssetCoordinates, removeUnclusteredLayers } from '../utils';
import { mapPopupOffset } from '../mapPopupOffset';

import type { SnapshotDataEx } from '@/features/common';
import { useAssetsAddressContext } from '@/providers/AssetsAddress/context';

interface MapContextType {
  map: mapboxgl.Map | null;
  draw: MapboxDraw | null;
  popup: Popup;
  geofencesCreated: boolean;
  assetsCreated: boolean;
  changeMapState: (key: keyof MapState, value: unknown) => void;
  showAssetHoverPopup: (asset: SnapshotDataEx, coordinates?: [number, number]) => void;
  keepPopupOpen: boolean;
}

interface MapState {
  map: mapboxgl.Map | null;
  draw: MapboxDraw | null;
  geofencesCreated: boolean;
  assetsCreated: boolean;
}

const popup = new Popup({
  closeButton: false,
  offset: mapPopupOffset,
});

export const MapContext = createContext<MapContextType>({
  map: null,
  draw: null,
  geofencesCreated: false,
  assetsCreated: false,
  popup,
  changeMapState: () => {},
  showAssetHoverPopup: () => {},
  keepPopupOpen: false,
});

export function useMap() {
  return useContext(MapContext);
}

export const MapProvider = ({ children }: PropsWithChildren<{}>) => {
  const { setAssetDetailsDialogAssetId, assetDetailsDialogAssetId } = useAssetsPageContext();
  const { getAddress } = useAssetsAddressContext();
  const [mapState, setMapState] = useState<MapState>({
    map: null,
    draw: null,
    geofencesCreated: false,
    assetsCreated: false,
  });

  const [keepPopupOpen, setKeepPopupOpen] = useState(false);

  const onMapLoaded = (loadedMap: mapboxgl.Map, drawComponent: MapboxDraw) => {
    setMapState((prev) => ({
      ...prev,
      map: loadedMap,
      draw: drawComponent,
    }));
  };

  const handleShowAssetDetails = useCallback(
    (assetId: string) => {
      popup.remove();
      setAssetDetailsDialogAssetId(assetId);
    },
    [setAssetDetailsDialogAssetId]
  );

  const showAssetHoverPopup = useCallback(
    (asset: SnapshotDataEx, eventCoordinates?) => {
      const renderPopup = (placeName: string, assetCoordinates: number[]) => {
        if (mapState.map && !assetDetailsDialogAssetId) {
          const tooltipNode = document.createElement('div');
          const root = createRoot(tooltipNode);
          const coordinates = eventCoordinates || assetCoordinates;
          root.render(
            <AssetHoverPopup
              snapshot={asset}
              placeName={placeName}
              onShowAssetDetailsClick={handleShowAssetDetails}
              setKeepPopupOpen={setKeepPopupOpen}
              // eslint-disable-next-line react/jsx-no-bind
              onLoad={() => {
                popup
                  .setMaxWidth('300')
                  .setLngLat(coordinates)
                  .setDOMContent(tooltipNode)
                  .addTo(mapState.map as mapboxgl.Map);
              }}
            />
          );
        }
      };

      const assetCoordinates = getAssetCoordinates(asset);

      if (assetCoordinates) {
        const [longitude, latitude] = assetCoordinates;

        if (asset.computedFields?.address) {
          renderPopup(asset.computedFields.address, assetCoordinates);
        } else {
          getAddress(longitude, latitude)
            .then((placeName) => {
              renderPopup(placeName, assetCoordinates);
            })
            // eslint-disable-next-line no-console
            .catch((error) => console.error('showAssetHoverPopup', error));
        }
      }
    },
    [getAddress, handleShowAssetDetails, mapState.map, assetDetailsDialogAssetId]
  );

  useEffect(() => {
    let isMounted = true;
    // migrate to react-map-gl?
    // https://github.com/visgl/react-map-gl/blob/master/src/components/map.tsx#L81
    Promise.resolve(import('mapbox-gl')).then(() => {
      if (!isMounted) {
        return;
      }
      createMap('map', onMapLoaded);
    });

    return () => {
      isMounted = false;
      if (mapState.map) {
        removeSources(mapState.map);
        removeUnclusteredLayers(mapState.map);
        mapState.map.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMapStateChange = useCallback((key: keyof MapState, value: unknown) => {
    setMapState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const mapContextValue = useMemo(
    () => ({
      ...mapState,
      popup,
      changeMapState: handleMapStateChange,
      showAssetHoverPopup,
      keepPopupOpen,
    }),
    [mapState, handleMapStateChange, showAssetHoverPopup, keepPopupOpen]
  );

  return <MapContext.Provider value={mapContextValue}>{children}</MapContext.Provider>;
};
