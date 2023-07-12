import { SyntheticEvent, useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import MenuList from '@carrier-io/fds-react/MenuList';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';
import { User, Maybe, Company } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { MoreActionsPopover } from '../../../components/MoreActionsPopover';
import { EditUserDialog } from '../components/EditUser/EditUserDialog';
import { DeleteUserButton } from '../components/DeleteUser';
import { MakeUserAdminButton } from '../components/MakeUserAdmin/MakeUserAdminButton';
import { UserFeaturesDialog } from '../components/UserFeaturesDialog';

import { PageLoader as Loader } from '@/components/PageLoader';
import { useToggle } from '@/hooks';
import { useAppSelector } from '@/stores';
import { getAuthUser } from '@/features/authentication';

interface UsersActionsRendererProps {
  data: User;
  onDelete: (email: string, newOwnerEmail?: string) => void;
  onMakeUserAdmin: () => void;
  isLoading: boolean;
  editAllowed: boolean;
  deleteAllowed: boolean;
  makeUserAdminAllowed: boolean;
  selectedCompany: Maybe<Company>;
}

export const UsersActionsRenderer = ({
  data: user,
  onDelete,
  onMakeUserAdmin,
  isLoading,
  editAllowed,
  deleteAllowed,
  makeUserAdminAllowed,
  selectedCompany,
}: UsersActionsRendererProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<Maybe<Element>>(null);
  const authUser = useAppSelector(getAuthUser);
  const { isEarlyAccessFeatureManager } = authUser ?? {};

  const {
    value: isUserEditDialogOpen,
    toggleOn: handleOpenEditUserDialog,
    toggleOff: handleCloseEditUserDialog,
  } = useToggle(false);

  const {
    value: isUserFeaturesDialogOpen,
    toggleOn: handleOpenUserFeaturesDialog,
    toggleOff: handleCloseUserFeaturesDialog,
  } = useToggle(false);

  const handleDelete = (userEmail: string, newOwnerEmail?: string) => {
    onDelete(userEmail, newOwnerEmail);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteUser = (newOwnerEmail?: string) => {
    handleDelete(user.email, newOwnerEmail);
  };

  const handleMakeUserAdmin = () => {
    onMakeUserAdmin();
    setAnchorEl(null);
  };

  const resetAnchorEl = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MoreActionsPopover onClose={handleClose} onOpen={handleOpen} anchorEl={anchorEl}>
        <Box minWidth={208}>
          <MenuList>
            {editAllowed && (
              <MenuItem onClick={handleOpenEditUserDialog}>
                <Typography variant="body2">{t('user.management.user.edit')}</Typography>
              </MenuItem>
            )}
            {makeUserAdminAllowed && (
              <MakeUserAdminButton
                user={user}
                company={selectedCompany}
                handleMakeUserAdmin={handleMakeUserAdmin}
                onClose={resetAnchorEl}
              />
            )}
            {deleteAllowed && (
              <DeleteUserButton user={user} handleDeleteUser={handleDeleteUser} onClose={resetAnchorEl} />
            )}
            {isEarlyAccessFeatureManager && (
              <MenuItem onClick={handleOpenUserFeaturesDialog}>
                <Typography variant="body2">{t('common.early-access-to-features')}</Typography>
              </MenuItem>
            )}
          </MenuList>
        </Box>
      </MoreActionsPopover>
      {isLoading && <Loader />}
      {isUserEditDialogOpen && (
        <EditUserDialog
          userEmail={user.email}
          open={isUserEditDialogOpen}
          onClose={handleCloseEditUserDialog}
        />
      )}
      {isUserFeaturesDialogOpen && (
        <UserFeaturesDialog
          userEmail={user.email}
          open={isUserFeaturesDialogOpen}
          onClose={handleCloseUserFeaturesDialog}
        />
      )}
    </>
  );
};
