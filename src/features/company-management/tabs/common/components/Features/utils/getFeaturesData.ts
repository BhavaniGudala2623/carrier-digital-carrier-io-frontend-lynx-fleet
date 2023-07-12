import { Feature, FeatureAccessHierarchy, FeatureConfig, FeatureType } from '@carrier-io/lynx-fleet-types';
import { isNull } from 'lodash-es';

import { ConfigFeatures, Feature as FeatureReturned } from '../../../types';
import {
  accessLevelTextMap,
  featureTitleMap,
  adminFeatureConfigs,
  coreFeatureConfigs,
  externalLinksFeatureConfigs,
  featureLogoMap,
} from '../constants';

const getFeatureLog = (name: FeatureType) => {
  if (featureLogoMap?.[name]) {
    return featureLogoMap[name];
  }

  return null;
};

type FeaturesDataInput = {
  currentFeatures: Feature[];
  minFeaturesLevels: Feature[];
  maxFeaturesLevels: Feature[] | null; // null is for companies with no parent
  editingDisabled: boolean;
  includeAdvancedTracking: boolean;
};

type FeatureConfigExtended = { configName: ConfigFeatures['configName']; features: FeatureConfig[] };

export const getFeatureConfigs = (includeAdvancedTracking = false): FeatureConfig[] => [
  ...coreFeatureConfigs,
  ...adminFeatureConfigs,
  ...(includeAdvancedTracking ? externalLinksFeatureConfigs : [externalLinksFeatureConfigs[1]]),
];

const getFeaturesAndConfigNames = (includeAdvancedTracking = false): FeatureConfigExtended[] => [
  { configName: 'Core', features: [...coreFeatureConfigs] },
  { configName: 'Admin', features: [...adminFeatureConfigs] },
  {
    configName: 'External Links',
    features: [...(includeAdvancedTracking ? externalLinksFeatureConfigs : [externalLinksFeatureConfigs[1]])],
  },
];

export const getFeaturesData = ({
  currentFeatures,
  maxFeaturesLevels,
  minFeaturesLevels,
  editingDisabled,
  includeAdvancedTracking,
}: FeaturesDataInput): ConfigFeatures[] =>
  getFeaturesAndConfigNames(includeAdvancedTracking).map(({ configName, features }) => ({
    configName,
    features: features.map(({ name, accessLevels }) => {
      const currentFeature = currentFeatures.find((f) => f.name === name);
      const accessLevelsArray = accessLevels.map((level) => {
        let accessLevelEnabled = true;

        const minAccessLevel = minFeaturesLevels.find((minLevel) => minLevel.name === name)?.accessLevel;
        const maxAccessLevel =
          maxFeaturesLevels?.find(({ name: maxLevel }) => maxLevel === name)?.accessLevel ||
          currentFeature?.accessLevel;
        if (level.name && minAccessLevel) {
          accessLevelEnabled = FeatureAccessHierarchy[level.name] >= FeatureAccessHierarchy[minAccessLevel];
        }

        if (
          (!isNull(maxFeaturesLevels) && !maxAccessLevel) ||
          (maxAccessLevel && FeatureAccessHierarchy[level.name] > FeatureAccessHierarchy[maxAccessLevel])
        ) {
          accessLevelEnabled = false;
        }

        return {
          type: level.name,
          label: accessLevelTextMap[level.name],
          enabled: accessLevelEnabled,
        };
      }, [] as FeatureReturned['accessLevels']);

      const accessLevelInfo = accessLevelsArray.find((level) => currentFeature?.accessLevel === level?.type);

      return {
        name,
        logo: getFeatureLog(name),
        title: featureTitleMap[name],
        enabled: !!accessLevelInfo,
        subTenantsEnabled: !!minFeaturesLevels?.some((feature) => feature.name === name),
        accessLevel: currentFeature?.accessLevel ?? null,
        accessLevels: accessLevelsArray,
        editingDisabled: editingDisabled || accessLevelsArray.length === 0,
      };
    }),
  }));
