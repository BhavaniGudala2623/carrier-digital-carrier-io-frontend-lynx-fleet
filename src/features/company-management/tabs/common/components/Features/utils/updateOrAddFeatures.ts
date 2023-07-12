import { Feature } from '@carrier-io/lynx-fleet-types';

export const updateOrAddFeatures = (feature: Feature, features?: Feature[]) => {
  if (features) {
    const isExist = features.find(({ name }) => name === feature.name);

    return isExist
      ? features.map((f) => (f.name === feature.name ? { ...f, accessLevel: feature.accessLevel } : f))
      : [...features, feature];
  }

  return [feature];
};
