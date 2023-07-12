import { ChangeEvent } from 'react';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import Tab from '@carrier-io/fds-react/Tab';
import Tabs from '@carrier-io/fds-react/Tabs';
import { styled } from '@mui/material';

import { ITab, CompanyManagementGridTab, ISearchStatistics } from '../../types';

export interface IProps {
  tabs: ITab[];
  selectedTabId: CompanyManagementGridTab;
  onTabChanged: (tab: CompanyManagementGridTab) => void;
  searchStatistics: ISearchStatistics;
}

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
    margin: 0,
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
      marginLeft: '4px',
      marginRight: 0,
    },
    '& button:last-of-type': {
      marginLeft: 0,
      marginRight: '4px',
    },
  },
};

export const GridTabs = (props: IProps) => {
  const { t } = useTranslation();
  const { tabs, selectedTabId, onTabChanged, searchStatistics } = props;

  const handleChange = (_event: ChangeEvent<{}>, newValue: ITab) => {
    onTabChanged(newValue.id);
  };

  const selectedTab = tabs.find((tab) => tab.id === selectedTabId) || false;

  return (
    <Box sx={{ borderRight: (theme) => `1px solid ${theme.palette.grey[300]}`, py: 1.5 }}>
      <Tabs value={selectedTab} onChange={handleChange} aria-label="nav tabs" sx={style}>
        {tabs.map((tab) => {
          const itemsCount = searchStatistics[tab.id]?.value;
          const isLoading = searchStatistics[tab.id]?.loading;

          return (
            !tab.hide && (
              <TabStyled
                key={tab.id}
                label={`${t(tab.label)} (${isLoading ? '-' : itemsCount})`}
                value={tab}
                disableRipple
                disabled={tab.disabled}
              />
            )
          );
        })}
      </Tabs>
    </Box>
  );
};

GridTabs.displayName = 'GridTabs';
