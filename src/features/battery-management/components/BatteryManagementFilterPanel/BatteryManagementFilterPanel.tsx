import Box from '@carrier-io/fds-react/Box';
import { Skeleton, Typography } from '@carrier-io/fds-react';
import { useTranslation } from 'react-i18next';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme/fleetThemeOptions';
import { useTheme } from '@carrier-io/fds-react/styles';
import Paper from '@carrier-io/fds-react/Paper';

import { MultiSwitch } from '../MultiSwitch';
import { getStateOfChargedataIsLoading, getTotalAssets } from '../../stores';
import { AllAndRecentFilter } from '../../types';
import { updateMultiSwitchRecentlyOnline } from '../../stores/batteryManagement/batteryManagementAction';
import { recentlyOnlineAllButtonsConfig } from '../../constants';

import { useAppDispatch, useAppSelector } from '@/stores';
import { CompanyHierarchySelector } from '@/components/CompanyHierarchySelector/CompanyHierarchySelector';

export const BatteryManagementFilterPanel = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const totalElectricAssets = useAppSelector(getTotalAssets);
  const isLoadingStateOfCharge = useAppSelector(getStateOfChargedataIsLoading);

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 1,
        border: 'none',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down(768)]: {
          display: 'grid',
          gridTemplateColumns: '1fr',
          rowGap: '10px',
          padding: '10px 20px',
        },
      }}
    >
      <Box display="flex" alignItems="center" gap="10px">
        {isLoadingStateOfCharge ? (
          <>
            <Skeleton width={64} height={32} animation="pulse" variant="rectangular" />
            <Skeleton width={100} height={20} animation="pulse" variant="rectangular" />
          </>
        ) : (
          <>
            <Typography color="primary.dark" variant="h5">
              {totalElectricAssets?.toLocaleString() ?? 0}
            </Typography>
            <Typography color="primary.dark" variant="subtitle1">
              {t('battery.management.electric.assets')}
            </Typography>
          </>
        )}
      </Box>

      <Box display="flex" alignItems="center" gap="20px" flexWrap="wrap">
        <Box
          sx={{
            border: '1px solid',
            borderColor: fleetThemeOptions.palette.addition.outlinedBorder,
            borderRadius: '4px',
          }}
        >
          <CompanyHierarchySelector />
        </Box>
        <MultiSwitch
          onChangeSwitch={(id) => {
            updateMultiSwitchRecentlyOnline(dispatch, id as AllAndRecentFilter);
          }}
          items={recentlyOnlineAllButtonsConfig}
        />
      </Box>
    </Paper>
  );
};
