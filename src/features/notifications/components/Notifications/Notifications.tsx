import { useEffect, useMemo, useState } from 'react';
import SearchBox from '@carrier-io/fds-react/patterns/SearchBox';
import { useTranslation } from 'react-i18next';
import { DateRangePicker } from '@carrier-io/fds-react/DateTime/DateRangePicker';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { getDateFormat } from '@carrier-io/lynx-fleet-common';

import { fetchNotifications } from '../../stores';
import { NotificationsTable } from '../NotificationsTable';
import { AddNotificationButton } from '../AddNotificationButton';

import { ExportButton } from '@/components';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { TableBox, TableBoxHeader } from '@/components/TableBox';
import { useDateRange, useSearch } from '@/hooks';
import { fetchGeofenceGroups, fetchGeofences } from '@/stores/assets';
import { HasPermission } from '@/features/authorization';
import { useUserSettings } from '@/providers/UserSettings';
import { getDateInputMask } from '@/utils';

export const Notifications = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const tenantId = useAppSelector(getAuthTenantId);

  const [exportCsv, setExportCsv] = useState(false);
  const [exportExcel, setExportExcel] = useState(false);

  const { searchText, handleSearchBoxChange } = useSearch();
  const { dateRange, handleDateRangeChange } = useDateRange([null, null]);

  const { userSettings } = useUserSettings();
  const { dateFormat } = userSettings;

  const handleCsvExport = () => {
    setExportCsv(true);
    setTimeout(() => {
      setExportCsv(false);
    });
  };

  const handleExcelExport = () => {
    setExportExcel(true);
    setTimeout(() => {
      setExportExcel(false);
    });
  };

  useEffect(() => {
    const request = { isCancelled: false };

    dispatch(fetchNotifications(request));
    dispatch(fetchGeofences(request));
    dispatch(fetchGeofenceGroups(request));

    return () => {
      request.isCancelled = true;
    };
  }, [dispatch]);

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
      <HasPermission action="notification.list" subjectId={tenantId} subjectType="COMPANY">
        <NotificationsTable
          exportCsv={exportCsv}
          exportExcel={exportExcel}
          headerContent={
            <>
              <ExportButton onExportCsv={handleCsvExport} onExportExcel={handleExcelExport} sx={{ mr: 1 }} />
              <AddNotificationButton />
            </>
          }
          searchText={searchText}
          dateRange={dateRange}
        />
      </HasPermission>
    </TableBox>
  );
};
