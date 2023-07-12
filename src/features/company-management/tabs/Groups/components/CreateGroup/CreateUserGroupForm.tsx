import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';
import { User } from '@carrier-io/lynx-fleet-types';

import { CreateGroupFormValuesType, CreateGroupPayloadType } from '../../types';
import { getStepsTitle, getOwnerNameDisplayValue } from '../../utils';
import { getStepContent } from '../Steps';
import { isStepValid, getValidationSchemaUserGroup } from '../../validation';
import { useCreateUserGroup } from '../../hooks';
import { DEFAULT_FEATURE_LEVELS } from '../../../common';

import { StepperComponent } from '@/components/Stepper/StepperComponent';
import { useAppSelector } from '@/stores';
import { getAuthTenantId, getAuthUserEmail, getTenantByIdFromHierarchy } from '@/features/authentication';
import { useSteps } from '@/features/common';

interface CreateUserGroupFormProps {
  onStepChange?: (step: number) => void;
  onSubmit?: () => void;
}

export const CreateUserGroupForm = ({ onStepChange, onSubmit }: CreateUserGroupFormProps) => {
  const tenantId = useAppSelector(getAuthTenantId);
  const authUserEmail = useAppSelector(getAuthUserEmail);
  const { activeStep, handleNext, handleBack } = useSteps();
  const company = useAppSelector((state) => getTenantByIdFromHierarchy(state, tenantId));

  useEffect(() => {
    onStepChange?.(activeStep);
  }, [activeStep, onStepChange]);

  const initialValues: CreateGroupFormValuesType = {
    usersListByRole: {
      Member: [],
      Manager: [],
    },
    name: '',
    users: [],
    usersList: [],
    owner: null,
    ownerName: '',
    isOwnerLoading: true,
    ownerEmail: '',
    tenantId,
    features: DEFAULT_FEATURE_LEVELS,
    company: company
      ? { id: company.id, name: company.name, isCarrierGlobal: company.isCarrierGlobal }
      : null,
    accessAllowedRestrictions: { countries: [] },
  };

  const [groupValues, setGroupValues] = useState(initialValues);

  const { data: userData, loading: isOwnerLoading } = CompanyService.useGetUser({ email: authUserEmail });

  const user = userData?.getUser;

  useEffect(() => {
    if (user?.firstName || user?.lastName) {
      setGroupValues({
        ...groupValues,
        owner: user as User,
        ownerName: getOwnerNameDisplayValue(user as User),
        ownerEmail: user?.email || '',
        isOwnerLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.firstName, user?.lastName, isOwnerLoading]);

  const { handleSubmit, isCreateUserGroupLoading } = useCreateUserGroup();

  const handleSubmitCreateGroup = (values: CreateGroupFormValuesType) => {
    const numberOfLimitedCountries = values.accessAllowedRestrictions?.countries
      ? values.accessAllowedRestrictions.countries.length
      : 0;
    const numberOfLimitedRegions = values.accessAllowedRestrictions?.regions
      ? values.accessAllowedRestrictions.regions.length
      : 0;
    const createGroupPayload: CreateGroupPayloadType = {
      name: values.name,
      users: values.users,
      tenantId: values.tenantId,
      features: values.features,
      ...(numberOfLimitedCountries || numberOfLimitedRegions
        ? {
            accessAllowedRestrictions: {
              regions: values.accessAllowedRestrictions?.regions,
              countries: values.accessAllowedRestrictions?.countries,
            },
          }
        : {}),
    };

    handleSubmit(createGroupPayload)
      .then(() => {
        onSubmit?.();
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error('handleSubmitCreateGroup :', error));
  };

  return (
    <Formik
      initialValues={groupValues}
      onSubmit={handleSubmitCreateGroup}
      validationSchema={getValidationSchemaUserGroup(groupValues.name)}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ dirty, errors }) => (
        <StepperComponent
          loading={isCreateUserGroupLoading || isOwnerLoading}
          activeStep={activeStep}
          onClickNext={handleNext}
          onClickBack={handleBack}
          getSteps={getStepsTitle}
          getStepContent={(step: number) => getStepContent(step, { editMode: false, activeStep })}
          isFormContentValid={isStepValid(activeStep, errors) && dirty}
        />
      )}
    </Formik>
  );
};
