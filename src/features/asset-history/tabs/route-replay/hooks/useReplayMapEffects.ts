import { useCallback, useEffect, useMemo, useState } from 'react';
import { GeoJSONSource, MapLayerMouseEvent } from 'mapbox-gl';
import { getTimezoneOffset } from 'date-fns-tz';
import { Point } from 'geojson';

import { createOrUpdateReplayMap } from '../features/map/createOrUpdateReplayMap';
import { useReplayMap, useReplayTabDataContext } from '../providers';
import {
  EDGE_POINT_LAYER_ID,
  EDGE_POINT_SOURCE_NAME,
  MAP_HOVER_OUT_EVENT,
  MARKER_SELECT_EVENT,
  MARKER_UNSELECT_EVENT,
  MULTI_EVENT_CLUSTER_LAYER_ID,
  MULTI_EVENT_LAYER_ID,
  MULTI_EVENT_SOURCE_NAME,
  SINGLE_EVENT_LAYER_ID,
  SINGLE_EVENT_SOURCE_NAME,
  TABLE_OUT_EVENT,
} from '../features/map/constants';
import { flyToEvent, getFeature, replayMapEventEmitter, setMapEventData } from '../features/map/utils';
import { TableEventType } from '../types';

import { useUserSettings } from '@/providers/UserSettings';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const useReplayMapEffects = () => {
  const {
    regularEvents,
    loadedRoutes,
    edgePoints,
    routeHistoryLoaded,
    routeHistoryLoading,
    multiEvents,
    selectedEventId,
    setSelectedEventId,
    selectedFeature,
    setSelectedFeature,
    prevAppLanguage,
    prevStartDate,
    prevEndDate,
  } = useReplayTabDataContext();

  const { appLanguage } = useApplicationContext();
  const { userSettings } = useUserSettings();
  const { map, showReplayMapPopup, handleClosePopup } = useReplayMap();
  const [targetPoint, setTargetPoint] = useState<TableEventType | null>(null);
  const [isFly, setIsFly] = useState<boolean>(false);

  const showPopupByLayer = useCallback(
    (data: TableEventType) => {
      const { eventId, layerId, coordinates, multiEventId } = data;
      let popupContent;
      switch (layerId) {
        case MULTI_EVENT_SOURCE_NAME:
          popupContent = multiEvents.find((item) => item.multiEventId === multiEventId)?.events;
          break;
        case EDGE_POINT_SOURCE_NAME:
          popupContent = [edgePoints?.find((item) => item.eventId === eventId)];
          break;
        case SINGLE_EVENT_SOURCE_NAME:
          popupContent = [regularEvents?.find((item) => item.eventId === eventId)];
          break;
        default:
          break;
      }
      if (popupContent) {
        showReplayMapPopup(coordinates, popupContent, !data.isMapEvent ? eventId : '');
      }
    },
    [edgePoints, multiEvents, regularEvents, showReplayMapPopup]
  );

  const setMapFeature = useCallback(
    (data: TableEventType, id: string | number) => {
      const { eventId, layerId } = data;
      if (map && eventId && layerId) {
        setSelectedEventId(eventId);
        replayMapEventEmitter.dispatch(MARKER_SELECT_EVENT, { eventId });
        const feature = { source: layerId, id };
        map.setFeatureState(feature, { active: true });
        setSelectedFeature(feature);
        showPopupByLayer(data);
      }
    },
    [map, setSelectedEventId, setSelectedFeature, showPopupByLayer]
  );

  const removeMarkerAndPopup = useCallback(() => {
    handleClosePopup();
    if (map && selectedFeature) {
      map.setFeatureState(selectedFeature, { active: false });
      replayMapEventEmitter.dispatch(MARKER_UNSELECT_EVENT, { ...selectedFeature, eventId: selectedEventId });
    }
  }, [handleClosePopup, map, selectedEventId, selectedFeature]);

  const cleanMapFeature = useCallback(() => {
    removeMarkerAndPopup();
    if (targetPoint) {
      setTargetPoint(null);
    }
    setSelectedFeature(null);
    setSelectedEventId('');
  }, [removeMarkerAndPopup, setSelectedEventId, setSelectedFeature, targetPoint]);

  const selectPoint = useCallback(
    (data: TableEventType) => {
      if (!map || !data?.eventId || !data.layerId) {
        return;
      }
      const feature = getFeature(data.multiEventId ?? data.eventId, map, data.layerId);
      if (feature?.id !== null && feature?.id !== undefined) {
        const { id } = feature;
        const status = map.getFeatureState({ source: data.layerId, id });
        if (!status.active) {
          setTargetPoint(data);
          setMapFeature(data, id);
        }
      }
    },
    [map, setMapFeature]
  );

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      if (!map || routeHistoryLoading) {
        return;
      }
      const features = map.queryRenderedFeatures(event.point, {
        layers: [
          EDGE_POINT_LAYER_ID,
          MULTI_EVENT_LAYER_ID,
          SINGLE_EVENT_LAYER_ID,
          MULTI_EVENT_CLUSTER_LAYER_ID,
        ],
      });
      if (!features || features.length < 1) {
        cleanMapFeature();
        replayMapEventEmitter.dispatch(TABLE_OUT_EVENT, {});

        return;
      }
      const { properties, geometry, id, layer } = features[0];

      if (properties?.cluster_id) {
        (map.getSource(MULTI_EVENT_SOURCE_NAME) as GeoJSONSource).getClusterExpansionZoom(
          properties.cluster_id,
          (err, zoom) => {
            if (err) {
              return;
            }

            map.easeTo({
              center: (features[0].geometry as Point).coordinates as [number, number],
              zoom,
            });
          }
        );

        return;
      }

      if (id == null || !layer.id || !geometry || !properties?.eventId) {
        return;
      }

      const eventId = properties?.eventId;
      if (
        selectedEventId === eventId ||
        (selectedFeature?.source === layer.id && selectedFeature.id === id)
      ) {
        cleanMapFeature();

        return;
      }
      removeMarkerAndPopup();
      const data = setMapEventData(eventId, multiEvents, edgePoints, regularEvents, true);
      if (data) {
        flyToEvent(eventId, data.coordinates, map);
        selectPoint(data);
      }
    },
    [
      map,
      routeHistoryLoading,
      selectedEventId,
      selectedFeature,
      removeMarkerAndPopup,
      multiEvents,
      edgePoints,
      regularEvents,
      cleanMapFeature,
      selectPoint,
    ]
  );

  const handleTableClick = useCallback(
    (data?: TableEventType) => {
      if (!data) {
        cleanMapFeature();

        return;
      }
      removeMarkerAndPopup();
      const { eventId, layerId, multiEventId, coordinates } = data;
      if (map && eventId && layerId) {
        setTargetPoint(data);
        const feature = getFeature(multiEventId ?? eventId, map, layerId);
        flyToEvent(eventId, coordinates, map, feature?.id === null || feature?.id === undefined);
        if (feature?.id !== null && feature?.id !== undefined) {
          setMapFeature(data, feature.id);

          return;
        }
        setIsFly(true);
      }
    },
    [removeMarkerAndPopup, map, cleanMapFeature, setMapFeature]
  );

  const handleMoveEnd = useCallback(() => {
    if (map && isFly && targetPoint?.eventId && targetPoint?.layerId) {
      const { eventId, layerId, multiEventId } = targetPoint;
      const feature = getFeature(multiEventId ?? eventId, map, layerId);
      if (feature?.id !== null && feature?.id !== undefined) {
        setIsFly(false);
        setMapFeature(targetPoint, feature.id);
      } else {
        setTargetPoint(null);
      }
    }
  }, [map, isFly, targetPoint, setMapFeature]);

  useEffect(() => {
    if (map) {
      map.on('moveend', handleMoveEnd);

      return () => {
        map.off('moveend', handleMoveEnd);
      };
    }

    return undefined;
  }, [map, handleMoveEnd]);

  useEffect(() => {
    if (targetPoint) {
      showPopupByLayer(targetPoint);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettings.dateFormat]);

  const timeZoneOffset = useMemo(() => getTimezoneOffset(userSettings.timezone), [userSettings.timezone]);

  useEffect(() => {
    removeMarkerAndPopup();
    replayMapEventEmitter.dispatch(TABLE_OUT_EVENT, {});
    replayMapEventEmitter.dispatch(MAP_HOVER_OUT_EVENT, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLanguage, timeZoneOffset]);

  const getMapPointIfExist = useCallback(
    (eventId: string): TableEventType | null => {
      if (eventId && map && routeHistoryLoaded && regularEvents && edgePoints && multiEvents) {
        const data = setMapEventData(eventId, multiEvents, edgePoints, regularEvents);
        if (data?.eventId && data?.coordinates && data?.layerId) {
          return data;
        }
      }

      return null;
    },
    [map, routeHistoryLoaded, regularEvents, edgePoints, multiEvents]
  );

  useEffect(() => {
    if (map && routeHistoryLoaded && regularEvents && loadedRoutes && edgePoints && multiEvents) {
      createOrUpdateReplayMap(map, regularEvents, loadedRoutes, edgePoints, multiEvents);
      if (!getMapPointIfExist(selectedEventId)) {
        cleanMapFeature();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, regularEvents, loadedRoutes, edgePoints, routeHistoryLoaded, multiEvents]);

  useEffect(() => {
    if (selectedEventId && map && routeHistoryLoaded && regularEvents && edgePoints && multiEvents) {
      const data = getMapPointIfExist(selectedEventId);
      if (!data?.eventId || !data.coordinates || !data.layerId) {
        cleanMapFeature();

        return;
      }
      flyToEvent(data.eventId, data.coordinates, map, true);
      selectPoint(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevAppLanguage]);

  useEffect(() => {
    if (selectedEventId && map && routeHistoryLoaded && regularEvents && edgePoints && multiEvents) {
      cleanMapFeature();
      replayMapEventEmitter.dispatch(TABLE_OUT_EVENT, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevStartDate, prevEndDate]);

  return { handleClick, handleTableClick };
};
