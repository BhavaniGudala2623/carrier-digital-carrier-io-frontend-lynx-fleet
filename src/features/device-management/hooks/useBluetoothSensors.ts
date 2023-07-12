import { endsWith } from 'lodash-es';
import { useMemo, useState } from 'react';

export const useBluetoothSensors = () => {
  const [refreshStart, setRefreshStart] = useState(false);
  const [bulkFileUploading, setBulkFileUploading] = useState(false);
  const [bulkZipFileUploading, setBulkZipFileUploading] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkZipFile, setBulkZipFile] = useState<File | null>(null);

  const resetBulkState = () => {
    setBulkFile(null);
    setBulkZipFile(null);
    setBulkFileUploading(false);
    setBulkZipFileUploading(false);
  };

  const isBulkLoading = useMemo(() => false, []); // TODO

  const isFileNameValid = !!bulkFile && endsWith(bulkFile.name, 'csv');
  const isZipFileNameValid = !!bulkZipFile && endsWith(bulkZipFile.name, 'zip');

  return {
    refreshStart,
    setRefreshStart,
    isFileNameValid,
    isBulkLoading,
    bulkFileUploading,
    bulkFile,
    setBulkFile,
    resetBulkState,
    isZipFileNameValid,
    bulkZipFileUploading,
    bulkZipFile,
    setBulkZipFile,
  };
};
