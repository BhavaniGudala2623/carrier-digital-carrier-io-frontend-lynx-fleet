import { useCallback } from 'react';
import { Formik } from 'formik';
import { TFunction } from 'i18next';
import { omit } from 'lodash-es';
import { GroupRole, EditUserInput } from '@carrier-io/lynx-fleet-types';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { useEditUser, useValidateUser } from '../../hooks';
import { DetailsStep } from '../Steps/DetailsStep';
import { PreferencesStep } from '../Steps/PreferencesStep';
import { GroupStep } from '../Steps/GroupStep';
import { ReviewStep } from '../Steps/ReviewStep';
import { EditUserState } from '../../types';
import { getObjectDifference, mapUserPreferences } from '../../../../utils';

import { useAppSelector } from '@/stores';
import { StepperComponent } from '@/components/Stepper/StepperComponent';
import { getLocalTimezone } from '@/utils';
import { defAppPreferences } from '@/constants';
import { getAuthTenantId, getAuthUserGroups, getTenantByIdFromHierarchy } from '@/features/authentication';

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
      return <DetailsStep isEdit />;
    case 1:
      return <GroupStep />;
    case 2:
      return <PreferencesStep action="edit" />;
    default:
      return <ReviewStep />;
  }
}

interface IProps {
  userEmail: string;
  onStepChange: (step: number) => void;
  onSubmit: () => void;
  activeStep: number;
  onClose: () => void;
}

export const EditUserForm = ({ userEmail, onStepChange, onSubmit, activeStep, onClose }: IProps) => {
  const authTenantId = useAppSelector(getAuthTenantId);
  const handleNext = useCallback(() => {
    onStepChange(activeStep + 1);
  }, [activeStep, onStepChange]);

  const handleBack = useCallback(() => {
    onStepChange(activeStep - 1);
  }, [activeStep, onStepChange]);

  const { data: userData, loading: isGetUserLoading } = CompanyService.useGetUser({ email: userEmail });

  const user = userData?.getUser;

  const company = useAppSelector((state) => getTenantByIdFromHierarchy(state, user?.tenantId));

  const { handleSubmit, isEditUserLoading } = useEditUser(onSubmit);

  const getPreferences = (preferences: EditUserState['preferences']) => {
    const pickedPreferences = { ...preferences };

    const mappedPreferences = mapUserPreferences(pickedPreferences);
    const filteredPreferences = Object.entries(mappedPreferences).filter(([, value]) => value);

    return Object.fromEntries(filteredPreferences);
  };

  const accessibleGroupsIds =
    useAppSelector(getAuthUserGroups)
      .filter((g) => ['Manager', 'Owner'].includes(g.user.role as GroupRole))
      .map((g) => g.group.id) || [];

  const groups =
    user?.groups?.map((g) => ({
      id: g.group.id,
      name: g.group.name,
      role: g.user.role,
    })) || [];
  const sortedGroups = groups.slice().sort((a) => (a.role === 'Owner' ? -1 : 1));
  const initialValues: EditUserState = {
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    company: company ? { id: company.id, name: company.name } : null,
    tenantId: user?.tenantId || '',
    preferences: {
      language: user?.language || defAppPreferences.language,
      temperature: user?.measurementTemperature || defAppPreferences.temperature,
      distance: user?.measurementDistance || defAppPreferences.distance,
      volume: user?.measurementVolume || defAppPreferences.volume,
      speed: user?.measurementSpeed || defAppPreferences.speed,
      timezone: user?.timezone || getLocalTimezone(),
    },
    sortedGroups,
    accessibleGroupsIds,
    editableGroups: [],
    nonEditableGroups: [],
    availableTenantGroups: [],
  };

  const validate = useValidateUser(authTenantId, initialValues.email, true);

  const handleSubmitUser = (values: EditUserState) => {
    const omitProps = (obj: EditUserState) =>
      omit(obj, [
        'accessibleGroupsIds',
        'editableGroups',
        'nonEditableGroups',
        'sortedGroups',
        'isCompanyPreferenceLoading',
        'availableTenantGroups',
      ]);

    let preferences;
    const difference = getObjectDifference(
      Object.assign(omitProps(values)),
      Object.assign(omitProps(initialValues))
    );

    if (difference?.preferences) {
      preferences = getPreferences(difference.preferences as EditUserState['preferences']);
    }
    const differences = omit(difference, ['company', 'preferences']);

    const payload: EditUserInput = {
      ...differences,
      ...preferences,
      email: initialValues.email,
      groups: values.editableGroups?.filter((g) => g.id),
    };

    if (values.email.toLowerCase() !== initialValues.email.toLowerCase()) {
      payload.newEmail = values.email;
    }

    // eslint-disable-next-line no-console
    handleSubmit(payload).catch((error) => console.error('handleSubmitUser :', error));
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmitUser}
      enableReinitialize
      validate={validate}
      validateOnChange
      validateOnBlur
      validateOnMount
    >
      {({ isValid }) => (
        <StepperComponent
          loading={isEditUserLoading || isGetUserLoading}
          activeStep={activeStep}
          onClickNext={handleNext}
          onClickBack={handleBack}
          onClose={onClose}
          getSteps={getSteps}
          getStepContent={getStepContent}
          isFormContentValid={isValid}
          nextButtonVariant="outlined"
        />
      )}
    </Formik>
  );
};

EditUserForm.displayName = 'EditUserForm';
