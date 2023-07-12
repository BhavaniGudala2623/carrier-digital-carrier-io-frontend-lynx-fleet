import { useEffect } from 'react';
import { UpdateGroupPayloadType } from '@carrier-io/lynx-fleet-types';
import { styled } from '@mui/material';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { UpdateGroupFormValuesType } from '../types';
import { useUpdateUserGroup } from '../hooks';
import { EditUserGroupForm } from '../components';

import { showError } from '@/stores/actions';
import { PageLoader as Loader } from '@/components/PageLoader';
import { useAppDispatch } from '@/stores';
import { useSteps } from '@/features/common';

export const LoaderContainerContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: theme.spacing(56),
}));

interface EditUserGroupFormContainerProps {
  groupId: string;
  onStepChange?: (step: number) => void;
  onSubmit?: () => void;
}
export const EditUserGroupFormContainer = ({
  groupId,
  onStepChange,
  onSubmit,
}: EditUserGroupFormContainerProps) => {
  const { activeStep, handleNext, handleBack } = useSteps();
  const dispatch = useAppDispatch();

  useEffect(() => {
    onStepChange?.(activeStep);
  }, [activeStep, onStepChange]);

  const { data: userGroupData, loading: isUserGroupLoading } = CompanyService.useGetUserGroup(
    { id: groupId },
    {
      onError: (error) => showError(dispatch, error),
    }
  );

  const group = userGroupData?.getGroupById;

  const { handleSubmit, isUpdateUserGroupLoading } = useUpdateUserGroup();
  const handleSubmitUpdateGroup = (values: UpdateGroupFormValuesType) => {
    const updateGroupPayload: UpdateGroupPayloadType = {
      id: values.id,
      tenantId: values.tenantId,
      name: values.name,
      users: values.users,
      features: values.features,
      accessAllowedRestrictions: values.accessAllowedRestrictions,
    };

    handleSubmit(updateGroupPayload)
      .then(() => {
        onSubmit?.();
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error('handleSubmitUpdateGroup :', error));
  };

  const getFormContent = () => {
    if (group && !isUserGroupLoading) {
      return (
        <EditUserGroupForm
          group={group}
          handleSubmit={handleSubmitUpdateGroup}
          isUpdateUserGroupLoading={isUpdateUserGroupLoading}
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    }

    return (
      <LoaderContainerContainer>
        <Loader />
      </LoaderContainerContainer>
    );
  };

  return <>{getFormContent()}</>;
};
