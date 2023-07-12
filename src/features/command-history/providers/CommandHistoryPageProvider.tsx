import { Maybe } from '@carrier-io/lynx-fleet-types';
import { createContext, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRange as DateRangeType } from '@carrier-io/fds-react/DateTime/DateRangePicker';
import { addDays } from 'date-fns';

import { CommandHistoryPageItemWithSearchFields } from '../types';
import { useFetchCommandHistory } from '../hooks';

import { useDateRange, useNullableContext } from '@/hooks';

type CommandHistoryPageContextValue = {
  commands: CommandHistoryPageItemWithSearchFields[];
  commandsLoading: boolean;
  handleDateRangeChange: ([startDate, endDate]: DateRangeType<Date>) => void;
  dateRange: DateRangeType<Date>;
};

const CommandHistoryPageContext = createContext<Maybe<CommandHistoryPageContextValue>>(null);

export const useCommandHistoryPageContext = () => useNullableContext(CommandHistoryPageContext);

export const CommandHistoryPageProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();

  const { dateRange, handleDateRangeChange } = useDateRange();

  const { queryEndDate, queryStartDate } = useMemo(() => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    startDate?.setSeconds(0);
    startDate?.setMilliseconds(0);
    endDate?.setSeconds(0);
    endDate?.setMilliseconds(0);

    return {
      queryStartDate: startDate?.toISOString(),
      queryEndDate: endDate && addDays(endDate, 1).toISOString(),
    };
  }, [dateRange]);

  const { commands, commandsLoading } = useFetchCommandHistory(queryStartDate, queryEndDate, t);

  const contextValue: CommandHistoryPageContextValue = useMemo(
    () => ({
      commands,
      commandsLoading,
      handleDateRangeChange,
      dateRange,
    }),
    [commands, commandsLoading, handleDateRangeChange, dateRange]
  );

  return (
    <CommandHistoryPageContext.Provider value={contextValue}>{children}</CommandHistoryPageContext.Provider>
  );
};
