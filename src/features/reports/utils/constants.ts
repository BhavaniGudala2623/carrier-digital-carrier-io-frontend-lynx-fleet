export const DELIM = '::';
export const FALLBACK_EMBED_SESSION_LENGTH = 86400; // 1 day
export const GROUP_COMPANY_ADMIN = 'company_admin';
export const GROUP_SUB_COMPANY_ADMIN = 'sub_company_admin';
export const GROUP_FLEET_ADMIN = 'fleet_admin';
export const GROUP_REPORT_EDITOR = 'report_editor';
export const GROUP_SYSTEM_ADMIN = 'admin';
export const LOOKER_NULL_STRING_FILTER = '%, NULL';
export const LOOKER_PROJECT = 'celsius_lynx_fleet';
export const LOOKER_VIEW = 'telemetry2';
export const USER_ATTRIBUTE_COMPANY = 'company';
export const USER_ATTRIBUTE_FLEETS = 'fleets';
export const USER_ATTRIBUTE_SYNCING = 'syncing';
export const USER_ATTRIBUTE_SUB_COMPANY = 'sub_companies';
export const TEMPERATURE_REPORT_TEMPLATE_NAME = 'temperature_report_template_w_filters_2';
export const DASHBOARD_TEMPLATE_ID: string = `${LOOKER_PROJECT}::${TEMPERATURE_REPORT_TEMPLATE_NAME}`;
export const LOOKER_NULL_STRING_FILTER_REPORT = '%,NULL';

// REPORT TEMPLATES / DASHBOARD TITLES
export const DASHBOARDS = 'Dashboards';

export const FLEET_REPORTS = 'Fleet Reports';
export const RUNNING_HOURS_TOTAL_UNIT = 'Fleet Running Hours with Total Unit Hours';
export const FLEET_GEOFENCE_DWELL_TIME = 'Fleet Geofence Dwell Time';
export const FLEET_LOW_BATTERY_STATUS = 'Fleet Low Battery Status Report';
export const FLEET_LOW_FUEL_STATUS = 'Fleet Low Fuel Status Report';
export const FLEET_RUNNING_HOURS = 'Fleet Running Hours';
export const FLEET_SUSTAINABLE_PRACTICES = 'Fleet Sustainable Practices';
export const SINGLE_ASSET_REPORTS = 'Single Asset Reports';
export const FLEET_TRU_ALARMS = 'TRU Alarms Report';
export const TEMPERATURE_REPORT_FILTERS = 'Temperature Report w/ Filters 2';

export const templateNames = new Map([
  [DASHBOARDS, 'assets.reports.dashboards'],
  [FLEET_REPORTS, 'assets.reports.fleet-reports'],
  [SINGLE_ASSET_REPORTS, 'assets.reports.single-asset-reports'],
]);

export const dashboardTitles = new Map([
  [RUNNING_HOURS_TOTAL_UNIT, 'assets.reports.fleet-reports.running-hours-total-unit'],
  [FLEET_GEOFENCE_DWELL_TIME, 'assets.reports.fleet-reports.fleet-geofence-dwell-time'],
  [FLEET_LOW_BATTERY_STATUS, 'assets.reports.fleet-reports.fleet-low-battery-status'],
  [FLEET_LOW_FUEL_STATUS, 'assets.reports.fleet-reports.fleet-low-fuel-status'],
  [FLEET_RUNNING_HOURS, 'assets.reports.fleet-reports.running-hours'],
  [FLEET_SUSTAINABLE_PRACTICES, 'assets.reports.fleet-reports.sustainable-practices'],
  [FLEET_TRU_ALARMS, 'assets.reports.fleet-reports.fleet-tru-alarms'],
]);

export const dashboardDescriptions = new Map([
  [RUNNING_HOURS_TOTAL_UNIT, 'assets.reports.fleet-reports.running-hours-total-unit-description'],
  [FLEET_GEOFENCE_DWELL_TIME, 'assets.reports.fleet-reports.fleet-geofence-dwell-time-description'],
  [FLEET_LOW_BATTERY_STATUS, 'assets.reports.fleet-reports.fleet-low-battery-status-description'],
  [FLEET_LOW_FUEL_STATUS, 'assets.reports.fleet-reports.fleet-low-fuel-status-description'],
  [FLEET_RUNNING_HOURS, 'assets.reports.fleet-reports.running-hours-description'],
  [FLEET_TRU_ALARMS, 'assets.reports.fleet-reports.fleet-tru-alarms-description'],
]);

export const reportIds = new Map([
  ['celsius_lynx_fleet::fleet_running_hours_with_total_unit_hours', RUNNING_HOURS_TOTAL_UNIT],
  ['celsius_lynx_fleet::geofence_dwell_time_report', FLEET_GEOFENCE_DWELL_TIME],
  ['celsius_lynx_fleet::low_battery_report', FLEET_LOW_BATTERY_STATUS],
  ['celsius_lynx_fleet::fuel_level_report', FLEET_LOW_FUEL_STATUS],
  ['celsius_lynx_fleet::running_hours_report', FLEET_RUNNING_HOURS],
  ['celsius_lynx_fleet::sustainability-report', FLEET_SUSTAINABLE_PRACTICES],
  ['celsius_lynx_fleet::tru_alarms_report', FLEET_TRU_ALARMS],
]);
