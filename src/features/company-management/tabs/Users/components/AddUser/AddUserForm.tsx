import { useEffect } from 'react';
import { CreateUserInput, GroupRole } from '@carrier-io/lynx-fleet-types';
import { Formik } from 'formik';
import { TFunction } from 'i18next';
import Container from '@carrier-io/fds-react/Container';

import { useCreateUser, useValidateUser } from '../../hooks';
import { DetailsStep } from '../Steps/DetailsStep';
import { PreferencesStep } from '../Steps/PreferencesStep';
import { GroupStep } from '../Steps/GroupStep';
import { ReviewStep } from '../Steps/ReviewStep';
import { AddUserInput } from '../../types';

import { StepperComponent } from '@/components/Stepper/StepperComponent';
import { getLocalTimezone } from '@/utils';
import { defAppPreferences } from '@/constants';
import { getAuthTenantId, getAuthUserGroups } from '@/features/authentication';
import { useSteps } from '@/features/common';
import { useAppSelector } from '@/stores';

function getSteps(t: TFunction) {
  return [
    t('company.management.add-user-steps.details'),
    t('company.management.add-user-steps.group'),
    t('company.management.add-user-steps.preferences'),
    t('company.management.add-user-steps.review'),
  ];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <DetailsStep />;
    case 1:
      return <GroupStep />;
    case 2:
      return <PreferencesStep />;
    default:
      return <ReviewStep />;
  }
}

interface AddUserFormProps {
  onStepChange: (step: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const AddUserForm = ({ onStepChange, onSubmit, onClose }: AddUserFormProps) => {
  const authTenantId = useAppSelector(getAuthTenantId);
  const { activeStep, handleNext, handleBack } = useSteps();

  useEffect(() => {
    onStepChange(activeStep);
  }, [activeStep, onStepChange]);

  const { handleSubmit, isCreateUserLoading, refetchUsers } = useCreateUser();

  const handleSubmitUser = (values: AddUserInput) => {
    const createUserPayload: CreateUserInput = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      tenantId: values.tenantId,
      phone: values.phone,
      language: values.preferences.language,
      measurementDistance: values.preferences.distance,
      measurementSpeed: values.preferences.speed,
      measurementTemperature: values.preferences.temperature,
      measurementVolume: values.preferences.volume,
      timezone: values.preferences.timezone,
      notificationEnabled: true,
      groups: values.editableGroups.filter((g) => g.id),
    };

    handleSubmit(createUserPayload)
      .then(() => {
        onSubmit();

        return refetchUsers();
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error('handleSubmitUser :', error));
  };

  const accessibleGroupsIds = useAppSelector(getAuthUserGroups)
    .filter((g) => ['Manager', 'Owner'].includes(g.user.role as GroupRole))
    .map((g) => g.group.id);

  const initialValues: AddUserInput = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: null,
    tenantId: '',
    isCompanyPreferenceLoading: false,
    preferences: {
      language: defAppPreferences.language,
      temperature: defAppPreferences.temperature,
      distance: defAppPreferences.distance,
      volume: defAppPreferences.volume,
      speed: defAppPreferences.speed,
      timezone: getLocalTimezone(),
    },

    accessibleGroupsIds: accessibleGroupsIds || [],
    editableGroups: [],
    nonEditableGroups: [],
    availableTenantGroups: [],
  };

  const validate = useValidateUser(authTenantId, initialValues.email);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmitUser}
      enableReinitialize
      validate={validate}
      validateOnChange
      validateOnBlur
    >
      {({ isValid, dirty }) => (
        <Container sx={{ minHeight: 500 }}>
          <StepperComponent
            loading={isCreateUserLoading}
            activeStep={activeStep}
            onClickNext={handleNext}
            onClickBack={handleBack}
            getSteps={getSteps}
            onClose={onClose}
            getStepContent={getStepContent}
            isFormContentValid={isValid && dirty}
            nextButtonVariant="outlined"
          />
        </Container>
      )}
    </Formik>
  );
};

AddUserForm.displayName = 'AddUserForm';
