import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Company, User } from '@carrier-io/lynx-fleet-types';
import { CompanyService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { UsersActionsRenderer } from '../../Users';
import { UsersTableParams } from '../../Users/types';
import { useUsersTabState } from '../providers';
import { GroupsActionsRenderer } from '../../Groups';
import { useEditOne } from '../../../hooks';
import { HandleDeleteUserGroup, LightGroup } from '../types';
import { isUserTableData } from '../../Users/user.utils';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { useToggle } from '@/hooks';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const UsersActionsRendererContainer = ({ data }: UsersTableParams) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();

  const { editAllowed, deleteAllowed } = useUsersTabState();

  const secondMessageTimeout = useRef<ReturnType<typeof setTimeout>>();

  const [deleteUser, { loading: deleteUserLoading }] = CompanyService.useDeleteUser();
  const [deleteUserGroup, { loading: deleteUserGroupLoading }] = CompanyService.useDeleteUserGroup();
  const [deleteGroupAndMoveUsers, { loading: deleteGroupAndMoveUsersLoading }] =
    CompanyService.useDeleteGroupAndMoveUsers();

  const {
    value: isDeleteGroupDialogOpen,
    toggleOn: handleOpenDeleteGroupDialog,
    toggleOff: handleCloseDeleteGroupDialog,
  } = useToggle(false);

  const handleMakeUserAdminSuccess = async () => {
    showMessage(dispatch, t('user.management.user.make-company-admin-success'));
  };

  const {
    mutationError: updateCompanyError,
    queryError: getCompanyError,
    entity: company,
    loading: makeUserAdminLoading,
    onSave: updateCompany,
  } = useEditOne<Company>({
    id: selectedCompanyHierarchy.id || '',
    entityKey: 'getTenantById',
    updateEntityKey: 'tenant',
    getOneEntityQuery: CompanyService.GET_TENANT_BY_ID,
    updateOneEntityQuery: CompanyService.UPDATE_COMPANY,
    refetchQueries: [CompanyService.GET_SUB_TENANTS_FOR_TENANT],
    skipQuery: selectedCompanyHierarchy.type !== 'COMPANY',
    onSuccessCallBack: handleMakeUserAdminSuccess,
  });

  const isPrimaryContact = isUserTableData(data) && data.tenant?.contactInfo?.email === data.email;

  const refetchData = async () => {
    try {
      await userClient.refetchQueries({
        include: [CompanyService.GET_USERS, CompanyService.GET_SUB_TENANTS_FOR_TENANT],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Refetch users', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDeleteUserSuccess = async (newOwnerEmail?: string) => {
    showMessage(dispatch, t('user.management.user.delete-success'));
    if (newOwnerEmail) {
      secondMessageTimeout.current = setTimeout(() => {
        if (isPrimaryContact) {
          showMessage(dispatch, t('user.management.user.make-company-admin-success'));
        } else {
          showMessage(dispatch, t('user.management.user.delete-user.change-group-owner-success'));
        }
      }, 1000);
    }
    await refetchData();
  };

  useEffect(
    () => () => {
      if (secondMessageTimeout.current) {
        clearTimeout(secondMessageTimeout.current);
      }
    },
    []
  );

  const handleDeleteUser = useCallback(
    async (email: string, newOwnerEmail?: string) => {
      if (!email) {
        return;
      }

      try {
        await deleteUser({
          variables: { email, newOwnerEmail },
        });

        await handleDeleteUserSuccess(newOwnerEmail);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        showError(dispatch, t('user.management.user.delete-error'));
      }
    },
    [deleteUser, dispatch, handleDeleteUserSuccess, t]
  );

  const handleDeleteUserGroupSuccess = useCallback(async () => {
    showMessage(dispatch, t('user.management.group.delete-success'));

    await refetchData();
  }, [dispatch, t]);

  const handleDeleteUserGroup = useCallback(
    async ({ groupToDeleteId, groupToReceiveId, usersToDelete }: HandleDeleteUserGroup) => {
      try {
        if (groupToReceiveId) {
          await deleteGroupAndMoveUsers({
            variables: { groupToDeleteId, groupToReceiveId },
          });

          showMessage(dispatch, t('user.management.group.delete-success.user-moved'));
        } else if (usersToDelete && usersToDelete.length > 0) {
          await deleteUserGroup({
            variables: { groupId: groupToDeleteId },
          });

          const promises = usersToDelete.map(({ email }) =>
            deleteUser({
              variables: { email },
            })
          );

          await Promise.all(promises);
        } else {
          await deleteUserGroup({
            variables: { groupId: groupToDeleteId },
          });
        }

        handleCloseDeleteGroupDialog();
        await handleDeleteUserGroupSuccess();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        showError(dispatch, t('user.management.group.delete-error'));
      }
    },
    [
      dispatch,
      deleteUserGroup,
      handleDeleteUserGroupSuccess,
      t,
      deleteGroupAndMoveUsers,
      deleteUser,
      handleCloseDeleteGroupDialog,
    ]
  );

  const handleMakeUserAdmin = useCallback(() => {
    if (isUserTableData(data)) {
      updateCompany({} as Company, {
        contactInfo: {
          email: data.email.toLowerCase(),
          name: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });
    }
  }, [data, updateCompany]);

  useEffect(() => {
    if (getCompanyError) {
      showError(dispatch, getCompanyError);
    }
  }, [getCompanyError, dispatch]);

  useEffect(() => {
    if (updateCompanyError) {
      showError(dispatch, updateCompanyError);
    }
  }, [updateCompanyError, dispatch]);

  if (data?.type === 'GROUP') {
    return (
      <GroupsActionsRenderer
        data={data as LightGroup}
        onDelete={handleDeleteUserGroup}
        isLoading={deleteUserGroupLoading || deleteGroupAndMoveUsersLoading}
        isDeleteGroupDialogOpen={isDeleteGroupDialogOpen}
        handleOpenDeleteGroupDialog={handleOpenDeleteGroupDialog}
        handleCloseDeleteGroupDialog={handleCloseDeleteGroupDialog}
      />
    );
  }

  const isCompanyFleetSelected =
    selectedCompanyHierarchy.type &&
    ['COMPANY', 'FLEET'].includes(selectedCompanyHierarchy.type) &&
    !isPrimaryContact;

  return (
    <UsersActionsRenderer
      data={data as User}
      selectedCompany={company}
      onDelete={handleDeleteUser}
      onMakeUserAdmin={handleMakeUserAdmin}
      isLoading={deleteUserLoading || makeUserAdminLoading}
      makeUserAdminAllowed={isCompanyFleetSelected || false}
      editAllowed={editAllowed}
      deleteAllowed={deleteAllowed}
    />
  );
};
