import { useMemo, useCallback } from 'react';
import Grid from '@carrier-io/fds-react/Grid';

import { GridTabs } from '../GridTabs';
import { companyManagementSlice, useCompanyManagementState } from '../../stores';
import { ActionsButton } from '../ActionsButton';

import { CompanyManagementGridTab, ITab } from '@/features/company-management/types';
import { useAppDispatch } from '@/stores';

interface DataGridHeaderProps {
  tabs: ITab[];
  selectedTabId: CompanyManagementGridTab;
}

const companiesTabGroupIds = ['COMPANIES', 'PARENTS'];
const assetsTabGroupIds = ['ASSETS', 'FLEETS'];
const usersTabGroupIds = ['USERS', 'GROUPS'];

export const DataGridHeader = ({ tabs, selectedTabId }: DataGridHeaderProps) => {
  const dispatch = useAppDispatch();

  const { searchStatistics } = useCompanyManagementState();

  const companiesTabs = useMemo(
    () => companiesTabGroupIds.map((tabId) => tabs.find((t) => t.id === tabId) as ITab),
    [tabs]
  );
  const asstesTabs = useMemo(
    () => assetsTabGroupIds.map((tabId) => tabs.find((t) => t.id === tabId) as ITab),
    [tabs]
  );
  const usersTab = useMemo(
    () => usersTabGroupIds.map((tabId) => tabs.find((t) => t.id === tabId) as ITab),
    [tabs]
  );

  const handleTabChanged = useCallback(
    (tab: CompanyManagementGridTab) => {
      dispatch(companyManagementSlice.actions.selectTab(tab));
    },
    [dispatch]
  );

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
        px: 1,
        borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
      }}
      container
    >
      <Grid display="flex" item>
        <GridTabs
          tabs={companiesTabs}
          selectedTabId={selectedTabId}
          onTabChanged={handleTabChanged}
          searchStatistics={searchStatistics}
        />
        <GridTabs
          tabs={asstesTabs}
          selectedTabId={selectedTabId}
          onTabChanged={handleTabChanged}
          searchStatistics={searchStatistics}
        />
        <GridTabs
          tabs={usersTab}
          selectedTabId={selectedTabId}
          onTabChanged={handleTabChanged}
          searchStatistics={searchStatistics}
        />
      </Grid>
      <Grid item>
        <ActionsButton />
      </Grid>
    </Grid>
  );
};
