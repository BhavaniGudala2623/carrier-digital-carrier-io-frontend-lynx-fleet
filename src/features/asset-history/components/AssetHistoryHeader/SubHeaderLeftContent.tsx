import { useMemo, ChangeEvent } from 'react';
import Tabs from '@carrier-io/fds-react/Tabs';
import Tab from '@carrier-io/fds-react/Tab';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { useTranslation } from 'react-i18next';

import { AssetHistoryTabs } from '../../types';
import { assetHistorySlice } from '../../stores';

import { getAuthTenantId } from '@/features/authentication';
import { useAppDispatch, useAppSelector } from '@/stores';
import { companyActionPayload } from '@/features/authorization';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const SubHeaderLeftContent = ({
  selectedTab,
  onTabChange,
}: {
  selectedTab: AssetHistoryTabs;
  onTabChange: (x: AssetHistoryTabs) => void;
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useRbac();
  const { featureFlags } = useApplicationContext();

  const tenantId = useAppSelector(getAuthTenantId);
  const dispatch = useAppDispatch();

  const assetHistoryAllowed = useMemo(
    () => hasPermission(companyActionPayload('dashboard.assetHistoryList', tenantId)),
    [hasPermission, tenantId]
  );

  const eventHistoryAllowed = useMemo(
    () => hasPermission(companyActionPayload('dashboard.eventHistoryList', tenantId)),
    [hasPermission, tenantId]
  );

  const routeReplayListAllowed = useMemo(
    () => hasPermission(companyActionPayload('dashboard.routeReplayList', tenantId)),
    [hasPermission, tenantId]
  );

  const handleTabChange = (_event: ChangeEvent<{}>, value: number) => {
    dispatch(assetHistorySlice.actions.setEmptyDataMessageShown(false));
    onTabChange(value as AssetHistoryTabs);
  };

  return (
    <Tabs
      sx={{ position: 'absolute', top: -8 }}
      value={selectedTab}
      onChange={handleTabChange}
      invertIndicator
    >
      {featureFlags.REACT_APP_FEATURE_ROUTE_REPLAY_TAB && routeReplayListAllowed && (
        <Tab
          sx={{ height: 60 }}
          label={t('common.route-replay')}
          value={AssetHistoryTabs.RouteReplayTabView}
        />
      )}
      {eventHistoryAllowed && (
        <Tab
          sx={{ height: 60 }}
          label={t('common.temperature')}
          value={AssetHistoryTabs.TemperatureGraphTabView}
        />
      )}
      {assetHistoryAllowed && (
        <Tab
          sx={{ height: 60 }}
          label={t('asset.history')}
          value={AssetHistoryTabs.AssetHistoryTableTabView}
        />
      )}
    </Tabs>
  );
};
