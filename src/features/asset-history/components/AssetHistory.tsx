import { useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import { HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';

import { AssetHistoryTabs } from '../types';
import { AssetHistoryRouteTab, AssetHistoryTableTab, AssetHistoryTempTab } from '../tabs';
import { TabPanelsProvider, useAssetHistoryPageContext } from '../providers';

import { TabPanel } from './TabPanels';
import { AssetHistoryHeader } from './AssetHistoryHeader';
import { AssetDetails } from './AssetDetails';

import { getAuthTenantId, getAuthUserEmail } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { TableBox } from '@/components/TableBox';
import { HasPermission } from '@/features/authorization';
import { Loader } from '@/components';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const AssetHistory = () => {
  const { assetDetailsLoading, assetId } = useAssetHistoryPageContext();
  const { featureFlags } = useApplicationContext();
  const isRouteReplayEnabled = featureFlags.REACT_APP_FEATURE_ROUTE_REPLAY_TAB;

  const authUserEmail = useAppSelector(getAuthUserEmail);
  const tenantId = useAppSelector(getAuthTenantId);

  const [selectedTab, setSelectedTab] = useState<AssetHistoryTabs>(
    isRouteReplayEnabled ? AssetHistoryTabs.RouteReplayTabView : AssetHistoryTabs.TemperatureGraphTabView
  );
  const [quickDate, setQuickDate] = useState<Maybe<QuickDate>>('24h');
  const [frequency, setFrequency] = useState<HistoryFrequency>('15m');
  const [selectedView, setSelectedView] = useState<Maybe<number | string>>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleQuickDateChange = (value: Maybe<QuickDate>) => {
    setQuickDate(value);

    if (value === '7d' && (frequency === '1m' || frequency === '5m')) {
      setFrequency('1h');
    }
  };

  if (assetDetailsLoading) {
    return <Loader />;
  }

  return (
    <TableBox>
      <AssetDetails />
      <AssetHistoryHeader
        selectedTab={selectedTab}
        quickDate={quickDate}
        frequency={frequency}
        selectedView={selectedView}
        email={authUserEmail}
        onTabChange={setSelectedTab}
        onSelectedViewChange={setSelectedView}
        onReportDialogOpen={setReportDialogOpen}
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          flex: 1,
          borderRadius: '8px',
        }}
      >
        <TabPanelsProvider selectedTab={selectedTab} shouldUnmount={false}>
          {isRouteReplayEnabled ? (
            <HasPermission action="dashboard.routeReplayList" subjectType="COMPANY" subjectId={tenantId}>
              <TabPanel
                key={AssetHistoryTabs.RouteReplayTabView}
                tabId={AssetHistoryTabs.RouteReplayTabView}
                panelSx={{ height: '100%' }}
              >
                <AssetHistoryRouteTab
                  onSelectedViewChange={setSelectedView}
                  onFrequencyChange={setFrequency}
                />
              </TabPanel>
            </HasPermission>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></> // TODO: refactor on feature flag escape
          )}
          <HasPermission action="dashboard.eventHistoryList" subjectType="COMPANY" subjectId={tenantId}>
            <TabPanel
              key={AssetHistoryTabs.TemperatureGraphTabView}
              tabId={AssetHistoryTabs.TemperatureGraphTabView}
              panelSx={{ height: '100%' }}
            >
              <AssetHistoryTempTab
                quickDate={quickDate}
                selectedView={selectedView}
                setSelectedView={setSelectedView}
                reportDialogOpen={reportDialogOpen}
                setReportDialogOpen={setReportDialogOpen}
                onQuickDateChange={handleQuickDateChange}
                assetId={assetId}
                frequency={frequency}
                onFrequencyChange={setFrequency}
              />
            </TabPanel>
          </HasPermission>
          <HasPermission action="dashboard.assetHistoryList" subjectType="COMPANY" subjectId={tenantId}>
            <TabPanel
              key={AssetHistoryTabs.AssetHistoryTableTabView}
              tabId={AssetHistoryTabs.AssetHistoryTableTabView}
              panelSx={{ height: '100%' }}
            >
              <AssetHistoryTableTab
                onSelectedViewChange={setSelectedView}
                assetId={assetId}
                onFrequencyChange={setFrequency}
              />
            </TabPanel>
          </HasPermission>
        </TabPanelsProvider>
      </Box>
    </TableBox>
  );
};
