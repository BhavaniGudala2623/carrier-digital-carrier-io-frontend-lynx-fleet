import Paper from '@carrier-io/fds-react/Paper';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import {
  BatteryNotification,
  NotificationCriticalityFilter,
  NotificationTimePeriodFilter,
} from '@carrier-io/lynx-fleet-types';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import { ChangeEvent } from 'react';

import {
  updateBatteryNotificationsWidgetSort,
  updateNotificationWidgetCriticalityFilter,
  updateSelectedTab,
  updateTimePeriodMultiSwitch,
} from '../../stores/batteryManagement/batteryManagementAction';
import { BatteryManagementTabs } from '../../types';
import {
  SortItemsConfig,
  batteryNotificationsSliceLimit,
  notificationsTimePeriodFilter,
} from '../../constants';
import { getBatteryNotificationsWidgetCriticalityFilter, getBatteryNotificationWidget } from '../../stores';
import { MultiSwitch } from '../MultiSwitch';

import { BatteryNotificationSort } from './BatteryNotificationSort/BatteryNotificationSort';
import { BatteryNotificationSkeleton } from './BatteryNotificaitonSkeleton/BatteryNotificationSkeleton';
import { BaterryNotificationNoIssues } from './BatteryNotificationNoIssues/BatteryNotificationNoIssues';
import { BatteryNotificationCard } from './BatteryNotificationCard/BatteryNotificationCard';
import { batteryNotificationsWidgetStyles } from './styles';

import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useUserSettings } from '@/providers/UserSettings';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { WarningCircleIcon, SocWarningIcon } from '@/components/icons';

export const BatteryNotificationsWidget = () => {
  const { featureFlags: { REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST } = {} } = useApplicationContext();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const classes = batteryNotificationsWidgetStyles();
  const batteryNotifications = useAppSelector(getBatteryNotificationWidget);
  const criticalityFilter: NotificationCriticalityFilter = useAppSelector(
    getBatteryNotificationsWidgetCriticalityFilter
  );
  const { attention, action } = criticalityFilter;
  const { userSettings } = useUserSettings();
  const { temperature, timezone, dateFormat } = userSettings;

  const moveTabToAllNotifications = () => {
    updateSelectedTab(dispatch, BatteryManagementTabs.NotificationsTabView);
  };

  const handleCriticalityFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const criticalityFilterObj = { ...criticalityFilter };

    const criticalityFilterField = event.target.id === 'criticality_filter_action' ? 'action' : 'attention';
    criticalityFilterObj[criticalityFilterField] = event.target.checked;
    updateNotificationWidgetCriticalityFilter(dispatch, criticalityFilterObj);
  };

  const renderLoading = () => {
    if (batteryNotifications.isLoading) {
      return <BatteryNotificationSkeleton />;
    }

    return null;
  };

  const getNotificationsCountByCriticalityFilter = (criticality) =>
    batteryNotifications?.data?.items
      ?.slice(0, batteryNotificationsSliceLimit)
      ?.filter((n) => n.criticality === criticality).length ?? 0;

  const renderItems = () => {
    if (batteryNotifications.data?.items && batteryNotifications.data.items.length > 0) {
      return batteryNotifications.data.items
        .slice(0, batteryNotificationsSliceLimit)
        .map((item: BatteryNotification) => (
          <BatteryNotificationCard
            key={item.notificationId}
            data={item}
            t={t}
            temperature={temperature}
            timezone={timezone}
            dateFormat={dateFormat}
          />
        ));
    }

    return null;
  };

  const renderErrorOrNoIssues = () => {
    const noIssues = batteryNotifications.data?.items && batteryNotifications.data.items.length === 0;
    if (noIssues || batteryNotifications.isError || !REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST) {
      return <BaterryNotificationNoIssues />;
    }

    return null;
  };

  return (
    <Paper variant="outlined" className={classes.root}>
      <Box className={classes.container}>
        <Typography color="primary.dark" variant="subtitle1">
          {t('battery.management.battery.notifications.title')}{' '}
          {batteryNotifications.data?.totalItems ? `(${batteryNotifications.data?.totalItems})` : ''}
        </Typography>
        {REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST && (
          <MultiSwitch
            onChangeSwitch={(id) => {
              updateTimePeriodMultiSwitch(dispatch, id as NotificationTimePeriodFilter);
            }}
            items={notificationsTimePeriodFilter}
          />
        )}
      </Box>

      <Box className={classes.container}>
        <Box>
          <FormControlLabel
            className={classes.criticalityFiltersContainer}
            control={
              <Checkbox
                id="criticality_filter_action"
                sx={{ ml: 1 }}
                size="small"
                style={{ marginLeft: '0px' }}
                color="primary"
                disabled={!attention}
                checked={action as boolean}
                onChange={handleCriticalityFilterChange}
              />
            }
            label={
              <Box display="flex" className={classes.criticalityFiltersLabelContainer}>
                <SocWarningIcon fill={!action ? 'rgba(0, 0, 0, 0.38)' : undefined} width="17" height="17" />
                <Typography color="black" variant="caption" className={classes.criticalityFiltersLabel}>
                  Action
                </Typography>
                <Typography color="black" variant="caption" className={classes.criticalityFiltersCount}>
                  {getNotificationsCountByCriticalityFilter(1)}
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            className={classes.criticalityFiltersContainer}
            control={
              <Checkbox
                id="criticality_filter_attention"
                sx={{ ml: 1 }}
                size="small"
                color="primary"
                style={{ marginLeft: '0px' }}
                disabled={!action}
                checked={attention as boolean}
                onChange={handleCriticalityFilterChange}
              />
            }
            label={
              <Box display="flex" className={classes.criticalityFiltersLabelContainer}>
                <WarningCircleIcon
                  fill={!attention ? 'rgba(0, 0, 0, 0.38)' : undefined}
                  width="17"
                  height="17"
                />
                <Typography color="black" variant="caption" className={classes.criticalityFiltersLabel}>
                  Attention
                </Typography>
                <Typography color="black" variant="caption" className={classes.criticalityFiltersCount}>
                  {getNotificationsCountByCriticalityFilter(2)}
                </Typography>
              </Box>
            }
          />
        </Box>
        {REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST && (
          <BatteryNotificationSort
            items={SortItemsConfig}
            onChangeItem={({ value }) => {
              updateBatteryNotificationsWidgetSort(dispatch, value);
            }}
          />
        )}
      </Box>
      {REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST && renderLoading()}
      {REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST && renderItems()}
      {renderErrorOrNoIssues()}
      {REACT_APP_FEATURE_BATTERY_NOTIFICATION_LIST && (
        <Paper
          variant="outlined"
          className={classes.viewAllNotifications}
          onClick={moveTabToAllNotifications}
        >
          <Typography variant="buttonSmall">
            {t('battery.management.battery.notifications.view-all-notifications')}
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};
