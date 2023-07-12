import { useMemo, useState } from 'react';
import { useFormikContext } from 'formik';
import { FeatureAccessHierarchy, Feature } from '@carrier-io/lynx-fleet-types';
import { useRbac } from '@carrier-io/rbac-provider-react';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { CreateCompanyFormData } from '../../../../types';
import {
  getFeaturesData,
  Features,
  useSaveFeatureSettings,
  allFeaturesWithFullAccess,
  DEFAULT_FEATURE_LEVELS,
} from '../../../common';

import { ErrorBox } from '@/components';
import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';

export const FeaturesStep = () => {
  const { values, setFieldValue } = useFormikContext<CreateCompanyFormData>();
  const { features, id, parentCompany: parentCompanyFormValue, tenantId, parentId } = values;
  const parentCompanyId = parentCompanyFormValue?.id ?? tenantId ?? parentId;
  const userTenantId = useAppSelector(getAuthTenantId);
  const { hasPermission } = useRbac();
  const { saveFeatureSettings } = useSaveFeatureSettings(setFieldValue, features);

  const [parentFeatureLevels, setParentFeatureLevels] = useState<Partial<Feature>[]>(DEFAULT_FEATURE_LEVELS);
  const canEditFeatures = hasPermission(companyActionPayload('company.editFeatures', userTenantId));

  const { error: maxFeaturesLevelsError, data: maxFeaturesLevelsResponse } =
    CompanyService.useGetTenantAvailableFeatures(
      {
        id: parentCompanyId || '',
      },
      {
        skip: !parentCompanyId,
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
          // filter and restrict company's features as per parents' requirements
          const maxLevelFeatures = data.getTenantAvailableFeatures.features ?? [];
          const newFeatures = values.features
            .filter((currentFeature) =>
              maxLevelFeatures.find((maxFeature) => maxFeature.name === currentFeature.name)
            )
            .map((currentFeature) => {
              const max = maxLevelFeatures.find((maxFeature) => maxFeature.name === currentFeature.name);
              if (
                max &&
                FeatureAccessHierarchy[currentFeature.accessLevel] <= FeatureAccessHierarchy[max.accessLevel]
              ) {
                return currentFeature;
              }

              return {
                ...currentFeature,
                accessLevel: max?.accessLevel,
              };
            });

          setParentFeatureLevels(newFeatures);
          setFieldValue('features', newFeatures);
        },
      }
    );

  const { data: minFeaturesLevelsResponse, error: minFeaturesLevelsError } =
    CompanyService.useGetAccessLevelsForSubtenants(
      {
        id: id || '',
      },
      {
        skip: !id,
      }
    );

  const featuresData = useMemo(
    () =>
      getFeaturesData({
        currentFeatures: values.features ?? [],
        minFeaturesLevels: minFeaturesLevelsResponse?.getAccessLevelsForSubtenants?.features ?? [],
        maxFeaturesLevels: parentCompanyId
          ? maxFeaturesLevelsResponse?.getTenantAvailableFeatures?.features ?? null
          : allFeaturesWithFullAccess,
        editingDisabled: !canEditFeatures,
        includeAdvancedTracking: true,
      }),
    [
      values.features,
      minFeaturesLevelsResponse?.getAccessLevelsForSubtenants?.features,
      maxFeaturesLevelsResponse?.getTenantAvailableFeatures?.features,
      canEditFeatures,
      parentCompanyId,
    ]
  );

  const handleFeaturesReset = () => {
    setFieldValue('features', parentFeatureLevels);
  };

  const getFeaturesContent = () => {
    if (maxFeaturesLevelsError || minFeaturesLevelsError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" fontSize={60}>
          <ErrorBox
            message={maxFeaturesLevelsError?.message || minFeaturesLevelsError?.message || ''}
            variant="h4"
            errorIconFontSize={30}
          />
        </Box>
      );
    }

    return featuresData ? (
      <Paper variant="outlined" sx={{ width: 480, px: 2.5, py: 2, mb: 2 }}>
        <Features
          onFeaturesSave={saveFeatureSettings}
          featuresData={featuresData}
          handleReset={handleFeaturesReset}
        />
      </Paper>
    ) : null;
  };

  return getFeaturesContent();
};

FeaturesStep.displayName = 'FeaturesStep';
