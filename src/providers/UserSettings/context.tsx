import {
  createContext,
  useContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useOktaAuth } from '@okta/okta-react';
import {
  DistanceType,
  LanguageType,
  SpeedType,
  TemperatureType,
  VolumeType,
} from '@carrier-io/lynx-fleet-types';
import { UserService } from '@carrier-io/lynx-fleet-data-lib';
import { getKnownDateFormat } from '@carrier-io/lynx-fleet-common';

import { useApplicationContext } from '../ApplicationContext';

import { SavedColumns, UserSettings } from './types';

import { getLocalTimezone } from '@/utils';
import { defAppPreferences, I18N_LANGUAGE } from '@/constants';
import { useAppSelector } from '@/stores';
import { getAuthUser } from '@/features/authentication';

export interface UserSettingsContextInterface {
  userSettings: UserSettings;
  onUserSettingsChange: (key: string, value: unknown) => void;
  loading: boolean;
}

export const defaultUserSettings: UserSettings = {
  email: null,
  firstName: '',
  lastName: '',
  fullName: '',
  userLanguage: defAppPreferences.language, // TODO remove ?
  timezone: defAppPreferences.timezone,
  dateFormat: getKnownDateFormat(undefined, defAppPreferences.language),
  temperature: defAppPreferences.temperature,
  distance: defAppPreferences.distance,
  volume: defAppPreferences.volume,
  speed: defAppPreferences.speed,
  assetListColumns: null,
  commandHistoryColumns: null,
  deviceProvisioningColumns: null,
  wirelessSensorsColumns: null,
  geofenceListColumns: null,
  temperatureChartColumns: null,
  assetHistoryColumns: null,
  deviceCommissioningSensorsColumns: null,
  deviceCommissioningDatacoldSensorsColumns: null,
  notificationsColumns: null,
  assetTimelineColumns: null,
  notificationEnabled: true,
  reportsColumns: null,
  companiesColumns: null,
  companiesParentsColumns: null,
  companyAssetsColumns: null,
  companyFleetsColumns: null,
  companyUsersColumns: null,
  companyGroupsColumns: null,
  batteryNotificationsColumns: null,
  routeReplayVisibleColumns: null,
};

export const UserSettingsContext = createContext<UserSettingsContextInterface>({
  userSettings: defaultUserSettings,
  onUserSettingsChange: () => {},
  loading: false,
});

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);

  return context;
};

export const UserSettingsContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const authUser = useAppSelector(getAuthUser);
  const { authState } = useOktaAuth();
  const [userSettingsState, setUserSettings] = useState(defaultUserSettings);
  const [loading, setLoading] = useState(false);
  const { appLanguage, setAppLanguage, setUserFeatureFlags } = useApplicationContext();

  useEffect(() => {
    if (!authUser || !authUser?.email) {
      return;
    }

    setUserFeatureFlags(authUser.enabledFeatureFlags ?? []);

    setUserSettings({
      ...userSettingsState,
      firstName: authUser.firstName || authState?.idToken?.claims?.given_name,
      lastName: authUser.lastName || authState?.idToken?.claims?.family_name,
      fullName: authUser.fullName || authState?.idToken?.claims?.name,
    });

    setLoading(true);

    const authEmail = authUser.email.toLowerCase();

    UserService.getUserSettings({ email: authEmail }).then((response) => {
      const ddbUserSettings = response.data.getUser;

      const localLanguage = localStorage.getItem(I18N_LANGUAGE) as LanguageType | null;
      const updateUserLanguage = localLanguage && localLanguage !== ddbUserSettings.language;
      const languageFromDBOrDef = ddbUserSettings.language ?? defAppPreferences.language;
      const userLanguage = localLanguage ?? languageFromDBOrDef;
      const dateFormat = getKnownDateFormat(ddbUserSettings.dateFormat, userLanguage);
      const updateUserDateFormat = dateFormat !== ddbUserSettings.dateFormat;

      const settings: UserSettings = {
        email: authEmail,
        firstName: ddbUserSettings.firstName || authState?.idToken?.claims?.given_name,
        lastName: ddbUserSettings.lastName || authState?.idToken?.claims?.family_name,
        fullName: ddbUserSettings.fullName || authState?.idToken?.claims?.name,
        distance: ddbUserSettings.measurementDistance as DistanceType,
        userLanguage,
        speed: ddbUserSettings.measurementSpeed as SpeedType,
        temperature: ddbUserSettings.measurementTemperature as TemperatureType,
        timezone: ddbUserSettings.timezone ?? getLocalTimezone(),
        dateFormat,
        volume: ddbUserSettings.measurementVolume as VolumeType,
        notificationEnabled: ddbUserSettings.notificationEnabled ?? true,
        assetListColumns: ddbUserSettings.assetListColumns as SavedColumns,
        commandHistoryColumns: ddbUserSettings.commandHistoryColumns as SavedColumns,
        geofenceListColumns: ddbUserSettings.geofenceListColumns as SavedColumns,
        temperatureChartColumns: ddbUserSettings.temperatureChartColumns as SavedColumns,
        assetHistoryColumns: ddbUserSettings.assetHistoryColumns as SavedColumns,
        deviceCommissioningSensorsColumns: ddbUserSettings.deviceCommissioningSensorsColumns as SavedColumns,
        deviceProvisioningColumns: (ddbUserSettings.deviceProvisioningColumns ?? []) as SavedColumns,
        wirelessSensorsColumns: (ddbUserSettings.wirelessSensorsColumns ?? []) as SavedColumns,
        deviceCommissioningDatacoldSensorsColumns:
          ddbUserSettings.deviceCommissioningDatacoldSensorsColumns as SavedColumns,
        notificationsColumns: ddbUserSettings.notificationsColumns as SavedColumns,
        assetTimelineColumns: ddbUserSettings.assetTimelineColumns as SavedColumns,
        reportsColumns: ddbUserSettings.reportsColumns as SavedColumns,
        companiesColumns: ddbUserSettings.companiesColumns as SavedColumns,
        companiesParentsColumns: ddbUserSettings.companiesParentsColumns as SavedColumns,
        companyAssetsColumns: ddbUserSettings.companyAssetsColumns as SavedColumns,
        companyFleetsColumns: ddbUserSettings.companyFleetsColumns as SavedColumns,
        companyUsersColumns: ddbUserSettings.companyUsersColumns as SavedColumns,
        companyGroupsColumns: ddbUserSettings.companyGroupsColumns as SavedColumns,
        batteryNotificationsColumns: ddbUserSettings.batteryNotificationsColumns as SavedColumns,
        routeReplayVisibleColumns: ddbUserSettings.routeReplayVisibleColumns as string[],
      };

      if (updateUserLanguage || updateUserDateFormat) {
        UserService.saveUserSettings({
          input: {
            email: authEmail,
            language: settings.userLanguage,
            dateFormat: settings.dateFormat,
          },
        });
      }

      setUserSettings(settings);

      if (settings.userLanguage !== appLanguage) {
        setAppLanguage(settings.userLanguage);
      }

      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const onUserSettingsChange = useCallback(
    (key: string, value: unknown) => {
      if (key !== 'language') {
        setUserSettings((prev) => ({
          ...prev,
          [key]: value,
        }));
      }

      // convert measurement field name to input field
      const dbKey = ['speed', 'volume', 'temperature', 'distance'].includes(key)
        ? `measurement${key[0].toUpperCase()}${key.slice(1)}`
        : key;

      UserService.saveUserSettings({
        input: {
          [dbKey]: value,
          email: authUser?.email || '',
        },
      });
    },
    [authUser?.email]
  );

  const contextValue = useMemo(
    () => ({
      userSettings: userSettingsState,
      onUserSettingsChange,
      loading,
    }),
    [loading, userSettingsState, onUserSettingsChange]
  );

  return <UserSettingsContext.Provider value={contextValue}>{children}</UserSettingsContext.Provider>;
};
