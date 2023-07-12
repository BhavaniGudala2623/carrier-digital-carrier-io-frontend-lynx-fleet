import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';

import { MoveAssetsState } from '../../types';

import { StepOne } from './Steps/StepOne';
import { StepTwo } from './Steps/StepTwo';

interface MoveAssetsFormProps {
  onClose: () => void;
  onSubmit: (values: MoveAssetsState, helpers: FormikHelpers<MoveAssetsState>) => void;
  setActiveStep: (step: number) => void;
  loading: boolean;
  activeStep: number;
}

export const MoveAssetsForm = ({
  onSubmit,
  onClose,
  setActiveStep,
  activeStep,
  loading,
}: MoveAssetsFormProps) => {
  const { t } = useTranslation();

  const initialValues: MoveAssetsState = {
    assetIds: [],
    targetTenant: null,
    sourceTenant: null,
  };

  const validateFormik = (values) => {
    const errors = {} as Record<string, string>;

    if (values.assetIds.length === 0) {
      errors.assetIds = t('company.management.error.assets_required');
    }

    if (values.targetTenant?.id === values.sourceTenant?.id) {
      errors.targetTenant = t('company.management.assets-move.error.same-company');
    }

    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateFormik}
      validateOnMount
      validateOnChange
    >
      {({ handleSubmit, errors, values }) => (
        <>
          <Box display={activeStep === 0 ? 'block' : 'none'} pr={1}>
            <StepOne />
          </Box>
          <Box display={activeStep === 1 ? 'block' : 'none'}>
            <StepTwo />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => (activeStep === 0 ? onClose() : setActiveStep(0))}
              sx={{ mr: 1 }}
            >
              {activeStep === 0 ? t('common.cancel') : t('common.back')}
            </Button>
            <Button
              disabled={
                !!errors.assetIds ||
                loading ||
                (activeStep === 1 && !values.targetTenant?.id) ||
                (activeStep === 1 && !!errors.targetTenant)
              }
              variant="outlined"
              onClick={() => {
                if (activeStep === 0) {
                  setActiveStep(1);
                }

                if (activeStep === 1) {
                  handleSubmit();
                }
              }}
            >
              {activeStep === 1 ? t('common.move-here') : t('common.next')}
            </Button>
          </Box>
        </>
      )}
    </Formik>
  );
};
