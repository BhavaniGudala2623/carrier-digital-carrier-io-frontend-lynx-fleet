import { useEffect } from 'react';

import { BatteryManagementTabs } from '../types';
import { resetStore } from '../stores/batteryManagement/batteryManagementAction';

import { BatteryManagementHeader } from './BatteryManagementHeader';
import { LazyTabPanel } from './Tabs/LazyTabPanels';
import { OverviewTab } from './Tabs/OverviewTab';
import { ElectricAssetsTab } from './Tabs/ElectricAssetsTab';
import { BatteryNotificationsTab } from './Tabs/BatteryNotificationsTab';

import { TableBox } from '@/components/TableBox';
import { useAppDispatch } from '@/stores';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const BatteryManagement = () => {
  const dispatch = useAppDispatch();
  const { featureFlags: { REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST } = {} } = useApplicationContext();

  useEffect(
    () => () => {
      resetStore(dispatch);
    },
    [dispatch]
  );

  return (
    <TableBox>
      <BatteryManagementHeader />
      <LazyTabPanel
        tabId={BatteryManagementTabs.OverviewTabView}
        key={BatteryManagementTabs.OverviewTabView}
        panelSx={{ height: '100%', overflow: 'auto' }}
      >
        <OverviewTab />
      </LazyTabPanel>
      <LazyTabPanel
        tabId={BatteryManagementTabs.ElectricAssetsTabView}
        key={BatteryManagementTabs.ElectricAssetsTabView}
        panelSx={{ height: '100%' }}
      >
        <ElectricAssetsTab />
      </LazyTabPanel>
      {REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST && (
        <LazyTabPanel
          tabId={BatteryManagementTabs.NotificationsTabView}
          key={BatteryManagementTabs.NotificationsTabView}
          panelSx={{ height: '100%' }}
        >
          <BatteryNotificationsTab />
        </LazyTabPanel>
      )}
    </TableBox>
  );
};
