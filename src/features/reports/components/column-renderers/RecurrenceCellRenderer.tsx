import { ICellRendererParams } from '@ag-grid-community/core';
import { useTranslation } from 'react-i18next';

import { crontabToFrequencyRenderer } from '../../utils';

type RecurrenceCellRendererProps = Omit<ICellRendererParams, 'value'> & { value: string };

const CRONTAB_TRANSLATION_MAPPING: Record<string, string>[] = [
  {
    key: 'assets.reports.grid.crontab.custom',
    value: 'custom',
  },
  {
    key: 'assets.reports.grid.crontab.daily',
    value: 'daily',
  },
  {
    key: 'assets.reports.grid.crontab.daily-custom',
    value: 'daily, custom',
  },
  {
    key: 'assets.reports.grid.crontab.minute',
    value: 'every minute',
  },
  {
    key: 'assets.reports.grid.crontab.hourly',
    value: 'hourly',
  },
  {
    key: 'assets.reports.grid.crontab.hourly-custom',
    value: 'hourly, custom',
  },
  {
    key: 'assets.reports.grid.crontab.minutes',
    value: 'minutes',
  },
  {
    key: 'assets.reports.grid.crontab.minute-custom',
    value: 'minutes, custom',
  },
  {
    key: 'assets.reports.grid.crontab.monthly',
    value: 'monthly',
  },
  {
    key: 'assets.reports.grid.crontab.monthly-custom',
    value: 'monthly, custom',
  },
  {
    key: 'assets.reports.grid.crontab.daily-specific',
    value: 'specific days',
  },
  {
    key: 'assets.reports.grid.crontab.month-specific',
    value: 'specific months',
  },
  {
    key: 'assets.reports.grid.crontab.weekly',
    value: 'weekly',
  },
  {
    key: 'assets.reports.grid.crontab.weekly-custom',
    value: 'weekly, custom',
  },
];

export function RecurrenceCellRenderer({ value }: RecurrenceCellRendererProps): JSX.Element {
  const { t } = useTranslation();

  let translated = crontabToFrequencyRenderer(value);
  const match = CRONTAB_TRANSLATION_MAPPING.filter((f) => f.value === translated);
  if (match.length > 0) {
    const [first] = match;
    translated = t(first.key, { defaultValue: first.value });
  }

  return <span>{translated}</span>;
}
