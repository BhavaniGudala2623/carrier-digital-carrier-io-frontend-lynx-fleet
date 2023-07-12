import { ReactElement } from 'react';
import Button from '@carrier-io/fds-react/Button';
import Box from '@carrier-io/fds-react/Box';
import Step from '@carrier-io/fds-react/Step';
import StepContent from '@carrier-io/fds-react/StepContent';
import StepLabel from '@carrier-io/fds-react/StepLabel';
import Stepper from '@carrier-io/fds-react/Stepper';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { PageLoader as Loader } from '@/components/PageLoader';

interface IProps {
  loading: boolean;
  activeStep: number;
  onClickNext: () => void;
  onClickBack: () => void;
  onClose?: () => void;
  getSteps: (t: TFunction) => string[];
  getStepContent: (index: number) => ReactElement | null;
  isFormContentValid?: boolean;
  submitting?: boolean;
  loader?: ReactElement;
  nextButtonVariant?: 'outlined' | 'contained';
  unmountOnExit?: boolean;
}

export const StepperComponent = ({
  loading,
  activeStep,
  onClickBack,
  onClickNext,
  onClose,
  getSteps,
  getStepContent,
  isFormContentValid = true,
  submitting = false,
  loader,
  nextButtonVariant = 'contained',
  unmountOnExit = undefined,
}: IProps) => {
  const { t } = useTranslation();
  const { handleSubmit } = useFormikContext();
  const steps = getSteps(t);
  const isLastStep = activeStep === steps.length - 1;

  return (
    <>
      <Stepper
        sx={{
          width: '100%',
          pb: 4,
        }}
        activeStep={activeStep}
        orientation="vertical"
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent TransitionProps={{ unmountOnExit }}>
              <Box pt={0.5} pl={2}>
                {getStepContent(index)}
              </Box>
              <Box display="flex" justifyContent="space-between" pl={2} maxWidth={490}>
                <div>
                  <Button
                    variant="outlined"
                    color="secondary"
                    disabled={!onClose && activeStep === 0}
                    onClick={activeStep === 0 && onClose ? onClose : onClickBack}
                    sx={{
                      py: 0.5,
                      px: 2,
                      mt: 1,
                      mr: 1,
                    }}
                  >
                    {activeStep === 0 && onClose ? t('common.cancel') : t('common.back')}
                  </Button>
                  <Button
                    variant={nextButtonVariant}
                    color="primary"
                    onClick={isLastStep ? () => handleSubmit() : onClickNext}
                    sx={{
                      py: 0.5,
                      px: 2,
                      mt: 1,
                      mr: 1,
                    }}
                    disabled={(isLastStep && (loading || submitting)) || !isFormContentValid}
                  >
                    {isLastStep ? t('common.save') : t('common.next')}
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {loading && (loader ?? <Loader />)}
    </>
  );
};

StepperComponent.displayName = 'StepperComponent';
