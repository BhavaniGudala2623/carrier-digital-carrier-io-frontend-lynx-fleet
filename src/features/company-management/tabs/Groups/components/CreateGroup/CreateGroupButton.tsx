import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';

import { UserGroupDialog } from '../UserGroupDialog';

import { CreateUserGroupForm } from './CreateUserGroupForm';

import { useToggle } from '@/hooks';

export const CreateGroupButton = () => {
  const { t } = useTranslation();

  const {
    value: openCreateGroupDialog,
    toggleOn: handleOpenCreateGroupDialog,
    toggleOff: handleCloseCreateGroupDialog,
  } = useToggle(false);

  return (
    <>
      <Button
        sx={{
          backgroundColor: (theme) => theme.palette.common.white,
        }}
        variant="outlined"
        onClick={handleOpenCreateGroupDialog}
      >
        {t('company.management.create-group')}
      </Button>
      {openCreateGroupDialog && (
        <UserGroupDialog title="company.management.users.create-group" onClose={handleCloseCreateGroupDialog}>
          <CreateUserGroupForm />
        </UserGroupDialog>
      )}
    </>
  );
};
