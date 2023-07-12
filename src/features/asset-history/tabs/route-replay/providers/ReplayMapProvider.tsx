import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import mapboxgl, { LngLatLike, Popup } from 'mapbox-gl';
import { createRoot } from 'react-dom/client';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { isNumber } from 'lodash-es';

import { createReplayMap, removeReplayMapLayers } from '../features/map/utils';
import { EventsPreviewPopup } from '../components/EventsPreviewPopup';
import { EnrichedEventData } from '../types';
import { endPointOffset, multiEventOffset, startPointOffset } from '../features';
import { CreatePopupProps, MapboxPopupWrapper } from '../components/MapboxPopupWrapper';

import { useReplayTabDataContext } from './ReplayTabDataProvider';

import { useUserSettings } from '@/providers/UserSettings';
import { MIN_MOVEMENT_SPEED_FOR_STATE_IN_MOTION } from '@/constants';

interface ReplayMapContextType {
  map: Maybe<mapboxgl.Map>;
  popup: Maybe<Popup>;
  setPopup?: Maybe<(value: Maybe<Popup>) => void>;
  changeMapState: (key: keyof ReplayMapState, value: unknown) => void;
  showReplayMapPopup: (
    coordinates: LngLatLike,
    events: EnrichedEventData[],
    selectedEventId?: string
  ) => void;
  handleClosePopup: () => void;
}

interface ReplayMapState {
  map: mapboxgl.Map | null;
  eventsCreated: boolean;
}

export const ReplayMapContext = createContext<ReplayMapContextType>({
  map: null,
  popup: null,
  changeMapState: () => {},
  showReplayMapPopup: () => {},
  handleClosePopup: () => {},
});

export function useReplayMap() {
  return useContext(ReplayMapContext);
}

export const ReplayMapProvider = ({ children }: PropsWithChildren<{}>) => {
  const { userSettings } = useUserSettings();
  const { setSelectedEventId } = useReplayTabDataContext();
  const [mapState, setMapState] = useState<ReplayMapState>({
    map: null,
    eventsCreated: false,
  });
  const [popup, setPopup] = useState<Maybe<Popup>>(null);

  const onMapLoaded = (loadedMap: mapboxgl.Map) => {
    setMapState((prev) => ({
      ...prev,
      map: loadedMap,
    }));
  };

  const handleClosePopup = useCallback(() => {
    if (popup) {
      popup?.remove();
      setPopup(null);
    }
  }, [popup]);

  const getOffset = (events?: EnrichedEventData[]): { offset: mapboxgl.Offset } => {
    const point = (type: 'endPoint' | 'startPoint') => (event: EnrichedEventData) => event?.eventId === type;
    const startPoint = events?.some(point('startPoint'));
    const endPoint = events?.some(point('endPoint'));

    let offset = multiEventOffset;

    if (startPoint) {
      offset = startPointOffset;
    }

    if (endPoint) {
      offset = endPointOffset;
    }

    return { offset };
  };

  const handleCreatePopup = useCallback(
    ({ popupRef, coordinates, events }: CreatePopupProps) => {
      if (mapState.map && coordinates && popupRef.current) {
        popup?.remove();
        const newPopup = new mapboxgl.Popup({
          closeButton: false,
          ...getOffset(events),
          className: 'popup-wrapper',
        })
          .setMaxWidth('480px')
          .setLngLat(coordinates)
          .setDOMContent(popupRef.current)
          .addTo(mapState.map);
        setPopup(newPopup);

        return newPopup;
      }

      return null;
    },
    [mapState.map, popup]
  );

  const isAssetMoving = (events: EnrichedEventData[]) => {
    const lastEventPositionSpeed = [...events].reverse().find((event) => isNumber(event.position_speed));

    return lastEventPositionSpeed?.position_speed
      ? lastEventPositionSpeed.position_speed >= MIN_MOVEMENT_SPEED_FOR_STATE_IN_MOTION
      : false;
  };

  const renderPopup = useCallback(
    (events: EnrichedEventData[], coordinates: LngLatLike, isMoving: boolean, selectedEventId?: string) => {
      if (mapState.map) {
        const tooltipNode = document.createElement('div');
        const root = createRoot(tooltipNode);
        root.render(
          <MapboxPopupWrapper
            coordinates={coordinates}
            events={events}
            map={mapState.map}
            handleCreatePopup={handleCreatePopup}
          >
            <EventsPreviewPopup
              events={events}
              isMoving={isMoving}
              userSettings={userSettings}
              setSelectedEventId={setSelectedEventId}
              selectedEventId={selectedEventId}
            />
          </MapboxPopupWrapper>
        );
      }
    },
    [handleCreatePopup, mapState.map, setSelectedEventId, userSettings]
  );

  const showReplayMapPopup = useCallback(
    (coordinates: LngLatLike, popupData: EnrichedEventData[], selectedEventId?: string) => {
      if (coordinates && popupData?.length >= 1) {
        renderPopup(popupData, coordinates, isAssetMoving(popupData), selectedEventId);
      }
    },
    [renderPopup]
  );

  useEffect(() => {
    let isMounted = true;
    Promise.resolve(import('mapbox-gl')).then(() => {
      if (!isMounted) {
        return;
      }
      createReplayMap('replayMap', onMapLoaded);
    });

    return () => {
      isMounted = false;
      if (mapState.map) {
        removeReplayMapLayers(mapState.map);
        mapState.map.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMapStateChange = useCallback((key: keyof ReplayMapState, value: unknown) => {
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
      showReplayMapPopup,
      handleClosePopup,
    }),
    [mapState, popup, handleMapStateChange, showReplayMapPopup, handleClosePopup]
  );

  return <ReplayMapContext.Provider value={mapContextValue}>{children}</ReplayMapContext.Provider>;
};
