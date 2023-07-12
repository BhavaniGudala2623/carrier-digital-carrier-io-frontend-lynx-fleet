import { useEffect, useMemo, useState } from 'react';
import { MainService } from '@carrier-io/lynx-fleet-data-lib';
import { endsWith } from 'lodash-es';

import { ImportDevicesState } from '../types';
import { reloadDeviceManagement } from '../stores/deviceManagement/deviceManagementActions';
import { IMPORT_TIMER_INTERVAL } from '../constants';

import { useAppSelector, useAppDispatch } from '@/stores';
import { getAuthTenant } from '@/features/authentication';
import { usePrevious, useTimeoutFn } from '@/hooks';
import { useInterval } from '@/hooks/useInterval';
import { uploadFileToS3 } from '@/utils';
import { showError } from '@/stores/actions';

interface PresignedFileState {
  fileName: string;
  source: string | ArrayBuffer;
  contentType: string;
  presignedUrl: string;
}

const IMPORT_DEVICES_STORAGE_KEY = 'IMPORT_DEVICES_TIMESTAMP';

export const useBulkImportDevices = () => {
  const tenant = useAppSelector(getAuthTenant);
  const dispatch = useAppDispatch();

  const [bulkFileUploading, setBulkFileUploading] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [presignedFile, setPresignedFile] = useState<PresignedFileState | null>(null);
  const [importDevicesState, setImportDevicesState] = useState<ImportDevicesState | null>(null);
  const [importReady, setImportReady] = useState(true);
  const prevImportDevicesState = usePrevious(importDevicesState);

  const resetBulkState = () => {
    setBulkFile(null);
    setBulkFileUploading(false);
    setImportReady(false);
    setImportDevicesState(null);
    setPresignedFile(null);
  };

  const noUpdateCallback = () => {
    setImportReady(true);
    localStorage.removeItem(IMPORT_DEVICES_STORAGE_KEY);
    setImportDevicesState((prev) => ({
      ...(prev as ImportDevicesState),
      status: 'FAILED',
    }));
  };

  const [, stopNoUpdateTimer, resetNoUpdateTimer] = useTimeoutFn(noUpdateCallback, 180000);

  useInterval(() => {
    const importDevicesKey = localStorage.getItem(IMPORT_DEVICES_STORAGE_KEY);

    if (importDevicesKey) {
      MainService.getImportDevicesStatus({
        tenantId: tenant?.id ?? '',
        status: importDevicesKey ? undefined : 'STARTED',
      }).then(({ data }) => {
        if (data?.getImportDevicesStatus?.doc) {
          const { taskResult, ...restStatusData } = data.getImportDevicesStatus.doc;

          const newData = {
            ...restStatusData,
            taskResult: taskResult ? JSON.parse(taskResult) : '',
          };

          setImportDevicesState(newData);
          if (newData.status === 'STARTED') {
            if (JSON.stringify(newData.taskResult) !== JSON.stringify(prevImportDevicesState?.taskResult)) {
              setImportReady(false);
              resetNoUpdateTimer();
            }
          } else if (['FINISHED', 'FAILED'].includes(newData.status)) {
            dispatch(reloadDeviceManagement());
            setImportReady(true);
            stopNoUpdateTimer();
            localStorage.removeItem(IMPORT_DEVICES_STORAGE_KEY);
          }
        } else {
          setImportReady(true);
          stopNoUpdateTimer();
          setImportDevicesState(null);
          localStorage.removeItem(IMPORT_DEVICES_STORAGE_KEY);
        }
      });
    } else {
      stopNoUpdateTimer();
    }
  }, IMPORT_TIMER_INTERVAL);

  const handleBulkFileChange = async () => {
    if (bulkFile) {
      const reader = new FileReader();
      reader.addEventListener('load', async (event) => {
        if (event?.target?.result) {
          const fileNameArr = bulkFile.name.split('.');
          const fileExtension = fileNameArr.pop();
          const timestamp = new Date().getTime();
          const fileName = `${fileNameArr.join('.')}_${timestamp}.${fileExtension}`;
          const { data } = await MainService.createUploadUrl({
            file: {
              fileName,
              storageKey: `temp/${fileName}`,
            },
          });
          const { file } = data.createUploadUrl;
          setPresignedFile({
            contentType: file?.contentType ?? '',
            presignedUrl: file?.presignedUrl ?? '',
            fileName,
            source: event.target.result,
          });
        }
      });
      reader.readAsArrayBuffer(bulkFile);
    }
  };

  useEffect(() => {
    if (presignedFile) {
      setBulkFileUploading(true);

      uploadFileToS3(presignedFile.presignedUrl, presignedFile.source, presignedFile.contentType)
        .then(() => {
          MainService.startImportDevices({
            input: { tenantId: tenant?.id ?? '', fileName: presignedFile.fileName },
          }).then(({ data }) => {
            if (data?.startImportDevices?.doc) {
              const { taskResult, ...restStatusData } = data.startImportDevices.doc;

              setImportReady(false);
              resetNoUpdateTimer();
              localStorage.setItem(IMPORT_DEVICES_STORAGE_KEY, 'STARTED');
              setBulkFileUploading(false);
              setImportDevicesState({
                ...restStatusData,
                taskResult: taskResult ? JSON.parse(taskResult) : '',
              });
            }
          });
        })
        .catch((newBulkError) => {
          setImportReady(true);
          setBulkFileUploading(false);
          if (newBulkError) {
            showError(dispatch, newBulkError);
          }
        });
    }
  }, [presignedFile, tenant?.id, resetNoUpdateTimer, dispatch]);

  const isBulkLoading = useMemo(
    () => Boolean(importDevicesState && !importReady),
    [importReady, importDevicesState]
  );

  const isImportStarted = useMemo(
    () => !!(importDevicesState?.status && importDevicesState.status === 'STARTED'),
    [importDevicesState?.status]
  );

  const isImportComplete = useMemo(
    () => !!(importDevicesState?.status && ['FINISHED', 'FAILED'].includes(importDevicesState.status)),
    [importDevicesState?.status]
  );

  const isImportFailed = useMemo(
    () =>
      !!(
        (importDevicesState?.status && importDevicesState.status === 'FAILED') ||
        (importDevicesState?.taskResult &&
          ((importDevicesState?.taskResult?.duplicatedDevices ?? 0) > 0 ||
            (importDevicesState?.taskResult?.createdDevices ?? 0) === 0))
      ),
    [importDevicesState?.status, importDevicesState?.taskResult]
  );

  const fileNameIsValid = !!(bulkFile && (endsWith(bulkFile.name, 'csv') || endsWith(bulkFile.name, 'xlsx')));

  return {
    isImportStarted,
    isImportComplete,
    isImportFailed,
    importReady,
    bulkFileUploading,
    handleBulkFileChange,
    importDevicesState,
    setBulkFile,
    bulkFile,
    resetBulkState,
    isBulkLoading,
    fileNameIsValid,
  };
};
