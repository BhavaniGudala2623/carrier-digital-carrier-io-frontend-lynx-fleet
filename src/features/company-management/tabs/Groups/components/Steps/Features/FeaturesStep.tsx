import { useMemo, useState } from 'react';
import { useFormikContext } from 'formik';
import { Feature, FeatureAccessHierarchy } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { CreateGroupFormValuesType } from '../../../types';
import { getFeaturesData, Features, updateOrAddFeatures, useSaveFeatureSettings } from '../../../../common';
import { ContentContainer } from '../styles';

import { ErrorBox } from '@/components';

export const FeaturesStep = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CreateGroupFormValuesType>();
  const { saveFeatureSettings } = useSaveFeatureSettings(setFieldValue, values.features);
  const [parentFeatureLevels, setParentFeatureLevels] = useState<Partial<Feature>[]>([]);

  const {
    loading: tenantLoading,
    error: tenantLoadingError,
    data: parentCompanyResponse,
  } = CompanyService.useGetTenantById(
    {
      id: values.tenantId,
    },
    {
      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        // filter and restrict company's features as per parents' requirements
        const maxLevelFeatures = data.getTenantById.features ?? [];
        let newFeaturesArray = values.features;
        maxLevelFeatures.forEach(({ name, accessLevel: maxAccessLevel }) => {
          const featureAccessLevel = values.features.find(
            (currentFeature) => name === currentFeature.name
          )?.accessLevel;
          if (
            featureAccessLevel &&
            FeatureAccessHierarchy[featureAccessLevel] > FeatureAccessHierarchy[maxAccessLevel]
          ) {
            newFeaturesArray = updateOrAddFeatures(
              {
                name,
                accessLevel: maxAccessLevel,
              },
              values.features
            );
          }
        });
        setParentFeatureLevels(newFeaturesArray);
        setFieldValue('features', newFeaturesArray);
      },
    }
  );

  const handleReset = () => {
    setFieldValue('features', parentFeatureLevels);
  };

  const featuresData = useMemo(
    () =>
      getFeaturesData({
        currentFeatures: values.features,
        minFeaturesLevels: [],
        maxFeaturesLevels: parentCompanyResponse?.getTenantById?.features ?? [],
        editingDisabled: false,
        includeAdvancedTracking: false,
      }),
    [values.features, parentCompanyResponse?.getTenantById?.features]
  );

  const getFeaturesContent = () => {
    if (tenantLoadingError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" fontSize={60}>
          <ErrorBox message={tenantLoadingError.message} variant="h4" errorIconFontSize={30} />
        </Box>
      );
    }

    if (tenantLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" fontSize={100}>
          <CircularProgress size={40} />
        </Box>
      );
    }

    return parentCompanyResponse?.getTenantById?.features ? (
      <Features onFeaturesSave={saveFeatureSettings} featuresData={featuresData} handleReset={handleReset} />
    ) : null;
  };

  return (
    <ContentContainer>
      <Box mb={2} mt={1}>
        <Typography sx={{ mb: 2 }} variant="subtitle1" color="text.primary">
          {t('company.management.users.create-group.step.access-features')}
        </Typography>
      </Box>
      {getFeaturesContent()}
    </ContentContainer>
  );
};

FeaturesStep.displayName = 'FeaturesStep';
