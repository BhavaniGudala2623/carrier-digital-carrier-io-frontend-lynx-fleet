import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Link from '@carrier-io/fds-react/Link';
import Alert from '@carrier-io/fds-react/Alert';
import { useTranslation } from 'react-i18next';
import { endsWith } from 'lodash-es';
import { useMemo } from 'react';

import { useAssociateState } from '../providers';

import { BatchAssociateDevices } from './BatchAssociateDevices';

import { Dialog } from '@/components';

interface AssociateDeviceWithTruDialogProps {
  handleClose: () => void;
}

export const AssociateDeviceWithTruDialog = ({ handleClose }: AssociateDeviceWithTruDialogProps) => {
  const {
    setBatchFile,
    batchFile,
    batchFileUploading,
    handleBatchFileChange,
    associateDevicesState,
    associateReady,
    isAssociateLoading,
    isImportComplete,
    isImportStarted,
    isImportFailed,
    resetAssociateState,
  } = useAssociateState();
  const { t } = useTranslation();

  const fileNameIsValid = batchFile && (endsWith(batchFile.name, 'csv') || endsWith(batchFile.name, 'xlsx'));
  const actionButtonsDisabled = isAssociateLoading || !batchFile || batchFileUploading || !fileNameIsValid;

  const title = useMemo(() => {
    if (isImportFailed) {
      return t('device.management.device.provisioning.import-failed');
    }

    return isImportComplete
      ? t('device.management.device.provisioning.import-complete')
      : t('device.management.device.provisioning.associate-device-with-tru');
  }, [isImportFailed, isImportComplete, t]);

  const handleResetAndCloseDialog = () => {
    handleClose();
    if (isImportComplete) {
      resetAssociateState();
    }
  };

  return (
    <Dialog
      maxWidth="sm"
      contentSx={{ pr: 1 }}
      onClose={handleResetAndCloseDialog}
      open
      dialogTitle={title}
      fullWidth
      content={
        <BatchAssociateDevices
          batchFile={batchFile}
          onBatchFileChange={(event) => setBatchFile(event.currentTarget.files?.[0] ?? null)}
          associateDevicesState={associateDevicesState}
          associateReady={associateReady}
          fileNameIsValid={Boolean(fileNameIsValid)}
        />
      }
      actions={
        <Box width="100%">
          <Box display="flex" justifyContent="flex-end" mb={1}>
            {associateDevicesState === null && (
              <>
                <Button
                  autoFocus
                  onClick={handleResetAndCloseDialog}
                  color="secondary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={handleBatchFileChange}
                  type="submit"
                  variant="outlined"
                  disabled={actionButtonsDisabled}
                >
                  {t('device.management.device.import-file')}
                </Button>
              </>
            )}
            {isImportStarted && (
              <Button color="primary" onClick={handleClose} variant="outlined">
                {t('device.management.device.provisioning.hide-dialog')}
              </Button>
            )}
            {isImportComplete && (
              <Button color="primary" variant="outlined">
                <Link underline="none" href={associateDevicesState?.taskResult?.reportLink} color="inherit">
                  {t('device.management.device.provisioning.download-full-report')}
                </Link>
              </Button>
            )}
          </Box>
          {isImportFailed && (
            <Alert
              sx={{ height: '64px', margin: '0 -20px -20px -20px' }}
              color="error"
              role="alert"
              severity="error"
              variant="standard"
            >
              {t('device.management.device.import-failed')}
            </Alert>
          )}
        </Box>
      }
    />
  );
};
