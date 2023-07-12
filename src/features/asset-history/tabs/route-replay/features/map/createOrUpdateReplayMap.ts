import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { Feature } from 'geojson';

import { EnrichedEventData, MultiEvent } from '../../types';

import {
  EDGE_POINT_SOURCE_NAME,
  MULTI_EVENT_SOURCE_NAME,
  ROUTE_SOURCE_NAME,
  SINGLE_EVENT_SOURCE_NAME,
} from './constants';
import {
  autoZoom,
  createReplayMapLayers,
  getGeoJSONEdgePointData,
  getGeoJSONEventData,
  getGeoJSONMultiEventData,
  removeReplayMapLayers,
  updateMapSourceData,
} from './utils';

export function createOrUpdateReplayMap(
  map: mapboxgl.Map,
  events: EnrichedEventData[],
  loadedRoutes: Feature,
  edgePoints: EnrichedEventData[],
  multiEvents: MultiEvent[]
) {
  if (!map) {
    return;
  }

  const eventsData = getGeoJSONEventData(events);
  const edgePointsData = getGeoJSONEdgePointData(edgePoints);
  const multiEventData = getGeoJSONMultiEventData(multiEvents);

  const isCreateMode = !(map.getSource(SINGLE_EVENT_SOURCE_NAME) as GeoJSONSource);

  if (isCreateMode) {
    removeReplayMapLayers(map);
    createReplayMapLayers(map);
  }

  updateMapSourceData(map, EDGE_POINT_SOURCE_NAME, edgePointsData);
  updateMapSourceData(map, SINGLE_EVENT_SOURCE_NAME, eventsData);
  updateMapSourceData(map, ROUTE_SOURCE_NAME, loadedRoutes);
  updateMapSourceData(map, MULTI_EVENT_SOURCE_NAME, multiEventData);

  autoZoom(eventsData, edgePointsData, multiEventData, map, loadedRoutes);
}
