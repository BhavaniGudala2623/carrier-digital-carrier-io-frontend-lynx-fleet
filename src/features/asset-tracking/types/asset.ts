import {
  Fleet,
  Device,
  Tenant,
  Maybe,
  AlertType,
  AssetStatusType,
  HealthStatusType,
} from '@carrier-io/lynx-fleet-types';

import { AssetState } from '@/types';

interface AssetType {
  name?: string;
}

export type AssetLayerFilterType = 'Alarm' | 'Yes' | 'No';

export type AssetRow = {
  id: string;
  name?: string;
  fleet: Pick<Fleet, 'id' | 'name'>;
  tenant: Pick<Tenant, 'id' | 'name'>;
  device: Pick<Device, 'id' | 'truSerialNumber' | 'serialNumber' | 'truModelNumber'>;
  licensePlateNumber?: string;
  status?: Maybe<AssetType>;
  truSerial?: Maybe<string>;
  truModel?: Maybe<string>;
  deviceSerial?: Maybe<string>;
  lastModified?: Maybe<string>;
  lastModifiedBy?: Maybe<string>;
  activeFreezerAlarms?: Maybe<string[]>;
};

export type AssetListView = 'SplitView' | 'MapView' | 'TableView';
export type TableTab = 'assets' | 'geofences';

export type AssetListFilter = {
  searchText: string;
  selectedAssetLayers: AssetLayerFilterType[];
};

export type AssetsPageState = {
  filter: AssetListFilter;
  selectedAlarm: AlertType | null;
  selectedStatus: AssetStatusType | null;
  selectedHealthStatus: HealthStatusType | null;
  selectedView: AssetListView;
  tableTab: TableTab;
  selectedAssetSearchFilterId: Maybe<string>;
  selectedAssetRowId: Maybe<string>;
};

export enum AssetsDrawerTabs {
  LiveStatus = '0',
  CompanySelect = '1',
}

export type FilterOption = {
  type: 'Asset' | 'Geofence' | 'Address';
  value: string;
  label?: string;
  address?: string;
  groupColor?: string;
  tenantId?: string;
  center?: [number, number];
};

export type AssetFeatureProperties = {
  assetId?: Maybe<string>;
  assetState: AssetState;
  latitude?: Maybe<number>;
  longitude?: Maybe<number>;
};

export interface GeofenceProperties {
  id: string;
  longitude: number;
  latitude: number;
  lastUpdate: number;
}

export interface Address {
  id: string;
  place_name: string;
  center: [number, number];
}
export interface Category {
  name: 'assets' | 'geofences' | 'addresses';
  label: string;
}
