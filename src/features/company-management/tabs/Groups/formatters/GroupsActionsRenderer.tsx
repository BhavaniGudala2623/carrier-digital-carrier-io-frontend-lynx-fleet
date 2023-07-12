import { SyntheticEvent, useState } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import MenuList from '@carrier-io/fds-react/MenuList';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { MoreActionsPopover } from '../../../components';
import { HandleDeleteUserGroup, LightGroup } from '../../common/types';
import { EditUserGroupFormContainer } from '../containers';
import { DeleteGroupDialog, UserGroupDialog } from '../components';

import { Loader } from '@/components/Loader';
import { useToggle } from '@/hooks';
import { actionPayload } from '@/features/authorization';

interface GroupsActionsRendererProps {
  data: LightGroup;
  onDelete: (data: HandleDeleteUserGroup) => void;
  isLoading: boolean;
  isDeleteGroupDialogOpen: boolean;
  handleOpenDeleteGroupDialog: () => void;
  handleCloseDeleteGroupDialog: () => void;
}

export const GroupsActionsRenderer = ({
  data: group,
  onDelete,
  isLoading,
  isDeleteGroupDialogOpen,
  handleOpenDeleteGroupDialog,
  handleCloseDeleteGroupDialog,
}: GroupsActionsRendererProps) => {
  const { hasPermission } = useRbac();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<Maybe<Element>>(null);

  const {
    value: isUserGroupEditDialogOpen,
    toggleOn: handleOpenEditUserGroupDialog,
    toggleOff: handleCloseEditUserGroupDialog,
  } = useToggle(false);

  const handleDelete = (data) => {
    onDelete(data);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEditUserGroup = () => {
    handleOpenEditUserGroupDialog();
  };

  const deleteAllowed = hasPermission(
    actionPayload({
      action: 'group.delete',
      subjectId: group.id,
      subjectType: 'GROUP',
    })
  );
  const editAllowed = hasPermission(
    actionPayload({
      action: 'group.edit',
      subjectId: group.id,
      subjectType: 'GROUP',
    })
  );

  return editAllowed || deleteAllowed ? (
    <>
      <MoreActionsPopover onClose={handleClose} onOpen={handleOpen} anchorEl={anchorEl}>
        <Box minWidth={150}>
          <MenuList>
            {editAllowed && (
              <MenuItem onClick={handleEditUserGroup}>
                <Typography variant="body2">{t('company.management.edit-group')}</Typography>
              </MenuItem>
            )}
            {deleteAllowed && (
              <MenuItem onClick={handleOpenDeleteGroupDialog}>
                <Typography variant="body2">{t('company.management.delete-group')}</Typography>
              </MenuItem>
            )}
          </MenuList>
        </Box>
      </MoreActionsPopover>
      {isLoading && <Loader overlay size={16} />}
      {isUserGroupEditDialogOpen && (
        <UserGroupDialog title="company.management.users.edit-group" onClose={handleCloseEditUserGroupDialog}>
          <EditUserGroupFormContainer groupId={group.id} />
        </UserGroupDialog>
      )}
      {isDeleteGroupDialogOpen && (
        <DeleteGroupDialog
          open={isDeleteGroupDialogOpen}
          onClose={handleCloseDeleteGroupDialog}
          onDelete={handleDelete}
          group={group}
          isLoading={isLoading}
        />
      )}
    </>
  ) : null;
};
