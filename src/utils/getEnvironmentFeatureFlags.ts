import { FeatureFlagType, featureFlagNames } from '@/config';

export function getEnvironmentFeatureFlags(): Record<FeatureFlagType, boolean> {
  const result: Record<string, boolean> = {};

  for (const featureFlagName of featureFlagNames) {
    result[featureFlagName] = process.env[featureFlagName] === 'true';
  }

  return result;
}
