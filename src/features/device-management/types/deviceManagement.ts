import {
  ConfigTaskStatus,
  FreezerControlType,
  Maybe,
  ProductFamilyType,
  TaskStatus,
} from '@carrier-io/lynx-fleet-types';
import { ApolloError } from '@apollo/client';

import { SensorsConfig } from './sensors';

import { DeviceSnapshotData } from '@/types';

export type DeviceStatus = 'Commissioned' | 'Installed' | 'Uninstalled';

export type BatchFileUploadStatus = 'Uploading' | 'Starting';

export interface DeviceManagementPageItem {
  serialNumber: string;
  activationDate: number;
  imei: string;
  iccid: string;
  status: string;
  freezerSerialNumber: string;
  freezerModelNumber: string;
  freezerControlMode: string;
  currentFirmware: string;
  currentConfiguration: string;
  freezerSoftwareVersion: string;
  assetName: string;
  tenantName: string;
  timestamp: number;
}

export interface BatchDeviceImportPayloadUpdate {
  createdDevices?: number;
  updatedDevices?: number;
  errors?: number;
  duplicatedDevices?: number;
  notAssignedToFlespiStream?: number;
  notAssignedToFlespiPlugin?: number;
  notCreatedInFlespi?: number;
  reportLink: string;
}

export interface BatchDeviceCommissionPayloadUpdate {
  invalidRecords: number;
  devicesNotFound: number;
  devicesArleadyCommissioned: number;
  devicesCommissioned: number;
  deviceAssociatedToDiffTRU: number;
  deviceAssociatedToDiffAsset: number;
  alreadyAssignedToDiffCompany: number;
  assetsAlreadyAssigned: number;
  fleetsCreated: number;
  assetsAssignedToCompany: number;
  assetsAssignedToFleet: number;
  bulkDeviceCommissioningStartTime: number;
  bulkDeviceCommissioningEndTime: number;
  bulkCompanyAssociationStartTime: number;
  bulkCompanyAssociationEndTime: number;
  bulkAssetFleetAssociationStartTime: number;
  bulkAssetFleetAssociationEndTime: number;
  reportLink: string;
}

export interface ImportDevicesState {
  status: TaskStatus;
  errors?: string;
  taskResult?: BatchDeviceImportPayloadUpdate;
  startTime: number;
  endTime?: number;
}

export interface ImportBulkCommissionState {
  status: TaskStatus;
  errors?: string;
  taskResult?: BatchDeviceCommissionPayloadUpdate;
  startTime: number;
  endTime?: number;
}

export interface DeviceProvisioningTableParams {
  value?: Maybe<string | number>;
  data: DeviceSnapshotData;
  deviceViewAllowed?: boolean;
}

export interface DeviceCommissioningFormValues {
  device: {
    id: string;
    productFamily: Maybe<ProductFamilyType>;
    truControlSystemType: FreezerControlType | '';
    configTaskStatus?: Maybe<ConfigTaskStatus>;
    configTask?: Maybe<ConfigTaskStatus>;
    firmwareTask?: Maybe<ConfigTaskStatus>;
    truModelNumber: string;
    truSerialNumber: string;
    compartmentConfig: {
      comp1Configured: boolean;
      comp2Configured: boolean;
      comp3Configured: boolean;
    };
  };
  asset: {
    id: string;
    name: string;
    licensePlateNumber: string;
    notes: string;
  };
  sensorConfiguration: SensorsConfig;
  fotaweb: {
    groupId?: number;
    groupName?: string;
    groupConf?: string;
    groupFirmware?: string;
  };
}

export interface ApiError extends ApolloError {
  response: {
    data: unknown;
  };
}

export type DeviceManagementTabs = 'DEVICES' | 'WIRELESS_SENSORS';

export interface DeviceManagementTabI {
  id: DeviceManagementTabs;
  label: string;
  itemsCount: Maybe<number>;
  isLoading: boolean;
  disabled?: boolean;
  hide?: boolean;
}
