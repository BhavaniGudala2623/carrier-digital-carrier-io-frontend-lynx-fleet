import { useEffect, useState, useRef } from 'react';
import {
  Maybe,
  AssetTimelineEvent,
  QuickDate,
  HistoryFrequency,
  EventHistoryRec,
} from '@carrier-io/lynx-fleet-types';

import { fetchEventHistoryAction, getAssetHistoryState } from '../../../stores';

import { usePrevious } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/stores';
import { useUserSettings } from '@/providers/UserSettings';
import { useApplicationContext } from '@/providers/ApplicationContext';

export interface UseEventHistoryProps {
  assetId: string;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  zoomOutStartDate: Maybe<Date>;
  zoomOutEndDate: Maybe<Date>;
  zoomOutQuickDate: Maybe<QuickDate>;
  onSetStartDate: (date: Maybe<Date>) => void;
  onSetEndDate: (date: Maybe<Date>) => void;
  onQuickDateChange: (date: Maybe<QuickDate>) => void;
  onSetZoomOutStartDate: (date: Maybe<Date>) => void;
  onSetZoomOutEndDate: (date: Maybe<Date>) => void;
  onSetZoomOutQuickDate: (date: Maybe<QuickDate>) => void;
  frequency: HistoryFrequency; // Could be used as param for fetchEventHistoryAction
}

const interpolateHistory = (history: Maybe<EventHistoryRec>[]): EventHistoryRec[] => {
  const lastValues: Record<string, unknown> = {};
  const keys = Object.keys(history[0] ?? {}) as (keyof EventHistoryRec)[];

  return (history.filter((item) => item) as EventHistoryRec[]).map((row) =>
    keys.reduce<EventHistoryRec>((acc, key) => {
      const isEmpty = !row[key] && row[key] !== false;
      if (!isEmpty) {
        lastValues[key] = row[key];
      }
      // The isEmpty check excludes false and number 0 for testing falsiness, but the same was not applied to lastvalue check
      // so added the 0 check alone - Bug LYNXFLT-6347
      if (!(isEmpty && (lastValues[key] || lastValues[key] === 0))) {
        return acc;
      }

      return {
        ...acc,
        [key]: lastValues[key],
      };
    }, row)
  );
};

export const useEventHistory = (props: UseEventHistoryProps) => {
  const {
    assetId,
    startDate,
    endDate,
    zoomOutStartDate,
    zoomOutEndDate,
    zoomOutQuickDate,
    onSetStartDate,
    onSetEndDate,
    onQuickDateChange,
    onSetZoomOutEndDate,
    onSetZoomOutQuickDate,
    onSetZoomOutStartDate,
    frequency,
  } = props;
  const dispatch = useAppDispatch();

  const { history, timelineEvents } = useAppSelector(getAssetHistoryState);
  const {
    userSettings: { timezone },
  } = useUserSettings();

  const [queryStartDate, setQueryStartDate] = useState<Maybe<Date>>(startDate);
  const [queryEndDate, setQueryEndDate] = useState<Maybe<Date>>(endDate);

  const [filteredHistory, setFilteredHistory] = useState<Maybe<EventHistoryRec[]> | undefined>([]);
  const [filteredTimelineEvents, setFilteredTimelineEvents] = useState<
    Maybe<Maybe<AssetTimelineEvent>[]> | undefined
  >([]);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);

  const { featureFlags } = useApplicationContext();

  const isFeatureTemperatureChartAndTableEnabled = featureFlags.REACT_APP_FEATURE_TEMPERATURE_CHART_AND_TABLE;
  const isFeatureCompartmentOnOffModeEnabled = featureFlags.REACT_APP_FEATURE_COMPARTMENT_ON_OFF_MODE;
  const isFeatureGeofenceTmpEventEnabled = featureFlags.REACT_APP_FEATURE_GEOFENCE_TMP_EVENT;

  const prevAssetId = useRef<Maybe<string>>(null);
  const prevFrequency = usePrevious(frequency);

  useEffect(() => {
    if (isFeatureTemperatureChartAndTableEnabled) {
      if (prevAssetId.current === assetId && prevFrequency === frequency) {
        return;
      }
    } else if (prevAssetId.current === assetId) {
      return;
    }

    if (zoomOutStartDate && zoomOutEndDate) {
      dispatch(
        fetchEventHistoryAction(
          assetId,
          zoomOutStartDate,
          zoomOutEndDate,
          timezone,
          frequency,
          isFeatureTemperatureChartAndTableEnabled,
          isFeatureCompartmentOnOffModeEnabled,
          isFeatureGeofenceTmpEventEnabled
        )
      );

      onSetStartDate(zoomOutStartDate);
      onSetEndDate(zoomOutEndDate);
      onQuickDateChange(zoomOutQuickDate);
      onSetZoomOutStartDate(null);
      onSetZoomOutEndDate(null);
      onSetZoomOutQuickDate(null);
    } else if (!isFirstLaunch) {
      dispatch(
        fetchEventHistoryAction(
          assetId,
          startDate,
          endDate,
          timezone,
          frequency,
          isFeatureTemperatureChartAndTableEnabled,
          isFeatureCompartmentOnOffModeEnabled,
          isFeatureGeofenceTmpEventEnabled
        )
      );
    }

    prevAssetId.current = assetId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    assetId,
    startDate,
    endDate,
    zoomOutEndDate,
    zoomOutStartDate,
    zoomOutQuickDate,
    timezone,
    isFirstLaunch,
    frequency,
    isFeatureTemperatureChartAndTableEnabled,
    isFeatureCompartmentOnOffModeEnabled,
    isFeatureGeofenceTmpEventEnabled,
  ]);

  // todo: refactor properly
  useEffect(() => {
    if (startDate === queryStartDate && endDate === queryEndDate) {
      return;
    }

    if (isFirstLaunch) {
      setIsFirstLaunch(false);
    }

    dispatch(
      fetchEventHistoryAction(
        assetId,
        startDate,
        endDate,
        timezone,
        frequency,
        isFeatureTemperatureChartAndTableEnabled,
        isFeatureCompartmentOnOffModeEnabled,
        isFeatureGeofenceTmpEventEnabled
      )
    );
    setQueryStartDate(startDate);
    setQueryEndDate(endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    startDate,
    endDate,
    assetId,
    timezone,
    isFeatureTemperatureChartAndTableEnabled,
    isFeatureCompartmentOnOffModeEnabled,
    isFeatureGeofenceTmpEventEnabled,
  ]);

  useEffect(() => {
    if (history) {
      setFilteredHistory(interpolateHistory(history));
    }
  }, [history]);

  useEffect(() => {
    if (timelineEvents) {
      setFilteredTimelineEvents(timelineEvents);
    }
  }, [timelineEvents]);

  return {
    filteredHistory,
    filteredTimelineEvents,
  };
};
