import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';

import { Dialog } from '@/components/Dialog';

interface Props {
  onClose: () => void;
  dialogTitle: string;
  content: ReactElement;
}
export const GenerateReportDialog = ({ onClose, dialogTitle, content }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open
      dialogTitle={t(dialogTitle)}
      fullWidth
      contentSx={{ minHeight: '100%' }}
      styleContent={{ padding: '4px 8px 8px 24px' }}
      content={content}
    />
  );
};
