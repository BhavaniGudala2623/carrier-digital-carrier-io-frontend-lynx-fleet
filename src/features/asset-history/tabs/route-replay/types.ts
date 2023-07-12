import { EventData, EventDataSourceType, FlespiData } from '@carrier-io/lynx-fleet-types';
import { LngLatLike } from 'mapbox-gl';

import { ColumnsEx, TemperatureSensorLocationType } from '@/types';

export type EventGeoProperties = {
  eventId: string;
  latitude: number;
  longitude: number;
};

export interface MultiEventGeoProperties extends EventGeoProperties {
  eventsCounter: number;
}

export interface EdgePointGeoProperties extends EventGeoProperties {
  iconImage: string;
  selectedIconImage: string;
  hoveredIconImage: string;
}

export interface Option {
  sourceType: EventDataSourceType;
  label: string;
}

export type RouteHistoryDefaultColIds = 'event' | 'time' | 'menu';

export type RouteHistoryColIdType = RouteHistoryDefaultColIds & keyof FlespiData;

export type RouteHistoryGroupIdType = '';

export type PopupPreviewDefaultColIds = 'event';

export type PopupPreviewColumns = ColumnsEx<
  EnrichedEventData,
  PopupPreviewDefaultColIds,
  RouteHistoryGroupIdType
>;

export type GenerateTimelineTableColumns = ColumnsEx<
  EnrichedEventData,
  RouteHistoryColIdType,
  RouteHistoryGroupIdType
>;

export type ConfiguredDeviceSensorsFields = TemperatureSensorLocationType[];

export type MultiEvent = {
  multiEventId: string;
  events: EnrichedEventData[];
  position_latitude: number;
  position_longitude: number;
  eventsCounter: number;
};

export type AllMapEvents = {
  regularEvents: EnrichedEventData[];
  multiEvents: MultiEvent[];
};

export type EnrichedEventData = EventData & Partial<FlespiData> & { name: string };

export type TableEventType = {
  eventId: string;
  layerId: string;
  coordinates: LngLatLike;
  multiEventId?: string;
  events?: EnrichedEventData[];
  isMapEvent?: boolean;
};

export type MapFeature = {
  source: string;
  id: string | number;
};
