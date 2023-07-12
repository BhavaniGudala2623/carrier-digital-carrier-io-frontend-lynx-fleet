import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import AddIcon from '@mui/icons-material/Add';

import { AssetHistoryGraphViewSelect } from '../AssetHistoryViews';
import { AssetHistoryTabs } from '../../types';
import { getAssetHistoryState } from '../../stores';

import { HasPermission } from '@/features/authorization';
import { getAuthTenantId } from '@/features/authentication';
import { useAppSelector } from '@/stores';

interface SubHeaderRightContentProps {
  selectedTab: AssetHistoryTabs;
  selectedView: Maybe<string | number>;
  quickDate: Maybe<QuickDate>;
  frequency: Maybe<HistoryFrequency>;
  email?: string;
  onSelectedViewChange: (view: Maybe<string | number>) => void;
  onReportDialogOpen: (open: boolean) => void;
}

export const SubHeaderRightContent = ({
  selectedTab,
  selectedView,
  onSelectedViewChange,
  quickDate,
  frequency,
  email,
  onReportDialogOpen,
}: SubHeaderRightContentProps) => {
  const { t } = useTranslation();

  const tenantId = useAppSelector(getAuthTenantId);
  const { assetViews, assetViewsLoaded } = useAppSelector(getAssetHistoryState);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        ml: 'auto',
      }}
    >
      <HasPermission action="report.assetViewList" subjectType="COMPANY" subjectId={tenantId}>
        <div
          style={{
            // we can't unmount this while switching between tabs as this component does side effects with loaded views
            // todo: move effects to higher point in hierarchy
            visibility: selectedTab !== AssetHistoryTabs.TemperatureGraphTabView ? 'hidden' : 'initial',
          }}
        >
          <AssetHistoryGraphViewSelect
            views={assetViews}
            viewsLoaded={assetViewsLoaded}
            selectedView={selectedView}
            setSelectedView={onSelectedViewChange}
            quickDate={quickDate}
            frequency={frequency}
            email={email}
          />
        </div>
      </HasPermission>

      {selectedTab === AssetHistoryTabs.TemperatureGraphTabView && (
        <HasPermission action="scheduledReports.create" subjectType="COMPANY" subjectId={tenantId}>
          <Button
            startIcon={<AddIcon />}
            disableElevation
            variant="outlined"
            onClick={() => onReportDialogOpen(true)}
          >
            {t('assethistory.report.create-report')}
          </Button>
        </HasPermission>
      )}
    </Box>
  );
};
