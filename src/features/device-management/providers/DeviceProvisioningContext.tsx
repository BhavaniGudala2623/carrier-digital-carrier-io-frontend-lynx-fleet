import { Maybe, TenantDTO } from '@carrier-io/lynx-fleet-types';
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useMemo } from 'react';

import {
  useBatchAssociateDevices,
  useBluetoothSensors,
  useBulkCommissionDevices,
  useBulkImportDevices,
  useTabsContent,
} from '../hooks';
import {
  BatchFileUploadStatus,
  DeviceManagementTabs,
  ImportBulkCommissionState,
  ImportDevicesState,
} from '../types';

export interface DeviceProvisioningContextInterface {
  bulkState: {
    fileNameIsValid: boolean;
    isBulkLoading: boolean;
    isImportStarted: boolean;
    isImportFailed: boolean;
    isImportComplete: boolean;
    bulkFileUploading: boolean;
    handleBulkFileChange?: () => void;
    importDevicesState: ImportDevicesState | null;
    setBulkFile: Dispatch<SetStateAction<File | null>>;
    bulkFile: File | null;
    resetBulkState: () => void;
  };
  associateState: {
    isImportStarted: boolean;
    isImportFailed: boolean;
    isImportComplete: boolean;
    associateReady: boolean;
    associateDevicesState: ImportDevicesState | null;
    isAssociateLoading: boolean;
    resetAssociateState: () => void;
    batchFileUploading: boolean;
    batchLoadingProgressMessage: BatchFileUploadStatus | null;
    handleBatchFileChange: () => void;
    setBatchFile: Dispatch<SetStateAction<File | null>>;
    batchFile: File | null;
  };
  tabsContent: {
    totalDeviceCount: Maybe<number>;
    setTotalDeviceCount: Dispatch<SetStateAction<number>>;
    totalBluetoothSensorsCount: Maybe<number>;
    setTotalBluetoothSensorsCount: Dispatch<SetStateAction<number>>;
    totalDeviceCountLoading: boolean;
    setTotalDeviceCountLoading: Dispatch<SetStateAction<boolean>>;
    totalBluetoothSensorsCountLoading: boolean;
    setTotalBluetoothSensorsCountLoading: Dispatch<SetStateAction<boolean>>;
    selectedTabId: DeviceManagementTabs;
    setSelectedTabId: Dispatch<SetStateAction<DeviceManagementTabs>>;
  };
  bluetoothSensors: {
    refreshStart: boolean;
    setRefreshStart: Dispatch<SetStateAction<boolean>>;
    isFileNameValid: boolean;
    isBulkLoading: boolean;
    bulkFileUploading: boolean;
    bulkFile: File | null;
    setBulkFile: Dispatch<SetStateAction<File | null>>;
    resetBulkState: () => void;
    isZipFileNameValid: boolean;
    bulkZipFileUploading: boolean;
    bulkZipFile: File | null;
    setBulkZipFile: Dispatch<SetStateAction<File | null>>;
    // resetBulkZipState: () => void;
  };
  bulkCommissionDevicesState: {
    fileNameIsValid: boolean;
    isBulkCommissionLoading: boolean;
    isImportStarted: boolean;
    isImportFailed: boolean;
    isImportComplete: boolean;
    bulkFileUploading: boolean;
    handleBulkFileChange?: () => void;
    importBulkCommissionDevicesState: ImportBulkCommissionState | null;
    setBulkFile: Dispatch<SetStateAction<File | null>>;
    bulkFile: File | null;
    resetBulkCommissionState: () => void;
    setCompany: (a: TenantDTO | null) => void;
    company: TenantDTO | null;
    actionStartTime: string | null;
  };
}

export const DeviceProvisioningContext = createContext<DeviceProvisioningContextInterface>({
  bulkState: {
    fileNameIsValid: false,
    isBulkLoading: false,
    isImportStarted: false,
    isImportFailed: false,
    isImportComplete: false,
    bulkFileUploading: false,
    bulkFile: null,
    importDevicesState: null,
    setBulkFile: () => null,
    resetBulkState: () => {},
  },
  associateState: {
    isAssociateLoading: false,
    isImportStarted: false,
    isImportFailed: false,
    isImportComplete: false,
    resetAssociateState: () => {},
    associateReady: false,
    associateDevicesState: null,
    batchFileUploading: false,
    batchLoadingProgressMessage: null,
    handleBatchFileChange: () => null,
    setBatchFile: () => null,
    batchFile: null,
  },
  tabsContent: {
    totalDeviceCount: null,
    setTotalDeviceCount: () => null,
    totalBluetoothSensorsCount: null,
    setTotalBluetoothSensorsCount: () => null,
    totalDeviceCountLoading: false,
    setTotalDeviceCountLoading: () => null,
    totalBluetoothSensorsCountLoading: false,
    setTotalBluetoothSensorsCountLoading: () => null,
    selectedTabId: 'DEVICES',
    setSelectedTabId: () => null,
  },
  bluetoothSensors: {
    refreshStart: false,
    setRefreshStart: () => null,
    isFileNameValid: false,
    isBulkLoading: false,
    bulkFileUploading: false,
    bulkFile: null,
    setBulkFile: () => null,
    resetBulkState: () => {},
    isZipFileNameValid: false,
    bulkZipFileUploading: false,
    bulkZipFile: null,
    setBulkZipFile: () => null,
  },
  bulkCommissionDevicesState: {
    fileNameIsValid: false,
    isBulkCommissionLoading: false,
    isImportStarted: false,
    isImportFailed: false,
    isImportComplete: false,
    bulkFileUploading: false,
    bulkFile: null,
    importBulkCommissionDevicesState: null,
    setBulkFile: () => null,
    resetBulkCommissionState: () => {},
    setCompany: () => {},
    company: null,
    actionStartTime: null,
  },
});

export const useProvisioning = () => useContext(DeviceProvisioningContext);
export const useBulkState = () => useContext(DeviceProvisioningContext).bulkState;
export const useBulkCommissionState = () => useContext(DeviceProvisioningContext).bulkCommissionDevicesState;
export const useAssociateState = () => useContext(DeviceProvisioningContext).associateState;
export const useTabsState = () => useContext(DeviceProvisioningContext).tabsContent;
export const useBluetoothState = () => useContext(DeviceProvisioningContext).bluetoothSensors;

export const DeviceProvisioningProvider = ({ children }: PropsWithChildren<{}>) => {
  const bulkState = useBulkImportDevices();
  const associateState = useBatchAssociateDevices();
  const tabsContent = useTabsContent();
  const bluetoothSensors = useBluetoothSensors();
  const bulkCommissionDevicesState = useBulkCommissionDevices();

  const contextValue = useMemo(
    () => ({
      bulkState,
      associateState,
      tabsContent,
      bluetoothSensors,
      bulkCommissionDevicesState,
    }),
    [bulkState, associateState, tabsContent, bluetoothSensors, bulkCommissionDevicesState]
  );

  return (
    <DeviceProvisioningContext.Provider value={contextValue}>{children}</DeviceProvisioningContext.Provider>
  );
};
