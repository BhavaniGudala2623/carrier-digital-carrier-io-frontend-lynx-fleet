import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import Container from '@carrier-io/fds-react/Container';
import { Company } from '@carrier-io/lynx-fleet-types';

import { getSteps, getStepContent, getStepContentForCarrierAdmin } from '../Steps';
import { isRegionValid } from '../validation';

import { StepperComponent, Dialog } from '@/components';
import { useAppSelector } from '@/stores';
import { getAuthUserIsCarrierAdmin } from '@/features/authentication';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface IProps {
  loading: boolean;
  activeStep: number;
  onClickNext: () => void;
  onClickBack: () => void;
  onClose: () => void;
}

export const CreateCompanyDialog = ({ loading, activeStep, onClickBack, onClickNext, onClose }: IProps) => {
  const { t } = useTranslation();
  const authUserIsCarrierAdmin = useAppSelector(getAuthUserIsCarrierAdmin);
  const { featureFlags } = useApplicationContext();

  const shouldDisplayContractStep =
    authUserIsCarrierAdmin && featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT;

  const { isValid, dirty, values } = useFormikContext();

  const isFormContentValid = isValid && dirty && isRegionValid(values as Company);

  return (
    <Dialog
      onClose={onClose}
      open
      dialogTitle={t('company.management.add-a-company', {
        step: activeStep + 1,
        numberOfSteps: shouldDisplayContractStep ? 5 : 4,
      })}
      maxWidth="md"
      fullWidth
      dividers
      content={
        <Container sx={{ minHeight: 500 }}>
          <StepperComponent
            loading={loading}
            activeStep={activeStep}
            onClickNext={onClickNext}
            onClickBack={onClickBack}
            onClose={onClose}
            getSteps={getSteps(shouldDisplayContractStep)}
            getStepContent={shouldDisplayContractStep ? getStepContentForCarrierAdmin() : getStepContent}
            isFormContentValid={isFormContentValid}
          />
        </Container>
      }
    />
  );
};
