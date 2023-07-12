import Dialog from '@carrier-io/fds-react/Dialog';
import DialogTitle from '@carrier-io/fds-react/DialogTitle';
import Button from '@carrier-io/fds-react/Button';
import LinearProgress from '@carrier-io/fds-react/LinearProgress';
import { useTranslation } from 'react-i18next';
import Grid from '@carrier-io/fds-react/Grid';
import Box from '@carrier-io/fds-react/Box';
import { FormikProvider } from 'formik';

import { useTwoWayCommandForm } from './useTwoWayCommandForm';
import { TwoWayStatus } from './components/Status';
import { TwoWayManualCommands } from './components/ManualCommands';
import { TwoWayAssetInfo } from './components/AssetInfo';

import type { SnapshotDataEx } from '@/features/common';

interface TwoWayCommandDialogProps {
  asset: SnapshotDataEx | null;
  onClose: () => void;
}

export function TwoWayCommandDialog({ asset, onClose }: TwoWayCommandDialogProps) {
  const { t } = useTranslation();

  const { inProgress, formik, applicableCommands, applicableCompartments } = useTwoWayCommandForm({
    asset,
  });

  return (
    <FormikProvider value={formik}>
      <Dialog onClose={onClose} open maxWidth="lg" fullWidth>
        <DialogTitle id="two-way-command-dialog">{t('asset.command.two-way-command')}</DialogTitle>
        <LinearProgress variant="query" style={{ visibility: inProgress ? 'visible' : 'hidden' }} />
        <Box sx={{ pl: 3, pr: 3 }}>
          <TwoWayAssetInfo asset={asset} />
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TwoWayStatus asset={asset} applicableCompartments={applicableCompartments} />
            </Grid>
            <Grid item xs={6} sx={{ pl: 2 }}>
              <TwoWayManualCommands
                applicableCommands={applicableCommands}
                applicableCompartments={applicableCompartments}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ textAlign: 'right', padding: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onClose()}
            sx={{ mr: 1 }}
            data-testid="cancel-two-way-command"
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            data-testid="dialog-send-two-way-command"
            onClick={() => formik.submitForm()}
            disabled={inProgress || !formik.isValid}
          >
            {t('asset.command.send-command')}
          </Button>
        </Box>
      </Dialog>
    </FormikProvider>
  );
}
