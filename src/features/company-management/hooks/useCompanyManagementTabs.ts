import { useEffect, useState } from 'react';

import { ITab, NavigationTreeItemType } from '../types';
import { companyManagementSlice } from '../stores';

import { useAppDispatch } from '@/stores';
import { useApplicationContext } from '@/providers/ApplicationContext';

const checkShowTabs = (
  tabs: ITab[],
  showAssets: boolean,
  showUsers: boolean,
  showFleets: boolean,
  showGroups: boolean,
  type?: NavigationTreeItemType
) =>
  tabs.map((tab) => {
    if (tab.id === 'ASSETS') {
      return {
        ...tab,
        hide: !showAssets,
      };
    }

    if (tab.id === 'USERS') {
      return {
        ...tab,
        hide: !showUsers,
        disabled: type === 'FLEET',
      };
    }

    if (tab.id === 'FLEETS') {
      return {
        ...tab,
        hide: !showFleets,
      };
    }

    if (tab.id === 'GROUPS') {
      return {
        ...tab,
        hide: !showGroups,
      };
    }

    return { ...tab, disabled: type === 'FLEET' };
  });

export function useCompanyManagementTabs(
  initTabs: ITab[],
  showAssets: boolean,
  showUsers: boolean,
  showFleets: boolean,
  showGroups: boolean
) {
  const [tabs, setTabs] = useState(initTabs);
  const dispatch = useAppDispatch();
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();

  useEffect(() => {
    const selectedItemType = selectedCompanyHierarchy.type;

    if (selectedItemType === 'FLEET') {
      setTabs((prevTabs) =>
        checkShowTabs(prevTabs, showAssets, showUsers, showFleets, showGroups, selectedItemType)
      );
      dispatch(companyManagementSlice.actions.selectTab('FLEETS'));
    } else {
      setTabs(
        checkShowTabs(
          initTabs,
          showAssets,
          showUsers,
          showFleets,
          showGroups,
          selectedItemType === 'ALL' ? 'GLOBAL' : selectedItemType
        )
      );
    }
  }, [initTabs, dispatch, selectedCompanyHierarchy, showAssets, showUsers, showFleets, showGroups]);

  return { tabs };
}
