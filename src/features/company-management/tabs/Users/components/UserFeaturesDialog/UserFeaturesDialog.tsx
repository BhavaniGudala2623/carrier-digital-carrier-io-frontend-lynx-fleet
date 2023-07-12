import { useTranslation } from 'react-i18next';

import { UserFeaturesForm } from './UserFeaturesForm';

import { Dialog } from '@/components/Dialog';

interface IProps {
  userEmail: string;
  open: boolean;
  onClose: () => void;
}

export const UserFeaturesDialog = ({ userEmail, open, onClose }: IProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      dialogTitle={t('common.early-access-to-features')}
      fullWidth
      dividers
      content={<UserFeaturesForm userEmail={userEmail} onClose={onClose} />}
    />
  );
};
