import { FeatureType } from '@carrier-io/lynx-fleet-types';

export const featureTitleMap: Record<FeatureType, string> = {
  geofence: 'company.management.users.create-group.step.features-name.geofence',
  company: 'company.management.users.create-group.step.features-name.company',
  asset: 'company.management.users.create-group.step.features-name.asset',
  user: 'company.management.users.create-group.step.features-name.user',
  device: 'company.management.users.create-group.step.features-name.device',
  '2WayCmd': 'company.management.users.create-group.step.features-name.2WayCmd',
  notification: 'company.management.users.create-group.step.features-name.notification',
  scheduledReports: 'company.management.users.create-group.step.features-name.scheduledReports',
  apiPortal: 'company.management.users.create-group.step.features-name.apiPortal',
  advancedTracking: 'company.management.users.create-group.step.features-name.advancedTracking',
};
