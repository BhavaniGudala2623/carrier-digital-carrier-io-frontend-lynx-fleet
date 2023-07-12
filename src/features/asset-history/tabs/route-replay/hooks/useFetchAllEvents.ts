import { Maybe } from '@carrier-io/lynx-fleet-types';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MainService } from '@carrier-io/lynx-fleet-data-lib';
import { useTranslation } from 'react-i18next';

import { addStartEndPoints, getEventsPart } from '../utils';
import { getFormattedQueryDateTime } from '../../../../common';
import { EnrichedEventData } from '../types';

import { showMessage } from '@/stores/actions';
import { useUserSettings } from '@/providers/UserSettings';
import { useAppDispatch } from '@/stores';
import { useApplicationContext } from '@/providers/ApplicationContext';

export interface UseFetchAllEventsProps {
  assetId: string;
  flespiId?: Maybe<number>;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  additionalFields?: string[];
}

export const useFetchAllEvents = ({
  assetId,
  flespiId,
  startDate,
  endDate,
  additionalFields,
}: UseFetchAllEventsProps) => {
  const { t } = useTranslation();
  const {
    userSettings: { timezone },
  } = useUserSettings();
  const { appLanguage } = useApplicationContext();
  const dispatch = useAppDispatch();
  const [prevStartDate, setPrevStartDate] = useState<Maybe<string>>(
    getFormattedQueryDateTime(startDate, timezone, 0, 0)
  );
  const [prevEndDate, setPrevEndDate] = useState<Maybe<string>>(
    getFormattedQueryDateTime(endDate, timezone, 59, 999)
  );
  const [events, setEvents] = useState<EnrichedEventData[]>([]);
  const [routeHistoryLoaded, setRouteHistoryLoaded] = useState<boolean>(false);
  const [routeHistoryLoading, setRouteHistoryLoading] = useState<boolean>(false);
  const [routeHistoryError, setRouteHistoryError] = useState<null | string>(null);
  const [prevAppLanguage, setPrevAppLanguage] = useState<null | string>(null);
  const isFirstLaunch = useRef<boolean>(true);
  const prevAssetId = useRef<Maybe<string>>(assetId);
  const sessionId = useRef<string | null>(null);

  const { queryEndDate, queryStartDate } = useMemo(
    () => ({
      queryEndDate: getFormattedQueryDateTime(endDate, timezone, 59, 999),
      queryStartDate: getFormattedQueryDateTime(startDate, timezone, 0, 0),
    }),
    [endDate, startDate, timezone]
  );

  const startFetchRouteHistoryCall = useCallback(() => {
    setRouteHistoryLoaded(false);
    setRouteHistoryLoading(true);
    setRouteHistoryError(null);
    setEvents([]);
  }, [setEvents]);

  const restoreRouteHistoryState = useCallback(() => {
    setRouteHistoryLoaded(false);
    setRouteHistoryLoading(false);
    setRouteHistoryError(null);
    setEvents([]);
  }, [setEvents]);

  const routeHistoryEventsFetchedCall = useCallback(
    (data: EnrichedEventData[]) => {
      setRouteHistoryLoaded(true);
      setRouteHistoryLoading(false);
      setEvents(data);
    },
    [setEvents]
  );

  useEffect(() => {
    if (routeHistoryError) {
      showMessage(dispatch, routeHistoryError);
    }
  }, [dispatch, routeHistoryError]);

  const fetchAllEvents = useCallback(async () => {
    const newSessionId = nanoid();
    sessionId.current = newSessionId;
    if (!queryStartDate || !queryEndDate) {
      return;
    }
    isFirstLaunch.current = false;
    startFetchRouteHistoryCall();
    const data: EnrichedEventData[] = [];
    try {
      let nextToken: string | undefined;

      do {
        if (sessionId.current !== newSessionId) {
          // aborting the requests if new fetch is fired
          break;
        }

        const response = await MainService.getEvents(
          {
            input: {
              assetId,
              flespiId: flespiId ?? undefined,
              startDate: queryStartDate,
              endDate: queryEndDate,
              nextToken,
              additionalFields,
              appLanguage,
            },
          },
          'cache-first'
        );

        nextToken = response?.data.pageEvents?.nextToken || undefined;
        const result = response?.data.pageEvents.doc;
        const eventsPart = getEventsPart(result);

        if (eventsPart && eventsPart.length) {
          data.push(...eventsPart);
        }
      } while (nextToken);

      routeHistoryEventsFetchedCall(data.length > 0 ? addStartEndPoints(data) : data);
      setPrevStartDate(queryStartDate);
      setPrevEndDate(queryEndDate);
      prevAssetId.current = assetId;
      setPrevAppLanguage(appLanguage);

      if (data.length === 0) {
        setRouteHistoryError(`${t('common.route-replay')}: ${t('assethistory.asset-has-no-data')}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error on request route history', error);
      setRouteHistoryError('Error on request route history');
      routeHistoryEventsFetchedCall([]);
    }
  }, [
    queryStartDate,
    queryEndDate,
    startFetchRouteHistoryCall,
    routeHistoryEventsFetchedCall,
    assetId,
    flespiId,
    setRouteHistoryError,
    t,
    additionalFields,
    appLanguage,
  ]);

  useEffect(() => {
    if (
      (prevAssetId.current !== assetId ||
        queryStartDate !== prevStartDate ||
        queryEndDate !== prevEndDate ||
        appLanguage !== prevAppLanguage ||
        isFirstLaunch.current) &&
      queryStartDate &&
      queryEndDate
    ) {
      restoreRouteHistoryState();
      fetchAllEvents();
    }
  }, [
    appLanguage,
    assetId,
    fetchAllEvents,
    prevAppLanguage,
    prevEndDate,
    prevStartDate,
    queryEndDate,
    queryStartDate,
    restoreRouteHistoryState,
  ]);

  return {
    routeHistoryLoaded,
    routeHistoryLoading,
    events,
    prevAppLanguage,
    prevStartDate,
    prevEndDate,
  };
};
