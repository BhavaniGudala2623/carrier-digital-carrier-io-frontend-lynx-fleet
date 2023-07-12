import { FC, useCallback } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Typography from '@carrier-io/fds-react/Typography';
import ButtonBase from '@carrier-io/fds-react/ButtonBase';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@/stores';
import { showMessage } from '@/stores/actions';

export interface CopyToClipboardProps {
  label: string;
  text: string;
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ label, text }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const copyKeyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text);
    showMessage(dispatch, t('common.copied'));
  }, [text, dispatch, t]);

  return (
    <ButtonBase onClick={copyKeyToClipboard}>
      <ContentCopyIcon sx={{ marginRight: '.5rem', color: 'primary.main' }} />
      <Typography color="primary" variant="buttonMedium">
        {label}
      </Typography>
    </ButtonBase>
  );
};
