import { Routes } from '@/types';

export const routes: Routes = {
  assets: {
    title: 'asset.tracking',
    path: '/assets',
  },
  assetHistory: {
    title: 'asset.tracking',
    path: '/assets/:assetId',
  },
  assetReport: {
    title: 'asset.tracking',
    path: '/assets/:assetId/report',
  },
  commandHistory: {
    title: 'company.management.command-history',
    path: '/command-history',
  },
  companyManagement: {
    title: 'company.management.company-management',
    path: '/company-management',
  },
  deviceManagement: {
    title: 'company.management.device-management',
    path: '/device-management',
  },
  deviceCommissioning: {
    title: 'company.management.device-management',
    path: '/device-management/:deviceId',
  },
  notifications: {
    title: 'notifications.notifications',
    path: '/notifications',
  },
  reports: {
    title: 'assets.reports.reports',
    path: '/reports',
  },
  reportDashboard: {
    title: 'assets.reports.reports',
    path: '/reports/:dashboardId',
  },
  fleetReports: {
    title: 'assets.reports.reports',
    path: '/reports/fleet-reports/:dashboardId',
  },
  batteryManagement: {
    title: 'battery.management.asset.battery.management',
    path: '/battery-management',
  },
};
