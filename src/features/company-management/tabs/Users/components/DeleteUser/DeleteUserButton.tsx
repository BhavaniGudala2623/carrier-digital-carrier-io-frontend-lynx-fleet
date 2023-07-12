import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@carrier-io/fds-react/Button';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';
import { User } from '@carrier-io/lynx-fleet-types';

import { getGroupsWhereUserIsOwner } from '../../user.utils';

import { DeleteUserPopUpContent } from './DeleteUserPopUpContent';

import { Dialog } from '@/components/Dialog';
import { useToggle } from '@/hooks';

interface DeleteUserButtonProps {
  handleDeleteUser: (newOwnerEmail?: string) => void;
  user: User;
  onClose: () => void;
}

export const DeleteUserButton = ({ handleDeleteUser, user, onClose }: DeleteUserButtonProps) => {
  const { t } = useTranslation();
  const [newOwnerEmail, setNewOwnerEmail] = useState<string | null>(null);

  const { value: isDialogOpen, toggleOn: handleOpenDialog, toggleOff: handleCloseDialog } = useToggle(false);

  const isPrimaryContact = user.tenant?.contactInfo?.email === user.email;
  const groupsWhereUserIsOwner = useMemo(() => getGroupsWhereUserIsOwner(user), [user]);
  const groupNamesWhereUserIsOwner = useMemo(
    () => groupsWhereUserIsOwner.map((group) => group.name),
    [groupsWhereUserIsOwner]
  );

  const handleClick = () => {
    handleOpenDialog();
  };

  const onSaveAndDelete = () => {
    handleDeleteUser(newOwnerEmail || undefined);
  };

  const onCancel = () => {
    setNewOwnerEmail(null);
    handleCloseDialog();
    onClose();
  };

  const isAdminOrOwner = isPrimaryContact || groupNamesWhereUserIsOwner.length > 0;

  return (
    <>
      <MenuItem onClick={handleClick}>
        <Typography variant="body2"> {t('user.management.user.delete-user')}</Typography>
      </MenuItem>
      <Dialog
        maxWidth="sm"
        onClose={onCancel}
        dialogTitle={t('user.management.user.delete-user')}
        content={
          <DeleteUserPopUpContent
            isPrimaryContact={isPrimaryContact}
            tenantId={user.tenantId!} // TODO: fix
            tenantName={user.tenant?.name || ''}
            ownerEmail={user.email}
            groupNames={groupNamesWhereUserIsOwner}
            setNewOwnerEmail={setNewOwnerEmail}
          />
        }
        fullWidth
        open={isDialogOpen}
        actions={
          <>
            <Button color="primary" variant="outlined" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={onSaveAndDelete}
              disabled={isAdminOrOwner && !newOwnerEmail}
            >
              {isAdminOrOwner ? t('common.delete') : `${t('common.yes')}, ${t('common.delete')}`}
            </Button>
          </>
        }
      />
    </>
  );
};
