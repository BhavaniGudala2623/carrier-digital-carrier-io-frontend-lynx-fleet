import { NavigationItem } from '@carrier-io/fds-react/patterns/Navbar';
import { TFunction } from 'i18next';

import { routes } from '@/routes';
import {
  AssetsIcon,
  DeviceManagementIcon,
  CommandHistoryIcon,
  AdvancedCompanyManagementIcon,
  NotificationsIcon,
  ReportsIcon,
  BatteryHorizontalIcon,
} from '@/components/icons';
import { FeatureFlagType } from '@/config';

type PreloadedPermissions =
  | 'assetList'
  | 'advancedTracking'
  | 'notifications'
  | 'commandHistory'
  | 'companyManagement'
  | 'deviceManagement'
  | 'restApi'
  | 'reports';

export function getRoutesWithNavItem(
  t: TFunction,
  permissions: Record<PreloadedPermissions, boolean>,
  featureFlags: Record<FeatureFlagType, boolean>
): NavigationItem[] {
  const items: NavigationItem[] = [];
  const { REACT_APP_FEATURE_BATTERY_MANAGEMENT } = featureFlags;

  if (permissions.assetList) {
    items.push({
      path: routes.assets.path,
      id: 'Asset Tracking',
      icon: <AssetsIcon />,
      label: t(routes.assets.title),
    });
  }

  // TODO: Need to add permission for battery management and update it here.
  if (permissions.deviceManagement && REACT_APP_FEATURE_BATTERY_MANAGEMENT) {
    items.push({
      path: routes.batteryManagement.path,
      id: 'Battery Management',
      icon: <BatteryHorizontalIcon />,
      label: t(routes.batteryManagement.title),
    });
  }

  if (permissions.notifications) {
    items.push({
      path: routes.notifications.path,
      id: 'Notifications',
      label: t(routes.notifications.title),
      icon: <NotificationsIcon />,
    });
  }

  if (permissions.reports) {
    items.push({
      path: routes.reports.path,
      id: 'Reports',
      label: t(routes.reports.title),
      icon: <ReportsIcon />,
    });
  }

  if (permissions.commandHistory) {
    items.push({
      path: routes.commandHistory.path,
      id: 'Command History',
      label: t(routes.commandHistory.title),
      icon: <CommandHistoryIcon />,
    });
  }

  if (permissions.companyManagement || permissions.deviceManagement) {
    items.push({
      type: 'DIVIDER',
    });
  }

  if (permissions.companyManagement) {
    items.push({
      path: routes.companyManagement.path,
      id: 'Company Management',
      label: t(routes.companyManagement.title),
      icon: <AdvancedCompanyManagementIcon />,
    });
  }

  if (permissions.deviceManagement) {
    items.push({
      path: routes.deviceManagement.path,
      id: 'Device Management',
      label: t(routes.deviceManagement.title),
      icon: <DeviceManagementIcon />,
    });
  }

  return items;
}
