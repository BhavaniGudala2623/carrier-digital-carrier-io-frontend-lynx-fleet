import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Columns } from '@/types';
import { DEFAULT_COLUMN_WIDTH } from '@/constants';
import { dateTimeFormatter } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';

export const useGetBatteryNotificationColumns = (): Columns => {
  const { userSettings } = useUserSettings();
  const { timezone, temperature: temperatureUnits, dateFormat } = userSettings;
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        colId: 'createdAt',
        field: 'createdAt',
        headerName: t('battery.management.battery.notification.date-time'),
        headerTooltip: t('battery.management.battery.notification.date-time'),
        valueFormatter: (params) =>
          dateTimeFormatter(params.data?.notification?.createdAt, { dateFormat, timezone }),
        minWidth: 130,
      },
      {
        colId: 'notifications',
        field: 'notifications',
        headerName: t('battery.management.battery.notification.notifications'),
        headerTooltip: t('battery.management.battery.notification.notifications'),
        cellRenderer: 'NotificationsRenderer',
        minWidth: 250,
        cellStyle: { display: 'flex', alignItems: 'center', overflow: 'hidden' },
      },
      {
        colId: 'assetName',
        field: 'assetName',
        headerName: t('battery.management.battery.notification.asset-name'),
        headerTooltip: t('battery.management.battery.notification.asset-name'),
        cellRenderer: 'AssetNameRenderer',
        minWidth: DEFAULT_COLUMN_WIDTH,
      },
      {
        colId: 'details',
        field: 'details',
        headerName: t('battery.management.battery.notification.details'),
        headerTooltip: t('battery.management.battery.notification.details'),
        cellRendererParams: {
          temperatureUnits,
        },
        cellRenderer: 'DetailsRenderer',
        cellStyle: { display: 'flex', alignItems: 'center', overflow: 'hidden' },
        minWidth: 300,
      },
      {
        colId: 'recommendedSteps',
        field: 'recommendedSteps',
        headerName: t('battery.management.battery.notification.recommended-steps'),
        headerTooltip: t('battery.management.battery.notification.recommended-steps'),
        cellRendererParams: {
          temperatureUnits,
        },
        cellRenderer: 'RecommendedStepsRenderer',
        cellStyle: { display: 'flex', alignItems: 'center', overflow: 'hidden' },
        minWidth: 300,
      },
      {
        colId: 'criticality',
        field: 'criticality',
        headerName: t('battery.management.battery.notification.criticality'),
        headerTooltip: t('battery.management.battery.notification.criticality'),
        cellRenderer: 'CriticalityRenderer',
        minWidth: 140,
      },
    ],
    [dateFormat, t, temperatureUnits, timezone]
  );
};
