import { useEffect, useState } from 'react';
import { MainService } from '@carrier-io/lynx-fleet-data-lib';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { BatchFileUploadStatus, ImportDevicesState } from '../types';
import { reloadDeviceManagement } from '../stores/deviceManagement/deviceManagementActions';
import { IMPORT_TIMER_INTERVAL } from '../constants';

import { useAppDispatch, useAppSelector } from '@/stores';
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

const ASSOCIATE_DEVICES_STORAGE_KEY = 'ASSOCIATE_DEVICES_TIMESTAMP';

export const useBatchAssociateDevices = () => {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector(getAuthTenant);

  const [batchFileUploading, setBatchFileUploading] = useState(false);
  const [batchLoadingProgressMessage, setBatchLoadingProgressMessage] =
    useState<BatchFileUploadStatus | null>(null);
  const [presignedFile, setPresignedFile] = useState<PresignedFileState | null>(null);
  const [associateDevicesState, setAssociateDevicesState] = useState<ImportDevicesState | null>(null);
  const [associateReady, setAssociateReady] = useState(true);
  const [batchFile, setBatchFile] = useState<Maybe<File>>(null);
  const prevAssociateDevicesState = usePrevious(associateDevicesState);

  const resetAssociateState = () => {
    setBatchFile(null);
    setBatchFileUploading(false);
    setAssociateReady(false);
    setAssociateDevicesState(null);
    setPresignedFile(null);
  };

  const noUpdateCallback = () => {
    setAssociateReady(true);
    localStorage.removeItem(ASSOCIATE_DEVICES_STORAGE_KEY);
    setAssociateDevicesState((prev) => ({
      ...(prev as ImportDevicesState),
      status: 'FAILED',
    }));
  };

  const [, stopNoUpdateTimer, resetNoUpdateTimer] = useTimeoutFn(noUpdateCallback, 180000);

  useInterval(() => {
    const importDevicesKey = localStorage.getItem(ASSOCIATE_DEVICES_STORAGE_KEY);

    if (importDevicesKey) {
      MainService.getBatchAssociateDevicesStatus({
        tenantId: tenant?.id ?? '',
        status: importDevicesKey ? undefined : 'STARTED',
      }).then(({ data }) => {
        if (data?.getBatchAssociateDeviceStatus?.doc) {
          const { taskResult, ...restStatusData } = data.getBatchAssociateDeviceStatus.doc;

          const newData = {
            ...restStatusData,
            taskResult: taskResult ? JSON.parse(taskResult) : '',
          };

          setAssociateDevicesState(newData);
          if (newData.status === 'STARTED') {
            if (
              JSON.stringify(newData.taskResult) !== JSON.stringify(prevAssociateDevicesState?.taskResult)
            ) {
              setAssociateReady(false);
              resetNoUpdateTimer();
            }
          } else if (['FINISHED', 'FAILED'].includes(newData.status)) {
            dispatch(reloadDeviceManagement());
            setAssociateReady(true);
            stopNoUpdateTimer();
            localStorage.removeItem(ASSOCIATE_DEVICES_STORAGE_KEY);
          }
        } else {
          setAssociateReady(true);
          stopNoUpdateTimer();
          setAssociateDevicesState(null);
          localStorage.removeItem(ASSOCIATE_DEVICES_STORAGE_KEY);
        }
      });
    } else {
      stopNoUpdateTimer();
    }
  }, IMPORT_TIMER_INTERVAL);

  const handleBatchFileChange = async () => {
    if (batchFile) {
      const reader = new FileReader();
      reader.addEventListener('load', async (event) => {
        if (event?.target?.result) {
          const fileNameArr = batchFile.name.split('.');
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
      reader.readAsArrayBuffer(batchFile);
    }
  };

  useEffect(() => {
    if (presignedFile) {
      setBatchFileUploading(true);
      setBatchLoadingProgressMessage('Uploading');

      uploadFileToS3(presignedFile.presignedUrl, presignedFile.source, presignedFile.contentType)
        .then(() => {
          setBatchLoadingProgressMessage('Starting');
          MainService.startBatchAssociateDevice({
            input: { tenantId: tenant?.id ?? '', fileName: presignedFile.fileName },
          }).then(({ data }) => {
            if (data?.startBatchAssociateDevice?.doc) {
              const { taskResult, ...restStatusData } = data.startBatchAssociateDevice.doc;

              setAssociateReady(false);
              resetNoUpdateTimer();
              localStorage.setItem(ASSOCIATE_DEVICES_STORAGE_KEY, 'STARTED');
              setBatchFileUploading(false);
              setBatchLoadingProgressMessage(null);
              setAssociateDevicesState({
                ...restStatusData,
                taskResult: taskResult ? JSON.parse(taskResult) : '',
              });
            }
          });
        })
        .catch((newBatchError) => {
          setAssociateReady(true);
          setBatchFileUploading(false);
          setBatchLoadingProgressMessage(null);
          if (newBatchError) {
            showError(dispatch, newBatchError);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presignedFile, tenant?.id]);

  const isAssociateLoading = Boolean(associateDevicesState && !associateReady);

  const isImportComplete = !!(
    associateDevicesState?.status && ['FINISHED', 'FAILED'].includes(associateDevicesState.status)
  );

  const isImportFailed = !!(
    (associateDevicesState?.status && associateDevicesState.status === 'FAILED') ||
    (associateDevicesState?.taskResult &&
      ((associateDevicesState?.taskResult?.duplicatedDevices ?? 0) > 0 ||
        (associateDevicesState?.taskResult?.updatedDevices ?? 0) === 0))
  );
  const isImportStarted = !!(associateDevicesState?.status && associateDevicesState.status === 'STARTED');

  return {
    isImportComplete,
    isImportFailed,
    isImportStarted,
    isAssociateLoading,
    associateReady,
    batchFileUploading,
    batchLoadingProgressMessage,
    handleBatchFileChange,
    associateDevicesState,
    setBatchFile,
    batchFile,
    resetAssociateState,
  };
};
