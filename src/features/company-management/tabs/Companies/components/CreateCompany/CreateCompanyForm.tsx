import { Formik } from 'formik';

import { useCreateCompany } from '../../hooks';
import { DEFAULT_FEATURE_LEVELS } from '../../../common';
import { CreateCompanyFormData } from '../../../../types';

import { CreateCompanyDialog } from './CreateCompanyDialog';
import { validationSchemaCreateCompany } from './validationSchemaCreateCompany';

import { getLocalTimezone } from '@/utils';
import { defAppPreferences } from '@/constants';
import { useSteps } from '@/features/common';

interface IProps {
  onClose: () => void;
}

export const CreateCompanyForm = ({ onClose }: IProps) => {
  const { handleSubmit, isCreateCompanyLoading, refetchCompanies } = useCreateCompany();

  const { activeStep, handleNext, handleBack } = useSteps();

  const handleSubmitCompany = (values: CreateCompanyFormData) => {
    handleSubmit(values)
      .then(() => {
        onClose();

        return refetchCompanies();
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error('handleSubmitCompany :', error));
  };

  const initialValues: CreateCompanyFormData = {
    name: '',
    companyType: undefined,
    contactInfo: {
      name: '',
      lastName: '',
      phone: '',
      email: '',
      companyAddress: '',
      city: '',
      region: null,
      country: '',
      address: '',
    },
    parentCompany: null,
    companyPreferences: {
      distance: defAppPreferences.distance,
      language: defAppPreferences.language,
      speed: defAppPreferences.speed,
      temperature: defAppPreferences.temperature,
      volume: defAppPreferences.volume,
      timeZone: getLocalTimezone(),
    },
    contractSettings: {
      usesBluetoothSensors: false,
      bluetoothSensorsReplacementPeriodInMonths: null,
    },
    features: DEFAULT_FEATURE_LEVELS,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmitCompany}
      enableReinitialize
      validationSchema={validationSchemaCreateCompany}
      validateOnChange
      validateOnBlur
    >
      <CreateCompanyDialog
        activeStep={activeStep}
        onClickBack={handleBack}
        onClickNext={handleNext}
        onClose={onClose}
        loading={isCreateCompanyLoading}
      />
    </Formik>
  );
};

CreateCompanyForm.displayName = 'CreateCompanyForm';
