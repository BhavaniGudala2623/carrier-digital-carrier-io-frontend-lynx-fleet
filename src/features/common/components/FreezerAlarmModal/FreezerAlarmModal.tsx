import { useState, useMemo, ChangeEvent } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import Grid from '@carrier-io/fds-react/Grid';
import Button from '@carrier-io/fds-react/Button';
import Tabs from '@carrier-io/fds-react/Tabs';
import Tab from '@carrier-io/fds-react/Tab';
import TabsContext from '@carrier-io/fds-react/TabContext';
import TabPanel from '@carrier-io/fds-react/TabPanel';
import { useTranslation } from 'react-i18next';
import { FreezerAlarm } from '@carrier-io/lynx-fleet-types';
import { styled } from '@mui/material';

import { RestoreIcon } from '../../../asset-tracking/components/icons';
import { SnapshotDataEx } from '../../types';
import { useGetAlarmsWithRecommendedActions } from '../../hooks';

import { FreezerAlarmTable } from './FreezerAlarmTable';
import { replaceAlarmResponseName } from './utils/replaceAlarmResponseName';

import { Dialog, dateTimeFormatter } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';

interface FreezerAlarmModalProps {
  selectedAsset: SnapshotDataEx;
  setModalSelectedAsset: (selectedAsset: SnapshotDataEx | null) => void;
}

type TabsType = 'active' | 'inactive';

const StyledTabPanel = styled(TabPanel)({
  padding: 0,
  borderTop: '1px solid',
  borderColor: 'secondary.light',
});

export const FreezerAlarmModal = ({
  selectedAsset: asset,
  setModalSelectedAsset,
}: FreezerAlarmModalProps) => {
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();
  const { t } = useTranslation();
  const selectedAsset = useMemo(() => replaceAlarmResponseName(asset), [asset]);

  const [selectedTab, setSelectedTab] = useState<TabsType>('active');

  const handleTabSelected = (_event: ChangeEvent<{}>, newValue: TabsType) => {
    setSelectedTab(newValue);
  };

  const handleClose = () => {
    setModalSelectedAsset(null);
  };

  const controllerType = useMemo(
    () => selectedAsset.flespiData?.freezer_control_mode ?? undefined,
    [selectedAsset.flespiData?.freezer_control_mode]
  );

  const lastUpdated = useMemo(
    () =>
      selectedAsset &&
      dateTimeFormatter(selectedAsset?.flespiData?.timestamp, {
        dateFormat,
        timestampFormat: 'seconds',
        timezone,
      }),
    [dateFormat, selectedAsset, timezone]
  );

  const { activeAlarmsData, loading: recommendedActionsLoading } = useGetAlarmsWithRecommendedActions(
    selectedAsset,
    controllerType
  );

  return (
    <Dialog
      open={!!selectedAsset}
      dialogTitle={t('alarms.modal.alarm-details')}
      maxWidth="md"
      PaperProps={{ sx: { minHeight: '50vh' } }}
      onClose={handleClose}
      contentSx={{ p: 0 }}
      content={
        <Grid container>
          <Grid item xs={12} sx={{ pl: 3 }}>
            <Typography variant="body1">{selectedAsset?.asset?.name}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, pl: 3 }}>
            <Typography variant="body2">{t('assets.management.tru-serial')}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ pl: 3 }}>
            <Typography variant="subtitle1">{selectedAsset?.flespiData?.freezer_serial_number}</Typography>
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center" sx={{ mt: 1, pl: 3 }}>
            <RestoreIcon fontSize="inherit" />
            <Typography variant="caption" color="text.primary" sx={{ ml: 0.5 }}>
              {t('assets.asset.list.last-updated')}:
            </Typography>
            <Typography variant="caption" color="text.primary" sx={{ ml: 0.5 }}>
              {lastUpdated}
            </Typography>
          </Grid>
          <Grid item xs={12} position="relative">
            <TabsContext value={selectedTab}>
              <Tabs sx={{ ml: 1 }} value={selectedTab} onChange={handleTabSelected}>
                <Tab value="active" label={t('common.active')} />
                <Tab value="inactive" label={t('common.inactive')} />
              </Tabs>
              <StyledTabPanel value="active">
                <FreezerAlarmTable
                  data={activeAlarmsData}
                  controllerType={controllerType}
                  loading={recommendedActionsLoading}
                  activeAlarms
                />
              </StyledTabPanel>
              <StyledTabPanel value="inactive">
                <FreezerAlarmTable
                  data={(selectedAsset?.inactiveFreezerAlarms as FreezerAlarm[]) ?? []}
                  controllerType={controllerType}
                />
              </StyledTabPanel>
            </TabsContext>
          </Grid>
        </Grid>
      }
      actions={
        <Button variant="outlined" onClick={handleClose}>
          {t('common.close')}
        </Button>
      }
    />
  );
};
