import { EventHistoryRec, HistoryFrequency, Maybe } from '@carrier-io/lynx-fleet-types';
import { range } from 'lodash-es';
import { TFunction } from 'i18next';

import { ILegendSettings } from '@/providers/ApplicationContext';
import { ChartConfig } from '@/types';

const getFrequencyMinutes = (frequency: HistoryFrequency): number[] => {
  switch (frequency) {
    case '5m':
      return range(0, 60, 5);
    case '15m':
      return range(0, 60, 15);
    case '1h':
      return [0];
    default:
      return range(0, 60, 1);
  }
};

export const getFrequencyMinutesNumber = (frequency: HistoryFrequency) => {
  switch (frequency) {
    case '1m':
      return 1;
    case '5m':
      return 5;
    case '15m':
      return 15;
    case '1h':
      return 60;
    default:
      return 15;
  }
};

export const getFilteredHistory = (
  history: Maybe<EventHistoryRec[]> | undefined,
  frequency: Maybe<HistoryFrequency>
) => {
  if (!frequency || frequency === '1m') {
    return history;
  }

  return history?.filter(
    (h) => h.timestamp && getFrequencyMinutes(frequency)?.includes(new Date(h.timestamp).getMinutes())
  );
};

export const getFilteredEvents = (
  history: Maybe<EventHistoryRec[]> | undefined,
  frequency: Maybe<HistoryFrequency>,
  legendSettings: ILegendSettings,
  chartConfig: ChartConfig | undefined
) => {
  const { columnsToDisplay } = legendSettings;

  if (!history || !frequency || frequency === '1m' || !chartConfig || !columnsToDisplay) {
    return history;
  }

  const events = chartConfig.events.children;
  const eventKeys = Object.keys(events);
  const visibleEvents = columnsToDisplay.filter((item) => eventKeys.includes(item));
  const visibleEventDataKeys = visibleEvents.map((item) => events[item].dataKey);
  const filteredHistory: EventHistoryRec[] = [];
  const frequencyMinutes = getFrequencyMinutes(frequency);
  let priorData: EventHistoryRec | null = null;

  for (const data of history) {
    if (!data.timestamp) {
      continue;
    }

    if (frequencyMinutes.includes(new Date(data.timestamp).getMinutes())) {
      filteredHistory.push(data);
      priorData = data;
    } else if (priorData) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const res = visibleEventDataKeys.filter((key) => key && data[key] !== priorData?.[key]);
      if (res.length) {
        filteredHistory.push(data);
        priorData = data;
      }
    }
  }

  return filteredHistory;
};

export const localizeHistoryFrequency = (frequency: Maybe<HistoryFrequency>, t: TFunction) => {
  switch (frequency) {
    case '1h':
      return `1${t('common.hours-short-h')}`;
    case '1m':
      return `1${t('common.minutes-short-m')}`;
    case '5m':
      return `5${t('common.minutes-short-m')}`;
    case '15m':
      return `15${t('common.minutes-short-m')}`;
    default:
      return '';
  }
};

export const getTRUStaus = (params) => {
  let powerStatus;
  if (params.data?.synthetic_tru_status === 'OFF') {
    powerStatus = false;
  } else if (params.column?.userProvidedColDef?.colId && params.data) {
    powerStatus = params.data[params.column?.userProvidedColDef?.colId];
  }

  return powerStatus;
};

export const isTruOn = (params) => {
  let isTRU = true;
  if (params.data?.synthetic_tru_status === 'OFF') {
    isTRU = false;
  }

  return isTRU;
};
