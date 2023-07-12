import { useCallback, useEffect, useState } from 'react';
import { Formik, FormikHelpers, FormikTouched, FormikErrors } from 'formik';
import { Maybe, AssetRow } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Box from '@carrier-io/fds-react/Box';

import { useAssignAssetsToTenant } from '../../hooks';

import { getValidationSchema } from './validationSchemaAssignAssets';
import { Review } from './Steps/Review';
import { SelectAssetsContainer } from './Steps/SelectAssetsContainer';

import { CompanySelector as AllCompaniesSelector, StepperComponent } from '@/components';
import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

interface AddAssetsFormProps {
  onStepChange: (step: number) => void;
  onSubmit: () => void;
}

interface AddAssetsFormSchema {
  assetIds: string[];
  tenantId: string;
}

interface State {
  activeStep: number;
  selectedAssets: AssetRow[];
  selectedCompany: Maybe<SelectedCompanyHierarchy>;
}

interface StepHandlers {
  handleAssetsChange: (assets: AssetRow[]) => void;
  handleCompanyChange: (node: SelectedCompanyHierarchy) => void;
}

const getSteps = (t: TFunction) => [
  t('company.management.select-assets') as string,
  t('company.management.select-company') as string,
  t('common.review') as string,
];

const getStepContent = (
  index,
  state: State,
  handlers: StepHandlers,
  placeholder: string,
  errors: FormikErrors<AddAssetsFormSchema>,
  touched: FormikTouched<AddAssetsFormSchema>
) => {
  switch (index) {
    case 0:
      return <SelectAssetsContainer onSelectedAssetsChange={handlers.handleAssetsChange} />;
    case 1:
      return (
        <Box maxWidth={480} mb={2}>
          <AllCompaniesSelector
            company={state.selectedCompany}
            onCompanyChange={handlers.handleCompanyChange}
            placeholder={placeholder}
            error={touched.tenantId && Boolean(errors.tenantId)}
            helperText={touched.tenantId && errors.tenantId}
          />
        </Box>
      );
    default:
      return <Review assets={state.selectedAssets} company={state.selectedCompany} />;
  }
};

export const AssignAssetsForm = ({ onStepChange, onSubmit }: AddAssetsFormProps) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAssets, setSelectedAssets] = useState<AssetRow[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Maybe<SelectedCompanyHierarchy>>(null);

  const { assignAssetsToTenant, loading } = useAssignAssetsToTenant();

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleAssetsChange = (assets: AssetRow[]) => {
    setSelectedAssets(assets);
  };

  const handleCompanyChange = (node: SelectedCompanyHierarchy, setFieldValue, setFieldError) => {
    setSelectedCompany(node);
    setFieldValue('tenantId', node.id);
    setFieldError('tenantId', '');
  };

  const handleSubmit = (
    values: AddAssetsFormSchema,
    { setSubmitting }: FormikHelpers<AddAssetsFormSchema>
  ) => {
    setSubmitting(true);
    assignAssetsToTenant({
      variables: {
        input: {
          assetIds: values.assetIds,
          tenantId: values.tenantId,
        },
      },
    })
      .then((result) => {
        const hasErrors = result.errors?.length && result.errors?.length > 0;
        if (!hasErrors) {
          onSubmit();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    onStepChange(activeStep);
  }, [activeStep, onStepChange]);

  const initialValues: AddAssetsFormSchema = {
    assetIds: [],
    tenantId: '',
  };

  const validateFormContent = (errors) => {
    if (activeStep === 0) {
      return !errors.assetIds;
    }
    if (activeStep === 1) {
      return !errors.tenantId;
    }

    return true;
  };

  const assetRequired = t('company.management.error.assets_required');
  const tenantRequired = t('company.management.error.tenant_required');

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema(t)}
      validateOnChange
      validateOnBlur={false}
      initialErrors={{
        assetIds: assetRequired,
        tenantId: tenantRequired,
      }}
      enableReinitialize
    >
      {({ isSubmitting, errors, setFieldValue, setFieldError, touched }) => (
        <StepperComponent
          loading={loading}
          activeStep={activeStep}
          onClickNext={handleNext}
          isFormContentValid={validateFormContent(errors)}
          onClickBack={handleBack}
          getSteps={getSteps}
          unmountOnExit={false}
          getStepContent={(index) =>
            getStepContent(
              index,
              {
                activeStep,
                selectedAssets,
                selectedCompany,
              },
              {
                handleAssetsChange,
                handleCompanyChange: (node) => handleCompanyChange(node, setFieldValue, setFieldError),
              },
              t('company.management.select-company'),
              errors,
              touched
            )
          }
          submitting={isSubmitting}
          nextButtonVariant="outlined"
        />
      )}
    </Formik>
  );
};

AssignAssetsForm.displayName = 'AssignAssetsForm';
