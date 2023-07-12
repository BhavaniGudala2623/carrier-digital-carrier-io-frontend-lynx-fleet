import Typography from '@carrier-io/fds-react/Typography';
import Button from '@carrier-io/fds-react/Button';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@/components/Dialog';
import { Loader } from '@/components';

interface DeleteConfirmationDialogProps {
  handleRemove: () => void;
  onClose: () => void;
  loading: boolean;
  assetsCount: number;
}

export const DeleteFleetConfirmationDialog = ({
  handleRemove,
  onClose,
  loading,
  assetsCount,
}: DeleteConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open
      dialogTitle={`${t('company.management.delete-fleet')}`}
      fullWidth
      contentSx={{ height: '9rem', p: 1 }}
      content={
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" pl={2}>
          <Typography variant="body1" py={1.5} pr={3.5}>
            {t('company.management.delete-fleet-question', { assetsCount })}
          </Typography>
          <Box display="flex" justifyContent="right">
            <Button
              sx={{ mt: 1, ml: 1 }}
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={onClose}
            >
              {t('common.cancel')}
            </Button>
            <Button
              sx={{ mt: 1, ml: 1 }}
              type="submit"
              variant="outlined"
              color="primary"
              size="medium"
              disabled={loading}
              onClick={handleRemove}
            >
              {t('common.delete-confirm')}
            </Button>
          </Box>
          {loading && <Loader overlay />}
        </Box>
      }
    />
  );
};
