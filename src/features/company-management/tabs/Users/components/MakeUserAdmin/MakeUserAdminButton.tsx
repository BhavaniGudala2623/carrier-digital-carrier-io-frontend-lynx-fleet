import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';
import { Company, Maybe, User } from '@carrier-io/lynx-fleet-types';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';

import { MakeUserAdminDialogContent } from './MakeUserAdminDialogContent';

import { Dialog } from '@/components/Dialog';
import { useToggle } from '@/hooks';

interface MakeUserAdminButtonProps {
  handleMakeUserAdmin: (newOwnerEmail?: string) => void;
  user: User;
  company: Maybe<Company>;
  onClose: () => void;
}

export const MakeUserAdminButton = ({
  handleMakeUserAdmin,
  user,
  onClose,
  company,
}: MakeUserAdminButtonProps) => {
  const { t } = useTranslation();

  const { value: isDialogOpen, toggleOn: handleOpenDialog, toggleOff: handleCloseDialog } = useToggle(false);

  const onSaveAndDelete = () => {
    handleMakeUserAdmin(user.email);
  };

  const onCancel = () => {
    handleCloseDialog();
    onClose();
  };

  return (
    <>
      <MenuItem onClick={handleOpenDialog}>
        <Typography variant="body2">{t('user.management.user.make-company-admin')}</Typography>
      </MenuItem>
      <Dialog
        maxWidth="sm"
        onClose={onCancel}
        dialogTitle={t('user.management.user.delete-user.change-company-admin')}
        content={
          <MakeUserAdminDialogContent
            prevOwner={`${company?.contactInfo?.name} ${company?.contactInfo?.lastName}` || ''}
            newOwner={user.fullName || ''}
          />
        }
        fullWidth
        open={isDialogOpen}
        actions={
          <>
            <Button color="secondary" variant="outlined" onClick={onCancel}>
              {t('common.no')}
            </Button>
            <Button color="primary" variant="outlined" onClick={onSaveAndDelete}>
              {t('common.yes')}
            </Button>
          </>
        }
      />
    </>
  );
};
