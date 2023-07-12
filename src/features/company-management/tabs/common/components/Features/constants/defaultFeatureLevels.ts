import { Feature } from '@carrier-io/lynx-fleet-types';

export const DEFAULT_FEATURE_LEVELS: Feature[] = [
  {
    name: 'geofence',
    accessLevel: 'full_access',
  },
  {
    name: 'notification',
    accessLevel: 'full_access',
  },
  {
    name: 'scheduledReports',
    accessLevel: 'create_edit',
  },
  {
    name: 'company',
    accessLevel: 'view_only',
  },
  {
    name: 'asset',
    accessLevel: 'create_edit',
  },
  {
    name: 'user',
    accessLevel: 'full_access',
  },
];
