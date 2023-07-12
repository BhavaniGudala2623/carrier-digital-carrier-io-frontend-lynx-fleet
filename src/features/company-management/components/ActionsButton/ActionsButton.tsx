import { useState, MouseEvent, useMemo } from 'react';
import Button from '@carrier-io/fds-react/Button';
import Divider from '@carrier-io/fds-react/Divider';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import Menu from '@carrier-io/fds-react/Menu';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { styled } from '@mui/material';

import { CreateCompanyForm } from '../../tabs/Companies/components/CreateCompany';
import { AssignAssetsDialog } from '../../tabs/Assets/components/AssignAssets';
import { MoveAssetsDialog } from '../../tabs/Assets/components/MoveAssets/MoveAssetsDialog';
import { CreateFleetDialog } from '../../tabs/Fleets/components/CreateFleet/CreateFleetDialog';
import { AddUserDialog } from '../../tabs/Users/components/AddUser/AddUserDialog';
import { UserGroupDialog, CreateUserGroupForm } from '../../tabs/Groups/components';

import { useToggle } from '@/hooks';
import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';

const DividerStyled = styled(Divider)({
  '&.MuiDivider-root.MuiDivider-fullWidth': {
    margin: 0,
  },
});

export const ActionsButton = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);

  const {
    createCompanyAllowed,
    moveAssetAllowed,
    createFleetAllowed,
    createUserAllowed,
    createUserGroupAllowed,
  } = useMemo(
    () => ({
      createCompanyAllowed: hasPermission(companyActionPayload('company.create', tenantId)),
      moveAssetAllowed: hasPermission(companyActionPayload('asset.move', tenantId)),
      createUserAllowed: hasPermission(companyActionPayload('user.create', tenantId)),
      createFleetAllowed: hasPermission(companyActionPayload('fleet.create', tenantId)),
      createUserGroupAllowed: hasPermission(companyActionPayload('group.create', tenantId)),
    }),
    [hasPermission, tenantId]
  );

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    value: openCreateCompanyForm,
    toggleOn: handleOpenCreateCompanyForm,
    toggleOff: handleCloseCreateCompanyForm,
  } = useToggle(false);

  const handleCreateCompany = () => {
    handleOpenCreateCompanyForm();
    handleClose();
  };

  const {
    value: isAddAssetsDialogOpen,
    toggleOn: handleOpenAddAssetsDialog,
    toggleOff: handleCloseAddAssetsDialog,
  } = useToggle(false);

  const handleAddAsset = () => {
    handleOpenAddAssetsDialog();
    handleClose();
  };

  const {
    value: openMoveAssetsDialog,
    toggleOn: handleOpenMoveAssetsDialog,
    toggleOff: handleCloseMoveAssetsDialog,
  } = useToggle(false);

  const handleMoveAsset = () => {
    handleOpenMoveAssetsDialog();
    handleClose();
  };

  const {
    value: isCreateFleetDialogOpen,
    toggleOn: handleOpenCreateFleetDialog,
    toggleOff: handleCloseCreateFleetDialog,
  } = useToggle(false);

  const handleCreateFleet = () => {
    handleOpenCreateFleetDialog();
    handleClose();
  };

  const {
    value: isAddUserDialogOpen,
    toggleOn: handleOpenAddUserDialog,
    toggleOff: handleCloseAddUserDialog,
  } = useToggle(false);

  const handleAddUser = () => {
    handleOpenAddUserDialog();
    handleClose();
  };

  const {
    value: openCreateGroupDialog,
    toggleOn: handleOpenCreateGroupDialog,
    toggleOff: handleCloseCreateGroupDialog,
  } = useToggle(false);

  const handleCreateGroup = () => {
    handleOpenCreateGroupDialog();
    handleClose();
  };

  const menuItemStyle = { m: 0, py: 1.5, px: 3.5 };
  const listItemTextStyle = { textTransform: 'capitalize' };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        sx={{
          backgroundColor: (theme) => theme.palette.common.white,
        }}
        variant="outlined"
        onClick={handleClick}
        size="small"
      >
        {t('company.management.actions')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{
          disablePadding: true,
        }}
      >
        {createCompanyAllowed && (
          <MenuItem sx={menuItemStyle} onClick={handleCreateCompany}>
            <ListItemText sx={listItemTextStyle} primary={t('company.management.add-company')} />
          </MenuItem>
        )}
        <DividerStyled />
        {moveAssetAllowed && (
          <MenuItem sx={menuItemStyle} onClick={handleAddAsset}>
            <ListItemText sx={listItemTextStyle} primary={t('company.management.assign-assets')} />
          </MenuItem>
        )}
        {moveAssetAllowed && (
          <MenuItem sx={menuItemStyle} onClick={handleMoveAsset}>
            <ListItemText sx={listItemTextStyle} primary={t('company.management.assets.move-assets')} />
          </MenuItem>
        )}
        {createFleetAllowed && (
          <MenuItem sx={menuItemStyle} onClick={handleCreateFleet}>
            <ListItemText sx={listItemTextStyle} primary={t('company.management.create-fleet')} />
          </MenuItem>
        )}
        <DividerStyled />
        {createUserAllowed && (
          <MenuItem sx={menuItemStyle} onClick={handleAddUser}>
            <ListItemText sx={listItemTextStyle} primary={t('company.management.add-users')} />
          </MenuItem>
        )}
        {createUserGroupAllowed && (
          <MenuItem sx={menuItemStyle} onClick={handleCreateGroup}>
            <ListItemText sx={listItemTextStyle} primary={t('company.management.create-group')} />
          </MenuItem>
        )}
      </Menu>
      {openCreateCompanyForm && <CreateCompanyForm onClose={handleCloseCreateCompanyForm} />}
      {isAddAssetsDialogOpen && (
        <AssignAssetsDialog open={isAddAssetsDialogOpen} onClose={handleCloseAddAssetsDialog} />
      )}
      {openMoveAssetsDialog && (
        <MoveAssetsDialog open={openMoveAssetsDialog} onClose={handleCloseMoveAssetsDialog} />
      )}
      {isCreateFleetDialogOpen && <CreateFleetDialog onClose={handleCloseCreateFleetDialog} />}
      {isAddUserDialogOpen && <AddUserDialog open={isAddUserDialogOpen} onClose={handleCloseAddUserDialog} />}
      {openCreateGroupDialog && (
        <UserGroupDialog title="company.management.users.create-group" onClose={handleCloseCreateGroupDialog}>
          <CreateUserGroupForm />
        </UserGroupDialog>
      )}
    </>
  );
};
