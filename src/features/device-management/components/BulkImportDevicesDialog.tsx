import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import Alert from '@carrier-io/fds-react/Alert';
import Box from '@carrier-io/fds-react/Box';
import Link from '@carrier-io/fds-react/Link';

import { useBulkState } from '../providers/DeviceProvisioningContext';

import { BulkImportDevices } from './BulkImportDevices';

import { Dialog } from '@/components';

interface BulkImportDevicesDialogProps {
  handleClose: () => void;
}

export const BulkImportDevicesDialog = ({ handleClose }: BulkImportDevicesDialogProps) => {
  const { t } = useTranslation();
  const {
    setBulkFile,
    bulkFile,
    bulkFileUploading,
    handleBulkFileChange,
    importDevicesState,
    isBulkLoading,
    isImportFailed,
    isImportComplete,
    isImportStarted,
    fileNameIsValid,
    resetBulkState,
  } = useBulkState();
  const actionButtonsDisabled = isBulkLoading || !bulkFile || bulkFileUploading || !fileNameIsValid;

  const title = useMemo(
    () =>
      isImportComplete
        ? t('device.management.device.provisioning.import-complete')
        : t('device.management.device.provisioning.bulk-import-devices'),
    [isImportComplete, t]
  );

  const handleResetAndCloseDialog = () => {
    handleClose();
    if (isImportComplete) {
      resetBulkState();
    }
  };

  return (
    <Dialog
      onClose={handleResetAndCloseDialog}
      maxWidth="sm"
      dialogTitle={title}
      fullWidth
      content={
        <Box>
          <BulkImportDevices
            batchFile={bulkFile}
            onBatchFileChange={(event) => setBulkFile(event?.currentTarget?.files?.[0] ?? null)}
            importDevicesState={importDevicesState}
            loading={isBulkLoading || bulkFileUploading}
            fileNameIsValid={fileNameIsValid}
          />
        </Box>
      }
      actions={
        <Box width="100%">
          <Box display="flex" justifyContent="flex-end" mb={1}>
            {importDevicesState === null && (
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
                  onClick={handleBulkFileChange}
                  type="submit"
                  variant="outlined"
                  disabled={actionButtonsDisabled}
                >
                  {t('device.management.device.import-devices')}
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
                <Link underline="none" href={importDevicesState?.taskResult?.reportLink} color="inherit">
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
      open
    />
  );
};

BulkImportDevicesDialog.displayName = 'BulkImportDevicesDialog';
