import Box from '@carrier-io/fds-react/Box';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { DateRangePicker } from '@carrier-io/fds-react/DateTime/DateRangePicker';
import { getDateFormat } from '@carrier-io/lynx-fleet-common';
import { useTranslation } from 'react-i18next';
import { zonedTimeToUtc } from 'date-fns-tz';

import { setBatteryNotificationsListDateRange } from '../../../stores/batteryManagement/batteryManagementAction';

import { BatteryNotificationsTable } from './BatteryNotificationsTable';

import { useDateRange } from '@/hooks';
import { TableBoxHeader } from '@/components/TableBox';
import { Loader } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';
import { getDateInputMask, formatUtcTimeStamp } from '@/utils';
import { MS_PER_DAY } from '@/constants';
import { useAppDispatch } from '@/stores';
import { DateRangeFilter } from '@/features/battery-management/types';

export const BatteryNotificationsTab = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { dateRange, handleDateRangeChange } = useDateRange([
    new Date(new Date().getTime() - 7 * MS_PER_DAY),
    new Date(),
  ]);
  const [rowLoading, setRowLoading] = useState<boolean>(true);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [reLoading, setReLoading] = useState<boolean>(false);
  const { userSettings } = useUserSettings();
  const { dateFormat, timezone } = userSettings;

  const inputDateFormat = useMemo(() => getDateFormat(dateFormat, { variant: 'date' }), [dateFormat]);
  const inputDateMask = useMemo(() => getDateInputMask(inputDateFormat), [inputDateFormat]);

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const onDateChage = useCallback(() => {
    const startDate = dateRange[0]
      ? formatUtcTimeStamp(
          zonedTimeToUtc(dateRange[0]?.setHours(23, 59, 59, 999), timezone).toISOString(),
          '00:00:00Z'
        )
      : '';
    const endDate = dateRange[1]
      ? formatUtcTimeStamp(
          zonedTimeToUtc(dateRange[1]?.setHours(23, 59, 59, 999), timezone).toISOString(),
          '23:59:59Z'
        )
      : '';
    setBatteryNotificationsListDateRange(dispatch, { startDate, endDate } as DateRangeFilter);
  }, [dateRange, timezone, dispatch]);

  useEffect(() => {
    setDatePickerOpen(false);
  }, [dateRange]);

  useEffect(() => {
    if (!datePickerOpen) {
      onDateChage();
    }
  }, [datePickerOpen, onDateChage]);

  return (
    <Box position="relative" display="flex" flexDirection="column" height="100%">
      <TableBoxHeader>
        <Box
          onClick={() => {
            setDatePickerOpen(true);
          }}
        >
          <DateRangePicker
            open={datePickerOpen}
            startLabelText={t('common.start')}
            endLabelText={t('common.end')}
            value={dateRange}
            onChange={handleDateRangeChange}
            size="small"
            inputFormat={inputDateFormat}
            mask={inputDateMask}
          />
        </Box>
      </TableBoxHeader>
      <Box position="relative" flex={1} height="100%">
        <BatteryNotificationsTable
          setRowLoading={setRowLoading}
          setFirstLoading={setFirstLoading}
          setReLoading={setReLoading}
        />
        {firstLoading && (
          <div>
            <Loader overlay />
          </div>
        )}
        {rowLoading && !firstLoading && !reLoading && (
          <Box
            sx={{
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: '85px',
              width: '100%',
            }}
          >
            <Loader overlay size={30} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
