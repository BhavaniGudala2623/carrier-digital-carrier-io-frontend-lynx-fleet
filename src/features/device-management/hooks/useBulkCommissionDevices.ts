import { useEffect, useMemo, useState } from 'react';
import { MainService } from '@carrier-io/lynx-fleet-data-lib';
import { TenantDTO } from '@carrier-io/lynx-fleet-types';
import { endsWith } from 'lodash-es';

import { ImportBulkCommissionState } from '../types';
import { reloadDeviceManagement } from '../stores/deviceManagement/deviceManagementActions';
import { IMPORT_TIMER_INTERVAL } from '../constants';

import { useAppDispatch } from '@/stores';
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

const BULK_COMMISSION_DEVICES_STORAGE_KEY = 'BULK_COMMISSION_DEVICES_TIMESTAMP';

export const useBulkCommissionDevices = () => {
  const [company, setCompany] = useState<TenantDTO | null>(null);
  const [actionStartTime, setActionStartTime] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const [bulkFileUploading, setBulkFileUploading] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [presignedFile, setPresignedFile] = useState<PresignedFileState | null>(null);
  const [importBulkCommissionDevicesState, setImportBulkCommissionDevicesState] =
    useState<ImportBulkCommissionState | null>(null);
  const [importReady, setImportReady] = useState(true);
  const prevImportDevicesState = usePrevious(importBulkCommissionDevicesState);

  const resetBulkCommissionState = () => {
    setBulkFile(null);
    setBulkFileUploading(false);
    setImportReady(false);
    setImportBulkCommissionDevicesState(null);
    setPresignedFile(null);
  };

  const noUpdateCallback = () => {
    setImportReady(true);
    localStorage.removeItem(BULK_COMMISSION_DEVICES_STORAGE_KEY);
    setImportBulkCommissionDevicesState((prev) => ({
      ...(prev as ImportBulkCommissionState),
      status: 'FAILED',
    }));
  };

  const [, stopNoUpdateTimer, resetNoUpdateTimer] = useTimeoutFn(noUpdateCallback, 180000);

  useInterval(() => {
    const importDevicesKey = localStorage.getItem(BULK_COMMISSION_DEVICES_STORAGE_KEY);

    if (importDevicesKey) {
      MainService.getBulkCommissioningStatus({
        tenantId: company?.id ?? '',
        status: importDevicesKey ? undefined : 'STARTED',
      }).then(({ data }) => {
        if (data?.getBulkCommissioningStatus?.doc) {
          const { taskResult, ...restStatusData } = data.getBulkCommissioningStatus.doc;

          const newData = {
            ...restStatusData,
            taskResult: taskResult ? JSON.parse(taskResult) : '',
          };

          setImportBulkCommissionDevicesState(newData);
          if (newData.status === 'STARTED') {
            if (JSON.stringify(newData.taskResult) !== JSON.stringify(prevImportDevicesState?.taskResult)) {
              setImportReady(false);
              resetNoUpdateTimer();
            }
          } else if (['FINISHED', 'FAILED'].includes(newData.status)) {
            dispatch(reloadDeviceManagement());
            setImportReady(true);
            stopNoUpdateTimer();
            localStorage.removeItem(BULK_COMMISSION_DEVICES_STORAGE_KEY);
          }
        } else {
          setImportReady(true);
          stopNoUpdateTimer();
          setImportBulkCommissionDevicesState(null);
          localStorage.removeItem(BULK_COMMISSION_DEVICES_STORAGE_KEY);
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
          MainService.startBulkCommissioning({
            input: { tenantId: company?.id ?? '', fileName: presignedFile.fileName },
          }).then(({ data }) => {
            if (data?.startBulkCommissioning?.doc) {
              const { taskResult, ...restStatusData } = data.startBulkCommissioning.doc;

              setImportReady(false);
              resetNoUpdateTimer();
              localStorage.setItem(BULK_COMMISSION_DEVICES_STORAGE_KEY, 'STARTED');
              setBulkFileUploading(false);
              setImportBulkCommissionDevicesState({
                ...restStatusData,
                taskResult: taskResult ? JSON.parse(taskResult) : '',
              });
              setActionStartTime(new Date().toISOString());
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
  }, [presignedFile, company?.id, resetNoUpdateTimer, dispatch]);

  const isBulkCommissionLoading = useMemo(
    () => Boolean(importBulkCommissionDevicesState && !importReady),
    [importReady, importBulkCommissionDevicesState]
  );

  const isImportStarted = useMemo(
    () =>
      !!(importBulkCommissionDevicesState?.status && importBulkCommissionDevicesState.status === 'STARTED'),
    [importBulkCommissionDevicesState?.status]
  );

  const isImportComplete = useMemo(
    () =>
      !!(
        importBulkCommissionDevicesState?.status &&
        ['FINISHED', 'FAILED'].includes(importBulkCommissionDevicesState.status)
      ),
    [importBulkCommissionDevicesState?.status]
  );

  const isImportFailed = useMemo(
    () =>
      !!(
        (importBulkCommissionDevicesState?.status && importBulkCommissionDevicesState.status === 'FAILED') ||
        (importBulkCommissionDevicesState?.taskResult &&
          ((importBulkCommissionDevicesState?.taskResult?.invalidRecords ?? 0) > 0 ||
            ((importBulkCommissionDevicesState?.taskResult?.assetsAssignedToFleet ?? 0) === 0 &&
              (importBulkCommissionDevicesState?.taskResult?.assetsAssignedToCompany ?? 0) === 0)))
      ),
    [importBulkCommissionDevicesState?.status, importBulkCommissionDevicesState?.taskResult]
  );

  const fileNameIsValid = !!(bulkFile && (endsWith(bulkFile.name, 'csv') || endsWith(bulkFile.name, 'xlsx')));

  return {
    isImportStarted,
    isImportComplete,
    isImportFailed,
    importReady,
    bulkFileUploading,
    handleBulkFileChange,
    importBulkCommissionDevicesState,
    setBulkFile,
    bulkFile,
    resetBulkCommissionState,
    isBulkCommissionLoading,
    fileNameIsValid,
    company,
    setCompany,
    actionStartTime,
  };
};
