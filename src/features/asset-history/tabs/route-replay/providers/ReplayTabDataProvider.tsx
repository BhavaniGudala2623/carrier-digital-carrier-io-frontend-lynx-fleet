import { EventDataSourceType, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Feature } from 'geojson';
import { utcToZonedTime } from 'date-fns-tz';
import { useParams } from 'react-router-dom';
import { uniqBy } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { GridApi } from '@ag-grid-community/core';

import { EnrichedEventData, MapFeature, MultiEvent, Option } from '../types';
import { getRouteData } from '../features/map/utils';
import { enrichEvent, getConfiguredFlespiFields, getMapEventList } from '../utils';
import { useFetchAllEvents } from '../hooks/useFetchAllEvents';
import { useAssetHistoryPageContext } from '../../../providers';

import { getDateRangeEndDate, getDateRangeStartDateByEndDate, isDevStage } from '@/utils';
import { useNullableContext } from '@/hooks/useNullableContext';
import { useUserSettings } from '@/providers/UserSettings';
import { useApplicationContext } from '@/providers/ApplicationContext';

type ReplayTabDataContextValue = {
  filteredEvents: Maybe<EnrichedEventData[]>;
  loadedRoutes: Maybe<Feature>;
  edgePoints: EnrichedEventData[];
  routeHistoryLoading: boolean;
  routeHistoryLoaded: boolean;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  quickDate: Maybe<QuickDate>;
  onStartDateChange: (date: Maybe<Date>) => void;
  onEndDateChange: (date: Maybe<Date>) => void;
  onQuickDateChange: (date: Maybe<QuickDate>) => void;
  configuredFlespiFields: string[];
  regularEvents: EnrichedEventData[];
  multiEvents: MultiEvent[];
  selectedEventId: string;
  setSelectedEventId: (eventId: string) => void;
  searchOptions: Option[];
  gridApi: Maybe<GridApi<EnrichedEventData>>;
  setGridApi: (value: Maybe<GridApi<EnrichedEventData>>) => void;
  setSelectedEventType: (value: Maybe<EventDataSourceType>) => void;
  selectedEventType: Maybe<EventDataSourceType>;
  selectedFeature: Maybe<MapFeature>;
  setSelectedFeature: (value: Maybe<MapFeature>) => void;
  prevAppLanguage: Maybe<string>;
  prevStartDate: Maybe<string>;
  prevEndDate: Maybe<string>;
};

const ReplayTabDataContext = createContext<Maybe<ReplayTabDataContextValue>>(null);

const TEMPORARY_HIDDEN_EVENTS_DEV: EventDataSourceType[] = [
  // here should be disabled events
];

const TEMPORARY_HIDDEN_EVENTS: EventDataSourceType[] = [
  'NOTIFICATION_DOOR',
  'NOTIFICATION_FREEZER_SHUTDOWN_ACTIVE',
  'NOTIFICATION_GEOFENCE_LOCATION',
  'NOTIFICATION_LOW_BATTERY',
  'NOTIFICATION_REAR_DOOR_OPEN',
  'NOTIFICATION_SETPOINT_1',
  'NOTIFICATION_SETPOINT_2',
  'NOTIFICATION_SETPOINT_3',
  'NOTIFICATION_SIDE_DOOR_OPEN',
  'NOTIFICATION_TEMPERATURE_1',
  'NOTIFICATION_TEMPERATURE_2',
  'NOTIFICATION_TEMPERATURE_3',
  'NOTIFICATION_TEMPERATURE_OUT_OF_RANGE',
  'NOTIFICATION_TRU_ALARM',
];

export const useReplayTabDataContext = () => useNullableContext(ReplayTabDataContext);

export const ReplayTabDataProvider = ({ children }: { children: ReactNode }) => {
  const {
    userSettings: { timezone },
  } = useUserSettings();
  const { assetId = '' } = useParams<{ assetId: string }>();

  const { assetDetails, configuredCompartmentNumbers, compartmentConfig } = useAssetHistoryPageContext();

  const { flespiId } = assetDetails ?? {};

  const [route, setRoute] = useState<Maybe<Feature>>(null);

  const initialEndDate = useMemo(() => utcToZonedTime(getDateRangeEndDate(new Date()), timezone), [timezone]);
  const [startDate, setStartDate] = useState<Maybe<Date>>(getDateRangeStartDateByEndDate(initialEndDate, 1));
  const [endDate, setEndDate] = useState<Maybe<Date>>(initialEndDate);
  const [quickDate, setQuickDate] = useState<Maybe<QuickDate>>('24h');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [gridApi, setGridApi] = useState<Maybe<GridApi<EnrichedEventData>>>(null);
  const [selectedEventType, setSelectedEventType] = useState<Maybe<EventDataSourceType>>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(null);
  const { t } = useTranslation();
  const { featureFlags } = useApplicationContext();

  const compNumsFromCompartmentConfig = useMemo(
    () => ([1, 2, 3] as const).filter((compNum) => compartmentConfig?.[`comp${compNum}Configured`]),
    [compartmentConfig]
  );

  const configuredFlespiFields = useMemo(
    () =>
      getConfiguredFlespiFields(
        assetDetails?.sensors,
        featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE
          ? compNumsFromCompartmentConfig
          : configuredCompartmentNumbers,
        featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT
      ),
    [
      assetDetails?.sensors,
      compNumsFromCompartmentConfig,
      configuredCompartmentNumbers,
      featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE,
      featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT,
    ]
  );

  const { events, routeHistoryLoaded, routeHistoryLoading, prevAppLanguage, prevStartDate, prevEndDate } =
    useFetchAllEvents({
      startDate,
      endDate,
      assetId,
      flespiId,
      additionalFields: configuredFlespiFields,
    });

  useEffect(() => {
    if (events && routeHistoryLoaded) {
      const coordinatesSet = new Set<string>(
        events.map((item) => `${item.position_longitude},${item.position_latitude}`)
      );

      const coordinates = Array.from(coordinatesSet);

      getRouteData(coordinates).then((data) => setRoute(data));
    }
  }, [events, routeHistoryLoaded]);

  const tableEvents: EnrichedEventData[] = useMemo(
    () =>
      events
        // Filter to have only table events
        .filter((item) => item.sourceType !== 'SNAPSHOT' && item.sourceType !== 'POINT' && item?.eventId)
        .filter((item) =>
          isDevStage()
            ? !TEMPORARY_HIDDEN_EVENTS_DEV.includes(item.sourceType)
            : !TEMPORARY_HIDDEN_EVENTS.includes(item.sourceType)
        )
        // Enrich event with data from snapshot
        .map((item) => enrichEvent(item, events, t)),
    [events, t]
  );

  const searchOptions = useMemo(
    () =>
      uniqBy(tableEvents, 'name').map(({ sourceType, name }) => ({
        sourceType,
        label: name,
      })),
    [tableEvents]
  );

  const filteredEvents = useMemo(
    () =>
      tableEvents.filter(({ sourceType }) => {
        if (selectedEventType && ![selectedEventType].includes(sourceType)) {
          return false;
        }

        return true;
      }),
    [tableEvents, selectedEventType]
  );

  const loadedRoutes = useMemo(() => route, [route]);

  const edgePoints = useMemo(
    () => (tableEvents.length >= 2 ? [tableEvents[0], tableEvents[tableEvents.length - 1]] : []),
    [tableEvents]
  );

  const allMapEvents = useMemo(
    () =>
      getMapEventList(
        filteredEvents.filter(({ sourceType }) => !['START_POINT', 'END_POINT'].includes(sourceType))
      ),
    [filteredEvents]
  );

  const contextValue: ReplayTabDataContextValue = useMemo(
    () => ({
      filteredEvents,
      loadedRoutes,
      edgePoints,
      routeHistoryLoading,
      routeHistoryLoaded,
      onStartDateChange: setStartDate,
      onEndDateChange: setEndDate,
      onQuickDateChange: setQuickDate,
      startDate,
      endDate,
      quickDate,
      configuredFlespiFields,
      regularEvents: allMapEvents.regularEvents,
      multiEvents: allMapEvents.multiEvents,
      selectedEventId,
      setSelectedEventId,
      searchOptions,
      gridApi,
      setGridApi,
      selectedEventType,
      setSelectedEventType,
      selectedFeature,
      setSelectedFeature,
      prevAppLanguage,
      prevStartDate,
      prevEndDate,
    }),
    [
      edgePoints,
      loadedRoutes,
      routeHistoryLoading,
      routeHistoryLoaded,
      startDate,
      endDate,
      quickDate,
      configuredFlespiFields,
      allMapEvents,
      selectedEventId,
      setSelectedEventId,
      filteredEvents,
      searchOptions,
      gridApi,
      setGridApi,
      selectedEventType,
      selectedFeature,
      setSelectedFeature,
      prevAppLanguage,
      prevStartDate,
      prevEndDate,
    ]
  );

  return <ReplayTabDataContext.Provider value={contextValue}>{children}</ReplayTabDataContext.Provider>;
};
