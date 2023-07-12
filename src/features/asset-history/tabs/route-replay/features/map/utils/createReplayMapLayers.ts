import mapboxgl from 'mapbox-gl';

import {
  EDGE_POINT_LAYER_ID,
  MAP_HOVER_EVENT,
  MAP_HOVER_OUT_EVENT,
  MARKER_SELECT_EVENT,
  MARKER_UNSELECT_EVENT,
  MULTI_EVENT_LAYER_ID,
  SINGLE_EVENT_LAYER_ID,
  TABLE_HOVER_EVENT,
  TABLE_OUT_EVENT,
} from '../constants';
import { MapFeature } from '../../../types';

import { replayMapEventEmitter } from './replayMapEventEmitter';
import { getFeature } from './getFeature';
import { createMapSource } from './createMapSource';
import { createEventStaticLayer } from './createEventStaticLayer';
import { createActiveEffectLayer } from './createActiveEffectLayer';
import { createHoverEffectLayer } from './createHoverEffectLayer';

export const createReplayMapLayers = (map: mapboxgl.Map) => {
  let hoveredEventId: string | null = null;
  let hoveredFeature: MapFeature | null;
  let hoveredMarkerTimestamp: number | null;
  let selectedEventId: string | null = null;

  const setFeatureHovered = (eventId: string, source: string, id: string | number) => {
    hoveredFeature = { source, id };
    map.setFeatureState(hoveredFeature, { hover: true });
    hoveredEventId = eventId;
  };

  const setFeatureHoveredOff = () => {
    if (hoveredFeature) {
      map.setFeatureState(hoveredFeature, { hover: false });
      hoveredFeature = null;
      hoveredEventId = null;
    }
  };

  createMapSource(map);
  createEventStaticLayer(map);
  createHoverEffectLayer(map);
  createActiveEffectLayer(map);

  replayMapEventEmitter.on(TABLE_HOVER_EVENT, (data) => {
    const { eventId, layerId, multiEventId } = data;
    if (!eventId || !layerId) {
      return;
    }
    if (eventId === hoveredEventId) {
      setFeatureHoveredOff();

      return;
    }
    const feature = getFeature(multiEventId || eventId, map, layerId);
    if (feature?.id != null) {
      setFeatureHovered(eventId, layerId, feature.id);
    }
  });

  replayMapEventEmitter.on(TABLE_OUT_EVENT, () => {
    if (hoveredFeature) {
      setFeatureHoveredOff();
    }
  });

  replayMapEventEmitter.on(MARKER_SELECT_EVENT, (data) => {
    if (!data?.eventId) {
      return;
    }
    selectedEventId = data?.eventId;
    if (selectedEventId === hoveredEventId) {
      setFeatureHoveredOff();
    }
  });

  replayMapEventEmitter.on(MARKER_UNSELECT_EVENT, (data) => {
    const { eventId, source, id } = data;
    if (eventId && source && id != null) {
      selectedEventId = null;
      setFeatureHovered(eventId, source, id);
    }
  });

  map.on('mousemove', [SINGLE_EVENT_LAYER_ID, MULTI_EVENT_LAYER_ID, EDGE_POINT_LAYER_ID], (e) => {
    // eslint-disable-next-line no-param-reassign
    map.getCanvas().style.cursor = 'pointer';
    const features = map.queryRenderedFeatures(e.point, {
      layers: [EDGE_POINT_LAYER_ID, MULTI_EVENT_LAYER_ID, SINGLE_EVENT_LAYER_ID],
    });
    if (e.originalEvent.timeStamp === hoveredMarkerTimestamp || !features || features.length < 1) {
      return;
    }
    const { id, properties, layer } = features[0];
    if (id == null || !properties?.eventId || layer?.id == null || hoveredEventId === properties.eventId) {
      return;
    }
    if (hoveredFeature) {
      map.setFeatureState(hoveredFeature, { hover: false });
    }
    if (properties.eventId === selectedEventId) {
      return;
    }
    setFeatureHovered(properties.eventId, layer.id, id);
    hoveredMarkerTimestamp = e.originalEvent.timeStamp;
    replayMapEventEmitter.dispatch(MAP_HOVER_EVENT, { eventId: hoveredEventId });
  });

  map.on('mouseleave', [SINGLE_EVENT_LAYER_ID, MULTI_EVENT_LAYER_ID, EDGE_POINT_LAYER_ID], () => {
    // eslint-disable-next-line no-param-reassign
    map.getCanvas().style.cursor = '';
    if (hoveredFeature) {
      setFeatureHoveredOff();
      replayMapEventEmitter.dispatch(MAP_HOVER_OUT_EVENT, {});
    }
  });
};
