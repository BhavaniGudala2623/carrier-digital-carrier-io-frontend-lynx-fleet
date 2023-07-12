import { Navigate, Route, Routes } from 'react-router-dom';

import { SecureRouteCustom } from './SecureRouteCustom';
import { LoginCallback } from './LoginCallback';
import { routes } from './routes';

import { lazyImport } from '@/utils/lazyImport';
import { SinglePageLayout } from '@/components/layouts';
import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { HasPermission } from '@/features/authorization';
import { useApplicationContext } from '@/providers/ApplicationContext';

const { AssetsPage } = lazyImport(
  () => import(/* webpackChunkName: "AssetsPage" */ '@/features/asset-tracking'),
  'AssetsPage'
);

const { AssetHistoryPage } = lazyImport(
  () =>
    import(/* webpackChunkName: "AssetHistoryPage" */ '@/features/asset-history/components/AssetHistoryPage'),
  'AssetHistoryPage'
);

const { AssetReportGeneratorPage } = lazyImport(
  () =>
    import(
      /* webpackChunkName: "AssetReportGeneratorPage" */ '@/features/reports/components/AssetReportGeneratorPage'
    ),
  'AssetReportGeneratorPage'
);

export const { LoginPage } = lazyImport(
  () => import(/* webpackChunkName: "LoginPage" */ '@/features/authentication/components'),
  'LoginPage'
);

export const { Logout } = lazyImport(
  () => import(/* webpackChunkName: "Logout" */ '@/features/authentication/components'),
  'Logout'
);

export const { CommandHistoryPage } = lazyImport(
  () => /* webpackChunkName: "CommandHistoryPage" */ import('@/features/command-history/components'),
  'CommandHistoryPage'
);

export const { CompanyManagement } = lazyImport(
  () =>
    import(
      /* webpackChunkName: "CompanyManagementPage" */ '@/features/company-management/components/CompanyManagement'
    ),
  'CompanyManagement'
);

export const { DeviceManagementPage } = lazyImport(
  () =>
    import(
      /* webpackChunkName: "DeviceManagementPage" */ '@/features/device-management/components/DeviceManagementPage'
    ),
  'DeviceManagementPage'
);

export const { DeviceCommissioningPage } = lazyImport(
  () =>
    import(
      /* webpackChunkName: "DeviceCommissioningPage" */ '@/features/device-management/components/DeviceCommissioningPage'
    ),
  'DeviceCommissioningPage'
);

export const { NotificationsPage } = lazyImport(
  () => import(/* webpackChunkName: "NotificationsPage" */ '@/features/notifications/components'),
  'NotificationsPage'
);

export const { ReportsPage } = lazyImport(
  () => import(/* webpackChunkName: "ReportsPage" */ '@/features/reports/components/ReportsPage'),
  'ReportsPage'
);

export const { ReportsDashboardPage } = lazyImport(
  () =>
    import(
      /* webpackChunkName: "ReportsDashboardPage" */ '@/features/reports/components/ReportsDashboardPage'
    ),
  'ReportsDashboardPage'
);

export const { FleetReportsPage } = lazyImport(
  () =>
    import(/* webpackChunkName: "ReportsDashboardPage" */ '@/features/reports/components/FleetReportsPage'),
  'FleetReportsPage'
);

export const { PrivacyPage } = lazyImport(
  () => import(/* webpackChunkName: "PrivacyPage" */ '@/features/authentication/components/PrivacyPage'),
  'PrivacyPage'
);

const { BatteryManagementPage } = lazyImport(
  () =>
    import(
      /* webpackChunkName: "BatteryManagementPage" */ '@/features/battery-management/components/BatteryManagementPage'
    ),
  'BatteryManagementPage'
);

export const AppRoutes = () => {
  const tenantId = useAppSelector(getAuthTenantId);
  const { featureFlags } = useApplicationContext();
  const { REACT_APP_FEATURE_BATTERY_MANAGEMENT } = featureFlags;

  return (
    <Routes>
      <Route path="auth/login/callback" element={<LoginCallback />} />
      <Route path="auth/login" element={<LoginPage />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route
        path="/"
        element={
          <SecureRouteCustom>
            <SinglePageLayout />
          </SecureRouteCustom>
        }
      >
        <Route path={routes.assets.path} element={<AssetsPage />} />
        <Route path={routes.assetHistory.path} element={<AssetHistoryPage />} />
        <Route path={routes.assetReport.path} element={<AssetReportGeneratorPage />} />
        <Route
          path={routes.commandHistory.path}
          element={
            <HasPermission action="2WayCmd.historyList" subjectId={tenantId} subjectType="COMPANY">
              <CommandHistoryPage />
            </HasPermission>
          }
        />
        <Route
          path={routes.companyManagement.path}
          element={
            <HasPermission action="company.list" subjectId={tenantId} subjectType="COMPANY">
              <CompanyManagement />
            </HasPermission>
          }
        />
        <Route
          path={routes.deviceManagement.path}
          element={
            <HasPermission action="device.list" subjectId={tenantId} subjectType="COMPANY">
              <DeviceManagementPage />
            </HasPermission>
          }
        />
        <Route
          path={routes.deviceCommissioning.path}
          element={
            <HasPermission action="device.list" subjectId={tenantId} subjectType="COMPANY">
              <DeviceCommissioningPage />
            </HasPermission>
          }
        />
        <Route
          path={routes.notifications.path}
          element={
            <HasPermission action="notification.list" subjectId={tenantId} subjectType="COMPANY">
              <NotificationsPage />
            </HasPermission>
          }
        />
        <Route
          path={routes.reports.path}
          element={
            <HasPermission action="scheduledReports.view" subjectId={tenantId} subjectType="COMPANY">
              <ReportsPage />
            </HasPermission>
          }
        />
        <Route
          path={routes.reportDashboard.path}
          element={
            <HasPermission action="scheduledReports.view" subjectId={tenantId} subjectType="COMPANY">
              <ReportsDashboardPage />
            </HasPermission>
          }
        />
        <Route
          path={routes.fleetReports.path}
          element={
            <HasPermission action="scheduledReports.view" subjectId={tenantId} subjectType="COMPANY">
              <FleetReportsPage />
            </HasPermission>
          }
        />
        <Route
          path={routes.batteryManagement.path}
          element={
            // TODO: update action to battery.list once battery permissions are added in rbac.
            <HasPermission action="device.list" subjectId={tenantId} subjectType="COMPANY">
              {REACT_APP_FEATURE_BATTERY_MANAGEMENT ? <BatteryManagementPage /> : <div />}
            </HasPermission>
          }
        />
        <Route path="/" element={<Navigate to={routes.assets.path} replace />} />
        <Route path="*" element={<Navigate to={routes.assets.path} replace />} />
      </Route>
    </Routes>
  );
};
