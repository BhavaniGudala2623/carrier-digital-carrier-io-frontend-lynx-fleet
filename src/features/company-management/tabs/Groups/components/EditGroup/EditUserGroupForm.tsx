import { useMemo } from 'react';
import { Group, User } from '@carrier-io/lynx-fleet-types';
import { Formik } from 'formik';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { UpdateGroupFormValuesType } from '../../types';
import { isStepValid, getValidationSchemaUserGroup } from '../../validation';
import {
  getGroupFeatures,
  getStepsTitle,
  getUserList,
  getUsersListByRole,
  getOwnerNameDisplayValue,
} from '../../utils';
import { getStepContent } from '../Steps';

import { StepperComponent } from '@/components/Stepper/StepperComponent';
import { useAppSelector } from '@/stores';
import { getAuthTenantsHierarchy } from '@/features/authentication';

interface EditUserGroupFormProps {
  group: Group;
  handleSubmit: (values: UpdateGroupFormValuesType) => void;
  isUpdateUserGroupLoading: boolean;
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
}

export const EditUserGroupForm = ({
  group,
  handleSubmit,
  isUpdateUserGroupLoading,
  activeStep,
  handleBack,
  handleNext,
}: EditUserGroupFormProps) => {
  const owner = group.users.find(({ role }) => role === 'Owner');
  const ownerEmail = owner?.userIds[0];
  const tenantsHierarchy = useAppSelector(getAuthTenantsHierarchy);

  const company = useMemo(
    () => (group.tenantId ? tenantsHierarchy?.tenants?.find(({ id }) => id === group.tenantId) : null),
    [group.tenantId, tenantsHierarchy?.tenants]
  );

  const initialValues: UpdateGroupFormValuesType = useMemo(
    () => ({
      id: group.id,
      tenantId: group.tenantId,
      name: group.name,
      users: group.users,
      features: getGroupFeatures(group.features),
      owner: null,
      ownerName: '',
      isOwnerLoading: true,
      ownerEmail: ownerEmail || '',
      usersListByRole: {
        Member: [],
        Manager: [],
      },
      usersList: [],
      company: company
        ? { id: company.id, name: company.name, isCarrierGlobal: company.isCarrierGlobal }
        : null,
      accessAllowedRestrictions: {
        countries: group.accessAllowedRestrictions?.countries,
        regions: group.accessAllowedRestrictions?.regions,
      },
      isAdminGroup: group.isAdminGroup,
    }),
    [
      company,
      group.accessAllowedRestrictions?.countries,
      group.accessAllowedRestrictions?.regions,
      group.features,
      group.id,
      group.name,
      group.tenantId,
      group.users,
      group.isAdminGroup,
      ownerEmail,
    ]
  );

  const { data: usersData, loading: isUsersDataLoading } = CompanyService.useGetUsersForTenant(
    { tenantId: initialValues.tenantId },
    { notifyOnNetworkStatusChange: true }
  );

  const { data: userData, loading: isOwnerLoading } = CompanyService.useGetUser(
    {
      email: ownerEmail as string,
    },
    {
      skip: !ownerEmail,
    }
  );

  const groupValues = useMemo(() => {
    if (usersData) {
      const usersListByRole = getUsersListByRole(group.users, usersData.getUsersForTenant);

      return {
        ...initialValues,
        usersList: getUserList(usersData.getUsersForTenant, group.users),
        owner: userData?.getUser as User,
        ownerName: getOwnerNameDisplayValue(userData?.getUser as User),
        ownerEmail: userData?.getUser?.email || '',
        isOwnerLoading,
        usersListByRole,
      };
    }

    return initialValues;
  }, [group.users, initialValues, isOwnerLoading, userData?.getUser, usersData]);

  return (
    <Formik
      initialValues={groupValues}
      validationSchema={getValidationSchemaUserGroup(groupValues.name)}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
      validateOnMount
    >
      {({ errors }) => (
        <StepperComponent
          loading={isUpdateUserGroupLoading || isUsersDataLoading}
          activeStep={activeStep}
          onClickNext={handleNext}
          onClickBack={handleBack}
          getSteps={getStepsTitle}
          getStepContent={(step: number) => getStepContent(step, { editMode: true, activeStep })}
          isFormContentValid={isStepValid(activeStep, errors)}
        />
      )}
    </Formik>
  );
};
