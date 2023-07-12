import { useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import Chip from '@carrier-io/fds-react/Chip';
import Collapse from '@carrier-io/fds-react/Collapse';

import { DrawerFooter } from '../DrawerFooter';

import { UserNavigationItem } from './UserNavigationItem';
import { Notifications } from './tabs/Notifications';
import { Preferences } from './tabs/Preferences';
import { TabHeader } from './TabHeader';
import { ExternalApiKey } from './tabs/ExternalApiKey';
import { Tabs } from './tabs/types';

import { useUserSettings } from '@/providers/UserSettings';

export const UserNavigation = () => {
  const { t } = useTranslation();

  const { userSettings, loading: userSettingsLoading } = useUserSettings();
  const { notificationEnabled } = userSettings;

  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.main);
  const [open, setOpen] = useState(true);

  const setCurrentTabToMain = () => {
    setCurrentTab(Tabs.main);
    setOpen(true);
  };

  const handleClickButton = (tab: Tabs) => {
    setCurrentTab(tab);
    setOpen(false);
  };

  return (
    <>
      <Collapse collapsedSize={0} in={open} orientation="vertical" unmountOnExit timeout="auto">
        {currentTab === Tabs.main && (
          <>
            <Box sx={{ pb: 1 }}>
              <UserNavigationItem
                title={t('user.profile.tab.preferences')}
                testId="user-profile-preferences"
                onClick={() => handleClickButton(Tabs.preferences)}
                showAdditionalInformation
              />
              <UserNavigationItem
                title={t('user.profile.tab.notifications')}
                testId="user-profile-notifications"
                onClick={() => handleClickButton(Tabs.notifications)}
                chip={
                  notificationEnabled ? (
                    <Chip
                      label={t('common.on')}
                      color="primary"
                      size="small"
                      lightBackground
                      data-testid="notification-status"
                    />
                  ) : (
                    <Chip
                      label={t('common.off')}
                      color="error"
                      size="small"
                      lightBackground
                      data-testid="notification-status"
                    />
                  )
                }
                chipLoading={userSettingsLoading}
              />
              <UserNavigationItem
                title={t('user.profile.tab.external-api-key')}
                testId="user-profile-external-api-key"
                onClick={() => handleClickButton(Tabs.externalApiKey)}
              />
            </Box>
            <DrawerFooter />
          </>
        )}
      </Collapse>
      <Collapse collapsedSize={0} in={!open} orientation="vertical" timeout="auto">
        {currentTab === Tabs.preferences && (
          <>
            <TabHeader
              title={t('user.profile.tab.preferences')}
              onClick={setCurrentTabToMain}
              data-testid="user-profile-preferences-back"
            />
            <Preferences />
          </>
        )}
      </Collapse>
      {currentTab === Tabs.notifications && (
        <Box>
          <TabHeader
            title={t('user.profile.tab.notifications')}
            onClick={setCurrentTabToMain}
            data-testid="user-profile-notifications-back"
          />
          <Notifications />
        </Box>
      )}
      {currentTab === Tabs.externalApiKey && (
        <Box>
          <TabHeader
            title={t('user.profile.tab.external-api-key')}
            onClick={setCurrentTabToMain}
            data-testid="user-profile-external-api-key-back"
          />
          <ExternalApiKey />
        </Box>
      )}
    </>
  );
};

UserNavigation.displayName = 'UserNavigation';
