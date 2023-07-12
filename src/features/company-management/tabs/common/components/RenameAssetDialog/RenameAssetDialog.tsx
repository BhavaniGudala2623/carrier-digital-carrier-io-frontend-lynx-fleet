import { useTranslation } from 'react-i18next';

import { RenameAssetForm } from './RenameAssetForm';

import { Dialog } from '@/components/Dialog';

interface RenameAssetDialogProps {
  open: boolean;
  onClose: () => void;
  id: string;
  name?: string;
}

export const RenameAssetDialog = ({ open, onClose, id, name }: RenameAssetDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      dialogTitle={`${t('common.rename')}`}
      fullWidth
      contentSx={{ height: '9rem', p: 1 }}
      content={<RenameAssetForm onSubmit={onClose} id={id} name={name ?? ''} />}
    />
  );
};
