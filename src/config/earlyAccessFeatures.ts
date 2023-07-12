import type { FeatureFlagType } from './featureFlags';

export const earlyAccessFeatures: { flag: FeatureFlagType; name: string }[] = [
  {
    flag: 'REACT_APP_FEATURE_HEALTH_STATUS',
    name: 'Health Status',
  },
  { flag: 'REACT_APP_FEATURE_ROUTE_REPLAY_TAB', name: 'Route Replay' },
  { flag: 'REACT_APP_FEATURE_BATTERY_MANAGEMENT', name: 'Asset Battery Management' },
];
