interface Route {
  title: string;
  path: string;
}

export interface Routes {
  assets: Route;
  assetHistory: Route;
  assetReport: Route;
  commandHistory: Route;
  companyManagement: Route;
  deviceManagement: Route;
  deviceCommissioning: Route;
  notifications: Route;
  reports: Route;
  reportDashboard: Route;
  fleetReports: Route;
  batteryManagement: Route;
}
