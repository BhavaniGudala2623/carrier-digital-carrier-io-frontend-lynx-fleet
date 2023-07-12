import { useTranslation } from 'react-i18next';

import { BulkImportWirelessSensorForm } from './BulkImportWirelessSensorForm';

interface BulkImportWirelessSensorDialogViewProps {
  bulkFile: File | null;
  setBulkFile: (value: File | null) => void;
  isFileNameValid: boolean;
  bulkZipFile: File | null;
  setBulkZipFile: (value: File | null) => void;
  isZipFileNameValid: boolean;
}

export const BulkImportWirelessSensorDialogView = ({
  bulkFile,
  setBulkFile,
  isFileNameValid,
  bulkZipFile,
  setBulkZipFile,
  isZipFileNameValid,
}: BulkImportWirelessSensorDialogViewProps) => {
  const { t } = useTranslation();

  return (
    <>
      <BulkImportWirelessSensorForm
        bulkFile={bulkFile}
        onBatchFileChange={(event) => setBulkFile(event?.currentTarget?.files?.[0] ?? null)}
        isFileNameValid={isFileNameValid}
        titles={[
          'device.management.bluetooth-sensors.bulk-import.upload',
          'device.management.bluetooth-sensors.bulk-import.upload-csv',
        ]}
        fileTypeRule={t('device.management.bluetooth-sensors.bulk-import.must-be-csv')}
        errorMessage={t('device.management.bluetooth-sensors.bulk-import.upload-csv.error')}
        headersTKeys={[
          'device.management.bluetooth-sensors.sensors-table.mac-id',
          'device.management.device.IMEI',
        ]}
        fileType="csv"
      />
      <BulkImportWirelessSensorForm
        bulkFile={bulkZipFile}
        onBatchFileChange={(event) => setBulkZipFile(event?.currentTarget?.files?.[0] ?? null)}
        isFileNameValid={isZipFileNameValid}
        titles={['device.management.bluetooth-sensors.bulk-import.upload-zip']}
        fileTypeRule={t('device.management.bluetooth-sensors.bulk-import.must-be-zip')}
        errorMessage={t('device.management.bluetooth-sensors.bulk-import.upload-zip.error')}
        fileType="zip"
      />
    </>
  );
};
