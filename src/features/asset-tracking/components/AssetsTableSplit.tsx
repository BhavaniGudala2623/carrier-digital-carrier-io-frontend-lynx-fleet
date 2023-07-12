import AppBar from '@carrier-io/fds-react/AppBar';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { useTranslation } from 'react-i18next';
import Tabs from '@carrier-io/fds-react/Tabs';
import Tab from '@carrier-io/fds-react/Tab';
import TabContext from '@carrier-io/fds-react/TabContext';
import Box from '@carrier-io/fds-react/Box';
import { Geofence, Maybe } from '@carrier-io/lynx-fleet-types';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { useCallback } from 'react';

import { GeofencesTable } from '../features/geofences';
import { TableTab } from '../types';
import { useAssetsPageDataContext } from '../providers/AssetsPageDataProvider';
import { useAssetsPageContext } from '../providers';
import { useGeofenceContext } from '../features/geofences/providers/GeofenceProvider';

import { AssetsTable } from './AssestTable/AssetsTable';
import { CombinedExportButton } from './CombinedExportButton';
import { TwoWayCommandsButton } from './TwoWayCommandsButton';

import type { SnapshotDataEx } from '@/features/common';
import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { TabPanelHidden } from '@/components/TabPanelHidden';
import { ExportTaskType } from '@/types';
import { companyActionPayload } from '@/features/authorization';

type AssetsTableSplitProps = {
  selectedTab: TableTab;
  selectedAsset: Maybe<SnapshotDataEx>;
  selectedGeofence: Maybe<Geofence>;
  filteredGeofences: Geofence[];
  onAssetSelectionChanged: (asset: Maybe<SnapshotDataEx>) => void;
  onGeofenceSelectionChanged: (geofence: Maybe<Geofence>) => void;
  onTabChanged: (tab: TableTab) => void;
};

export function AssetsTableSplit({
  selectedTab,
  selectedAsset,
  selectedGeofence,
  filteredGeofences,
  onAssetSelectionChanged,
  onGeofenceSelectionChanged,
  onTabChanged,
}: AssetsTableSplitProps) {
  const tenantId = useAppSelector(getAuthTenantId);
  const { setTaskToExport: setTaskToExportGeofences } = useGeofenceContext();
  const { setTaskToExport: setTaskToExportAssets } = useAssetsPageContext();
  const { isLoading: isGeofenceLoading, entities: geofenceEntities } = useAppSelector(
    (state) => state.geofences
  );

  const { t } = useTranslation();

  const { hasPermission } = useRbac();
  const shouldShowAssets = hasPermission(companyActionPayload('dashboard.assetList', tenantId));
  const shouldShowGeofences = hasPermission(companyActionPayload('geofence.list', tenantId));
  const shouldSendTwoWayCmd = hasPermission(companyActionPayload('2WayCmd.send', tenantId));

  const handleExport = useCallback((tab: TableTab, task: ExportTaskType) => {
    switch (tab) {
      case 'assets':
        setTaskToExportAssets(task);
        break;

      case 'geofences':
        setTaskToExportGeofences(task);
        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableTabChange = (_event, newTab: TableTab) => {
    onTabChanged(newTab);
  };

  const { filteredSnapshots, listLoading } = useAssetsPageDataContext();

  const getGeofencesCount = useCallback(() => {
    if (isGeofenceLoading && !geofenceEntities) {
      return '-';
    }

    return filteredGeofences?.length.toString() ?? '0';
  }, [filteredGeofences?.length, geofenceEntities, isGeofenceLoading]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
      }}
    >
      <TabContext value={selectedTab}>
        <AppBar
          position="static"
          color="inherit"
          sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTableTabChange}
            aria-label="information tables selection"
            invertIndicator
            sx={{
              '& .MuiButtonBase-root.MuiTab-root': {
                minHeight: '56px',
              },
            }}
          >
            {shouldShowAssets && (
              <Tab
                label={`${t('company.management.assets')} (${filteredSnapshots?.length || 0})`}
                icon={<TrackChangesIcon fontSize="small" />}
                iconPosition="start"
                value="assets"
              />
            )}
            {shouldShowGeofences && (
              <Tab
                label={`${t('geofences.geofences')} (${getGeofencesCount()})`}
                icon={<FmdGoodOutlinedIcon fontSize="small" />}
                iconPosition="start"
                value="geofences"
              />
            )}
          </Tabs>
          <Box display="flex" alignItems="center" px={1}>
            {shouldSendTwoWayCmd && selectedTab === 'assets' && (
              <TwoWayCommandsButton
                selectedAsset={selectedAsset}
                color="secondary"
                size="small"
                testId="assets-two-way-command"
              >
                <span>{t('asset.command.two-way-command')}</span>
              </TwoWayCommandsButton>
            )}
            <Box ml={1}>
              <CombinedExportButton disabled={listLoading} onExport={handleExport} />
            </Box>
          </Box>
        </AppBar>
        {shouldShowAssets && (
          <TabPanelHidden value="assets" selectedTab={selectedTab} sx={{ padding: 0, flex: 1 }}>
            <AssetsTable
              filteredEntities={filteredSnapshots}
              selectedAsset={selectedAsset}
              onAssetSelectionChanged={onAssetSelectionChanged}
            />
          </TabPanelHidden>
        )}
        {shouldShowGeofences && (
          <TabPanelHidden value="geofences" selectedTab={selectedTab} sx={{ padding: 0, flex: 1 }}>
            <GeofencesTable
              selectedGeofence={selectedGeofence}
              onGeofenceSelectionChanged={onGeofenceSelectionChanged}
              filteredGeofences={filteredGeofences}
            />
          </TabPanelHidden>
        )}
      </TabContext>
    </Box>
  );
}
