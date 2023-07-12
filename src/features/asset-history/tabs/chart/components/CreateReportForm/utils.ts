// Option 1 - use 15 minute interval

import { DateFormatType } from '@carrier-io/lynx-fleet-common';
import { FlespiData, Maybe } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

import { localizeHistoryFrequency } from '../EventHistoryTable/utils';
import { ReportFormData } from '../../types';

import { formatDate } from '@/utils';

// Option 2 - limit max rows to 200
const getOption: () => 1 | 2 = () => 2;

export const minimizeTableHistory = (source: Maybe<FlespiData>[], binTimeMinutes?: number) => {
  const option = getOption();
  const maxRowsForOption2 = 200;

  const result: Maybe<FlespiData>[] = [];

  if (option === 1) {
    if (binTimeMinutes === 1) {
      let idx = 0;
      while (idx < source.length - 1) {
        result.push(source[idx]);
        idx += 15;
      }

      if (source.length > 1) {
        result.push(source[source.length - 1]);
      }

      return result;
    }
  }

  if (option === 2) {
    if (source.length > maxRowsForOption2) {
      const step = source.length / maxRowsForOption2;
      let idx = 0;
      let floatIdx = 0;

      while (idx < source.length - 1) {
        result.push(source[idx]);
        floatIdx += step;
        idx = Math.floor(floatIdx);
      }

      if (source.length > 1) {
        result.push(source[source.length - 1]);
      }

      return result;
    }
  }

  return result.length ? result : source;
};

export const getIncludeInReport = (t, values) => [
  { value: values.tempChart, label: t('assethistory.graph.temperature-chart'), name: 'tempChart' },
  { value: values.events, label: t('assethistory.graph.events'), name: 'events' },
  { value: values.legend, label: t('assethistory.graph.legend'), name: 'legend' },
  { value: values.table, label: t('assets.management.assets.table'), name: 'table' },
];

export const getDescriptionData = (
  t: TFunction,
  data: ReportFormData,
  timeframe: string | JSX.Element,
  dateFormat: DateFormatType
) => [
  {
    label: t('assets.management.company'),
    value: data.tenantName,
  },
  {
    label: t('assets.management.fleets'),
    value: data.fleetNames?.join(', ') || t('common.n-a'),
  },
  {
    label: t('assets.management.asset-name'),
    value: data.assetName,
  },
  {
    label: t('assets.management.license-plate'),
    value: data.licensePlate,
  },
  {
    label: t('assets.management.tru-serial'),
    value: data.truSerial,
  },
  {
    label: t('assets.asset.table.tru-control-system-type'),
    value: data.truSystemType,
  },
  {
    label: t('assethistory.report.starts-on'),
    value: formatDate(data.startDate, dateFormat),
  },
  {
    label: t('assethistory.report.ends-on'),
    value: formatDate(data.endDate, dateFormat),
  },
  {
    label: t('assethistory.report.timeframe'),
    value: timeframe,
  },
  {
    label: t('assethistory.report.table-interval'),
    value: localizeHistoryFrequency(data.frequency, t),
  },
];
