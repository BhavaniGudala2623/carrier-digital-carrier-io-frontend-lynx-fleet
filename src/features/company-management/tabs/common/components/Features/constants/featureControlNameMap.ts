import { FeatureType } from '@carrier-io/lynx-fleet-types';

export const featureControlNameMap: Record<FeatureType, string> = {
  geofence: 'company.management.geofence-access',
  notification: 'company.management.notifications-access',
  scheduledReports: 'company.management.report-access',
  '2WayCmd': 'company.management.two-way-command-access',
  company: 'company.management.manage-companies',
  asset: 'company.management.manage-assets-and-fleets',
  user: 'company.management.manage-user',
  device: 'company.management.manage-devices',
  advancedTracking: 'company.management.advanced-tracking-access',
  apiPortal: 'company.management.api-portal-access',
};
