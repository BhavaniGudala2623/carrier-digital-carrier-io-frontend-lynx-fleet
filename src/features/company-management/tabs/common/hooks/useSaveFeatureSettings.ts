import { useCallback } from 'react';
import { AccessLevelType, Feature, FeatureType } from '@carrier-io/lynx-fleet-types';
import { FormikHelpers } from 'formik';

import { updateOrAddFeatures } from '../components/Features';

export const useSaveFeatureSettings = (
  setFieldValue: FormikHelpers<{ features: Feature[] }>['setFieldValue'],
  features: Feature[]
) => {
  const saveFeatureSettings = useCallback(
    (name: FeatureType, enabled: boolean, accessLevel: AccessLevelType | null) => {
      const updatedFeatures =
        enabled && accessLevel
          ? updateOrAddFeatures({ name, accessLevel }, features)
          : features.flatMap((f) => (f.name === name ? [] : [f]));
      setFieldValue('features', updatedFeatures);
    },
    [features, setFieldValue]
  );

  return {
    saveFeatureSettings,
  };
};
