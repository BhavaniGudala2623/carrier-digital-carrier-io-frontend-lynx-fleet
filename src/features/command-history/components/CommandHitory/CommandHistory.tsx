import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangePicker } from '@carrier-io/fds-react/DateTime/DateRangePicker';
import SearchBox from '@carrier-io/fds-react/patterns/SearchBox';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { getDateFormat } from '@carrier-io/lynx-fleet-common';

import { CommandHistoryTable } from '../CommandHistoryTable';
import { useCommandHistoryPageContext } from '../../providers';

import { TableBox, TableBoxHeader } from '@/components/TableBox';
import { useSearch } from '@/hooks';
import { useUserSettings } from '@/providers/UserSettings';
import { getDateInputMask } from '@/utils';

export const CommandHistory = () => {
  const { t } = useTranslation();

  const { userSettings } = useUserSettings();
  const { dateFormat } = userSettings;

  const { searchText, handleSearchBoxChange } = useSearch();
  const {
    commands: commandHistoryData,
    commandsLoading: isHistoryLoading,
    dateRange,
    handleDateRangeChange,
  } = useCommandHistoryPageContext();

  const inputDateFormat = useMemo(() => getDateFormat(dateFormat, { variant: 'date' }), [dateFormat]);
  const inputDateMask = useMemo(() => getDateInputMask(inputDateFormat), [inputDateFormat]);

  return (
    <TableBox>
      <TableBoxHeader>
        <DateRangePicker
          startLabelText={t('common.start')}
          endLabelText={t('common.end')}
          value={dateRange}
          onChange={handleDateRangeChange}
          size="small"
          inputFormat={inputDateFormat}
          mask={inputDateMask}
        />
        <SearchBox
          multiple={false}
          TextFieldProps={{
            placeholder: t('common.search'),
            value: searchText,
            showBorder: false,
          }}
          onChange={handleSearchBoxChange}
          size="small"
          sx={{
            width: '352px',
          }}
          filledInputStyles={{ backgroundColor: fleetThemeOptions.palette.addition.filledInputBackground }}
        />
      </TableBoxHeader>
      <CommandHistoryTable
        isHistoryLoading={isHistoryLoading}
        data={commandHistoryData}
        dateRange={dateRange}
        searchText={searchText}
      />
    </TableBox>
  );
};
