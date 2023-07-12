import { DateFormatType } from '@carrier-io/lynx-fleet-common';
import {
  LanguageType,
  Maybe,
  TemperatureType,
  DistanceType,
  VolumeType,
  SpeedType,
} from '@carrier-io/lynx-fleet-types';

export type SavedColumns = { name: string; columns?: string[] }[] | undefined | null;

export type UserSettings = {
  email: Maybe<string>;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  fullName?: Maybe<string>;
  userLanguage: LanguageType; // TODO deprecated
  timezone: string;
  dateFormat: DateFormatType;
  temperature: TemperatureType;
  distance: DistanceType;
  volume: VolumeType;
  speed: SpeedType;
  notificationEnabled: boolean;
  assetListColumns: SavedColumns;
  commandHistoryColumns: SavedColumns;
  geofenceListColumns: SavedColumns;
  temperatureChartColumns: SavedColumns;
  assetHistoryColumns: SavedColumns;
  deviceCommissioningSensorsColumns: SavedColumns;
  deviceCommissioningDatacoldSensorsColumns: SavedColumns;
  notificationsColumns: SavedColumns;
  assetTimelineColumns: SavedColumns;
  deviceProvisioningColumns: SavedColumns;
  wirelessSensorsColumns: SavedColumns;
  reportsColumns: SavedColumns;
  companiesColumns: SavedColumns;
  companiesParentsColumns: SavedColumns;
  companyAssetsColumns: SavedColumns;
  companyFleetsColumns: SavedColumns;
  companyUsersColumns: SavedColumns;
  companyGroupsColumns: SavedColumns;
  batteryNotificationsColumns: SavedColumns;
  routeReplayVisibleColumns?: Maybe<string[]>;
};
