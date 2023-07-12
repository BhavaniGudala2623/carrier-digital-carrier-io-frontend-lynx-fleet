import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import Tab from '@carrier-io/fds-react/Tab';
import Tabs from '@carrier-io/fds-react/Tabs';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import { styled } from '@mui/material';

import { DeviceManagementTabI, DeviceManagementTabs } from '../../types';

const TabStyled = styled(Tab)(({ theme }) => ({
  borderRadius: '4px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    height: 32,
  },
}));

const style = {
  minHeight: 24,
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '&.MuiTabs-root': {
    '& button': {
      minHeight: 32,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: '4px',
      marginRight: '4px',
      padding: '0 8px!important' as '0 8px',
      fontSize: 14,
    },
    '& button:first-of-type': {
      marginRight: 0,
    },
    '& button:last-of-type': {
      marginLeft: 0,
    },
  },
};

interface PageTabsProps {
  tabs: DeviceManagementTabI[];
  selectedTabId: DeviceManagementTabs;
  onTabChanged: Dispatch<SetStateAction<DeviceManagementTabs>>;
}
export const PageTabs = ({ tabs, selectedTabId, onTabChanged }: PageTabsProps) => {
  const { t } = useTranslation();

  const handleChange = (_event: ChangeEvent<{}>, newValue: DeviceManagementTabI) => {
    onTabChanged(newValue.id);
  };

  const selectedTab = tabs.find((tab) => tab.id === selectedTabId) || false;

  return (
    <Box
      sx={{
        borderRight: (theme) => `1px solid ${theme.palette.grey[300]}`,
        py: 2,
        px: 1.5,
        '&:first-of-type': { paddingLeft: 0 },
      }}
    >
      <Tabs value={selectedTab} onChange={handleChange} aria-label="nav tabs" sx={style}>
        {tabs.map(
          (tab) =>
            !tab.hide && (
              <TabStyled
                key={tab.id}
                label={`${t(tab.label)} (${tab.isLoading || !tab.itemsCount ? '-' : tab.itemsCount})`}
                value={tab}
                disableRipple
                disabled={tab.disabled}
              />
            )
        )}
      </Tabs>
    </Box>
  );
};
