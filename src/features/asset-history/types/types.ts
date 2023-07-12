import {
  AssetGql,
  AssetTimelineEvent,
  AssetView,
  Device,
  EventHistoryRec,
  Fleet,
  FlespiData,
  Maybe,
  Tenant,
} from '@carrier-io/lynx-fleet-types';

import { ChartConfig } from '@/types';

export interface PartialAsset {
  device?: Maybe<Pick<Device, 'flespiId'>>;
  asset?: Maybe<Pick<AssetGql, 'id' | 'name'>>;
  tenant?: Maybe<Pick<Tenant, 'id' | 'name'>>;
}

export interface AssetHistoryState {
  history?: Maybe<Maybe<EventHistoryRec>[]>;
  chartConfig?: ChartConfig;
  timelineEvents?: Maybe<Maybe<AssetTimelineEvent>[]>;
  tenant?: Maybe<Tenant>;
  device?: Maybe<Device>;
  asset?: Maybe<AssetGql>;
  eventHistoryLoaded?: boolean;
  assetViewsLoaded?: boolean;
  assets?: PartialAsset[];
  flespiData?: Maybe<Partial<FlespiData>>;
  fleets?: Maybe<Fleet[]>;
  availableColumns?: string[];
  assetViewsError?: Maybe<string>;
  eventHistoryError?: Maybe<string>;
  exportAssetHistoryError?: Maybe<string>;
  assetsError?: Maybe<string>;
  assetViews?: AssetView[];
  totalCount?: number;
  assetsLoaded?: boolean;
  binTimeMinutes?: number;
  emptyDataMessageShown?: boolean;
}

export enum AssetHistoryTabs {
  RouteReplayTabView = 0,
  TemperatureGraphTabView = 1,
  AssetHistoryTableTabView = 2,
}

export type IColumnsToDisplay = string[] | undefined;

export interface CompartmentsStatuses {
  freezer_comp1_power_status?: boolean;
  freezer_comp2_power_status?: boolean;
  freezer_comp3_power_status?: boolean;
  freezer_trs_comp1_power_status?: boolean;
  freezer_trs_comp2_power_status?: boolean;
  freezer_trs_comp3_power_status?: boolean;
}
