import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useBluetoothState } from '../../../providers/DeviceProvisioningContext';

import { BulkImportWirelessSensorDialogView } from './BulkImportWirelessSensorDialogView';

import { Dialog } from '@/components';

interface BulkImportWirelessSensorDialogProps {
  onClose: () => void;
  onImport: () => void;
}

export const BulkImportWirelessSensorDialog = ({
  onClose,
  onImport,
}: BulkImportWirelessSensorDialogProps) => {
  const { t } = useTranslation();

  const {
    setBulkFile,
    setBulkZipFile,
    bulkFile,
    bulkZipFile,
    bulkFileUploading,
    bulkZipFileUploading,
    isBulkLoading,
    isFileNameValid,
    isZipFileNameValid,
    resetBulkState,
  } = useBluetoothState();

  const handleCancelClick = useCallback(() => {
    onClose();
    resetBulkState();
  }, [onClose, resetBulkState]);

  const isImportDisabled =
    isBulkLoading ||
    !bulkFile ||
    !bulkZipFile ||
    bulkFileUploading ||
    bulkZipFileUploading ||
    !isFileNameValid ||
    !isZipFileNameValid;

  const handleImportClick = useCallback(() => {
    onClose();
    onImport();
    resetBulkState(); // TODO refactor on imported file handling
  }, [onClose, onImport, resetBulkState]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open
      onClose={handleCancelClick}
      dialogTitle={t('device.management.bluetooth-sensors.bulk-import.wireless-sensors')}
      contentSx={{ height: 410, overflowY: 'hidden', padding: 0 }}
      content={
        <BulkImportWirelessSensorDialogView
          bulkFile={bulkFile}
          setBulkFile={setBulkFile}
          isFileNameValid={isFileNameValid}
          bulkZipFile={bulkZipFile}
          setBulkZipFile={setBulkZipFile}
          isZipFileNameValid={isZipFileNameValid}
        />
      }
      actionsSx={{ mt: 0, mb: 0 }}
      actions={
        <Box width="100%">
          <Box display="flex" justifyContent="flex-end">
            <Button autoFocus onClick={handleCancelClick} color="secondary" variant="outlined" sx={{ mr: 1 }}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleImportClick} type="submit" variant="outlined" disabled={isImportDisabled}>
              {t('device.management.bluetooth-sensors.bulk-import.import-files')}
            </Button>
          </Box>
        </Box>
      }
    />
  );
};
