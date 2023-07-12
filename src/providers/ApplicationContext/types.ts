import {
  FlespiData,
  Fleet,
  AssetGql,
  Tenant,
  Maybe,
  AssetView,
  NavigationTreeItemType,
  HistoryFrequency,
  QuickDate,
  LanguageType,
} from '@carrier-io/lynx-fleet-types';
import { ReactNode } from 'react';
import { ButtonProps } from '@carrier-io/fds-react/Button';

import { ChartConfig } from '@/types';
import { FeatureFlagType } from '@/config';

export interface ILegendSettings extends Record<string, unknown> {
  columnsToDisplay?: string[];
}

export type CompanyManagementSettings = {
  currentTab: number;
};

export type FlatChartConfig = { [key: string]: FlatChartConfigItem };
type FlatChartConfigItem = { [key: string]: string };

export type AssetReportManagement = {
  attachedFile: string;
  reportName: string;
  tempChart: boolean;
  legend: boolean;
  table: boolean;
  legendData: string;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  asset: Maybe<AssetGql>;
  tenant: Maybe<Tenant>;
  pdfOutput: string;
  pageOrientation: 'portrait' | 'landscape';
  chartConfig?: ChartConfig;
  flatChartConfig?: FlatChartConfig;
  fleets?: Maybe<Fleet[]>;
  flespiId?: Maybe<number>;
  flespiData?: Maybe<Partial<FlespiData>>;
  userEmail?: Maybe<string>;
  attachLogo: boolean;
  logoUrl?: string;
  events: boolean;
  timeframe: Maybe<string>;
  quickDate: Maybe<QuickDate>;
  historyFrequency: Maybe<HistoryFrequency>;
};

export type ToolbarAction =
  | { type: 'BUTTON'; title: string; props: ButtonProps }
  | { type: 'CUSTOM'; control: ReactNode };

export interface ToolbarSettings {
  actionsPath?: string;
  actions?: ToolbarAction[];
  breadcrumbs?: {
    customActions?: Maybe<ReactNode[]>;
  };
}

export interface SelectedCompanyHierarchy {
  type: NavigationTreeItemType;
  id: string;
  name: string;
}

export type ApplicationContextState = {
  companyManagement: CompanyManagementSettings;
  assetReportManagement: AssetReportManagement;
  legendSettings: ILegendSettings;
  assetHistoryChartSelectedView?: Maybe<AssetView>;
  toolbarSettings: ToolbarSettings;
  selectedCompanyHierarchy: SelectedCompanyHierarchy;
};

export type ApplicationContextType = {
  applicationState: ApplicationContextState;
  setCompanyManagementSettings: (settings: CompanyManagementSettings) => void;
  setAssetReportManagement: (settings: Partial<AssetReportManagement>) => void;
  setLegendSettings: (settings: ILegendSettings) => void;
  setAssetHistoryChartSelectedView: (newView?: Maybe<AssetView>) => void;
  setToolbarSettings: (settings: ToolbarSettings) => void;
  setToolbarActions: (actionsPath: string, actions: ToolbarSettings['actions']) => void;
  resetToolbarActions: () => void;
  setBreadcrumbsSettings: (settings: ToolbarSettings['breadcrumbs']) => void;
  setSelectedCompanyHierarchy: (value: SelectedCompanyHierarchy) => void;
  appLanguage: LanguageType;
  setAppLanguage: (value: LanguageType) => void;
  featureFlags: Record<FeatureFlagType, boolean>;
  setUserFeatureFlags: (enabledFeatureFlags: string[]) => void;
};
