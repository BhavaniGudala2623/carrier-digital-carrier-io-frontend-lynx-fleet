import { useTranslation } from 'react-i18next';
import { ChangeEvent } from 'react';
import Tabs from '@carrier-io/fds-react/Tabs';
import Tab from '@carrier-io/fds-react/Tab';

import { BatteryManagementTabs } from '../../types/BatteryManagement';
import { updateSelectedTab } from '../../stores/batteryManagement/batteryManagementAction';
import { getSelectedTab } from '../../stores';

import { useAppDispatch, useAppSelector } from '@/stores';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const HeaderLeftContent = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedTab = useAppSelector(getSelectedTab);
  const { featureFlags: { REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST } = {} } = useApplicationContext();

  const handleTabChange = (_event: ChangeEvent<{}>, value: number) => {
    updateSelectedTab(dispatch, value as BatteryManagementTabs);
  };

  return (
    <Tabs
      sx={{ position: 'absolute', top: -8 }}
      value={selectedTab}
      onChange={handleTabChange}
      invertIndicator
    >
      <Tab
        sx={{ height: 60 }}
        label={t('battery.management.overview.tab')}
        value={BatteryManagementTabs.OverviewTabView}
      />
      <Tab
        sx={{ height: 60 }}
        label={t('battery.management.electric.assets.tab')}
        value={BatteryManagementTabs.ElectricAssetsTabView}
      />
      {REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST && (
        <Tab
          sx={{ height: 60 }}
          label={t('battery.management.battery.notifications.tab')}
          value={BatteryManagementTabs.NotificationsTabView}
        />
      )}
    </Tabs>
  );
};
