import { PropsWithChildren } from 'react';
import { LanguageType } from '@carrier-io/lynx-fleet-types';

export type GenericChildrenProps = PropsWithChildren<{}>;

export interface LookerContextProps extends GenericChildrenProps {}

export type ChartArgs = {
  chartConfig: ChartConfig;
  flatChartConfig: FlatChartConfig;
  startDate: string;
  endDate: string;
  device: string;
  asset: string;
  showEvents: boolean;
  showLegend: boolean;
  showLines: boolean;
  isFahrenheit: boolean;
  reportTimeFrame: string;
  filterTimeframe: string;
  compartment1Label: string;
  compartment2Label: string;
  compartment3Label: string;
  eventsLabel: string;
  legendSettings: string[];
  userLanguage: LanguageType;
};

export type ChartConfig = { [key: string]: ChartConfigItem };
export type ChartConfigItem = {
  available: boolean;
  label: string;
  children: { [key: string]: ChartConfigItem };
  color: string;
  lookerField: string;
  statuses?: { lookerField: string; color: 'string' }[];
};

export type FlatChartConfig = { [key: string]: FlatChartConfigItem };
export type FlatChartConfigItem = { [key: string]: any };

// After the integration Looker to FE reports templates interfaces should be replaced to @carrier-io/lynx-fleet-types
export interface FleetReportsDashboard {
  title?: string;
  description?: string;
  folder: {
    id: string;
  };
  id?: string;
}

export interface TemplateLooker {
  name: string | 'Fleet Reports' | 'Dashboards' | 'Single Asset Reports';
  parent_id: string;
  id: string;
  content_metadata_id: string;
  created_at: string;
  creator_id: string;
  external_id: string;
  is_embed: boolean;
  is_embed_shared_root: boolean;
  is_embed_users_root: boolean;
  is_personal: boolean;
  is_personal_descendant: boolean;
  is_shared_root: boolean;
  is_users_root: boolean;
  child_count: number;
  dashboards: FleetReportsDashboard[];
  looks: [];
  can: {
    index: boolean;
    show: boolean;
    edit_content: boolean;
    save_shared_space_as_embed_user: boolean;
  };
}

export type ScheduledPlanDest = {
  id: string;
  format: string;
  address: string;
  type: string;
};

export type LookerReportType = 'temperature' | 'running_hours';

export type ScheduledPlan = {
  type: LookerReportType;
  name: string;
  enabled: boolean;
  dashboard_id?: string;
  crontab: string;
  timezone: string;
  id: string;
  created_at: string;
  title: string;
  scheduled_plan_destination: ScheduledPlanDest[];
  lookml_dashboard_id?: string;
  filters_string?: string;
};

export type DashboardTextType = 'template' | 'dashboard' | 'description';
