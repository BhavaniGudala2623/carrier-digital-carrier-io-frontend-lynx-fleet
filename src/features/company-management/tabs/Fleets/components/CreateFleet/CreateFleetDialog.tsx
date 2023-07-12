import { useTranslation } from 'react-i18next';

import { CreateFleetForm } from './CreateFleetForm';

import { Dialog } from '@/components/Dialog';

interface Props {
  onClose: () => void;
}

export const CreateFleetDialog = ({ onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      dialogTitle={t('company.management.create-fleet')}
      content={<CreateFleetForm onClose={onClose} />}
      fullWidth
      dividers
      open
    />
  );
};
