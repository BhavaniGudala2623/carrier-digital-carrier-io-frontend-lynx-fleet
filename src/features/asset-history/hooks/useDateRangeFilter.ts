import { HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import { addDays } from 'date-fns';
import { useCallback } from 'react';
import { utcToZonedTime } from 'date-fns-tz';

import { useUserSettings } from '@/providers/UserSettings';
import { getDateRangeEndDate, getDateRangeStartDateByEndDate } from '@/utils';

interface UseDateRangeFilterProps {
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  onStartDateChange: (date: Maybe<Date>) => void;
  onEndDateChange: (date: Maybe<Date>) => void;
  onQuickDateChange: (date: Maybe<QuickDate>) => void;
  onSelectedViewChange: (view: Maybe<number>) => void;
  onFrequencyChange: (value: HistoryFrequency) => void;
}

export const useDateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onQuickDateChange,
  onSelectedViewChange,
  onFrequencyChange,
}: UseDateRangeFilterProps) => {
  const {
    userSettings: { timezone },
  } = useUserSettings();

  const handleChangeQuickDate = useCallback(
    (newValue: Maybe<QuickDate>, newFrequency?: Maybe<HistoryFrequency>, resetSelectedView = true) => {
      const currentDateTime = utcToZonedTime(getDateRangeEndDate(new Date()), timezone);
      switch (newValue) {
        case '24h':
          onStartDateChange(getDateRangeStartDateByEndDate(currentDateTime, 1));
          break;
        case '48h':
          onStartDateChange(getDateRangeStartDateByEndDate(currentDateTime, 2));
          break;
        case '7d':
          onStartDateChange(getDateRangeStartDateByEndDate(currentDateTime, 7));
          break;
        default:
      }
      onEndDateChange(currentDateTime);
      onQuickDateChange(newValue);
      if (newFrequency) {
        onFrequencyChange(newFrequency);
      }
      if (resetSelectedView) {
        onSelectedViewChange(null);
      }
    },
    [timezone, onEndDateChange, onQuickDateChange, onStartDateChange, onFrequencyChange, onSelectedViewChange]
  );

  const handleStartDateChange = (value: Maybe<Date>) => {
    onQuickDateChange(null);
    onSelectedViewChange(null);
    onStartDateChange(value);
    onEndDateChange(value ? addDays(value, 1) : null);
    if (value && endDate && value >= endDate) {
      onEndDateChange(value);
    }
  };

  const handleEndDateChange = (value: Maybe<Date>) => {
    onQuickDateChange(null);
    onSelectedViewChange(null);
    onEndDateChange(value);
    if (value && startDate && value < startDate) {
      onStartDateChange(value);
    }
  };

  return { handleChangeQuickDate, handleStartDateChange, handleEndDateChange };
};
