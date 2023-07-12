import Box from '@carrier-io/fds-react/Box';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@carrier-io/fds-react/styles';
import { SOCCompanyFilter } from '@carrier-io/lynx-fleet-types';

import { StateOfChargeWidget } from '../../StateOfChargeWidget/StateOfChargeWidget';
import { BatteryNotificationsWidget } from '../../BatteryNotificationsWidget';
import {
  getBatteryNotificationsWidgetAction,
  getStateOfChargeAction,
} from '../../../stores/batteryManagement/batteryManagementAction';
import {
  getBatteryNotificationsWidgetCriticalityFilter,
  getBatteryNotificationsWidgetSort,
  getBatteryNotificationsWidgetTimePeriodFilter,
  getSelectedRecentlyOnlineAndAllFilter,
} from '../../../stores/batteryManagement/batteryManagementSelectors';
import { BatteryManagementFilterPanel } from '../../BatteryManagementFilterPanel';
import { getSelectedNodeAndChildIds } from '../../../utils/index';

import { useAppDispatch, useAppSelector } from '@/stores';
import { getAuth } from '@/features/authentication';
import { getTreeData } from '@/components';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const OverviewTab = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { featureFlags: { REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST } = {} } = useApplicationContext();

  const theme = useTheme();
  const recentlyOnlineAndAllFilter = useAppSelector(getSelectedRecentlyOnlineAndAllFilter);
  const BatteryNotificationsWidgetSort = useAppSelector(getBatteryNotificationsWidgetSort);
  const batteryNotificationsWidgetTimePeriodFilter = useAppSelector(
    getBatteryNotificationsWidgetTimePeriodFilter
  );

  const batteryNotificationsWidgetCriticalityFilter = useAppSelector(
    getBatteryNotificationsWidgetCriticalityFilter
  );

  const stateOfChargeErrorMessage = t(
    'battery.management.battery.overview.soc.error-loading-battery-information'
  );

  const batteryNotificationsWidgetErrorMessage = t('battery.management.battery.overview.notifications.error');

  const { tenantsHierarchy } = useAppSelector(getAuth);
  const treeData = useMemo(() => getTreeData(t, tenantsHierarchy), [t, tenantsHierarchy]);
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();
  const [allCompanyFilter, setAllCompanyFilter] = useState<SOCCompanyFilter | null>(null);
  useEffect(() => {
    const [selectedNodeType, filteredChildIds] = getSelectedNodeAndChildIds(
      selectedCompanyHierarchy,
      treeData
    );
    setAllCompanyFilter({ type: selectedNodeType, ids: filteredChildIds });
  }, [selectedCompanyHierarchy, treeData]);

  useEffect(() => {
    if (allCompanyFilter) {
      getStateOfChargeAction(
        dispatch,
        recentlyOnlineAndAllFilter,
        allCompanyFilter,
        stateOfChargeErrorMessage
      );
    }
  }, [dispatch, recentlyOnlineAndAllFilter, stateOfChargeErrorMessage, allCompanyFilter]);

  useEffect(() => {
    if (allCompanyFilter && REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST) {
      getBatteryNotificationsWidgetAction(
        dispatch,
        allCompanyFilter,
        batteryNotificationsWidgetErrorMessage,
        batteryNotificationsWidgetCriticalityFilter,
        BatteryNotificationsWidgetSort,
        batteryNotificationsWidgetTimePeriodFilter
      );
    }
  }, [
    dispatch,
    BatteryNotificationsWidgetSort,
    batteryNotificationsWidgetErrorMessage,
    allCompanyFilter,
    REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST,
    batteryNotificationsWidgetTimePeriodFilter,
    batteryNotificationsWidgetCriticalityFilter.action,
    batteryNotificationsWidgetCriticalityFilter.attention,
    batteryNotificationsWidgetCriticalityFilter,
  ]);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <BatteryManagementFilterPanel />
      <Box overflow="auto">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            [theme.breakpoints.down(1280)]: {
              gridTemplateColumns: '1fr',
            },
          }}
        >
          <BatteryNotificationsWidget />
          <StateOfChargeWidget />
        </Box>
      </Box>
    </Box>
  );
};
