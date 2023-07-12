import { ChangeEvent, FC, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import Button from '@carrier-io/fds-react/Button';
import Drawer from '@carrier-io/fds-react/Drawer';
import Grid from '@carrier-io/fds-react/Grid';
import { MenuOpen, ExpandLess, ExpandMore } from '@mui/icons-material';
import Skeleton from '@carrier-io/fds-react/Skeleton';
import TreeItem from '@carrier-io/fds-react/TreeItem';
import TreeView from '@carrier-io/fds-react/TreeView';
import Typography from '@carrier-io/fds-react/Typography';
import { Tenant } from '@carrier-io/lynx-fleet-types';

import { useDialogueTitle } from '../../hooks/useDialogueTitle';
import { fetchCompanies, selectActiveCompanyIds, selectAllCompanies, companiesSlice } from '../../stores';

import { DrawerHeader } from './DrawerHeader';

import { useAppDispatch, useAppSelector } from '@/stores';

export const CompanyDialog: FC = () => {
  const dispatch = useAppDispatch();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [roots, setRoots] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [tenantMap, setMap] = useState(new Map());
  const [searchText, setSearchText] = useState<string>('');
  const updateDrawerState = useCallback((): void => {
    setOpenDrawer((prevValue) => !prevValue);
  }, []);
  const isLoading = useAppSelector((state) => state.companies.pending);
  const allCompanies = useAppSelector(selectAllCompanies);
  const selectedIds = useAppSelector(selectActiveCompanyIds);
  const title = useDialogueTitle();

  const findParents = (parents: Tenant[], node?: Tenant) => {
    if (!node) {
      return;
    }
    parents.push(node);
    if (node.parentId) {
      findParents(
        parents,
        allCompanies.find((x) => x.id === node.parentId)
      );
    }
  };

  useEffect(() => {
    const tempRoot: string[] = [];
    const tempMap = new Map();

    let filteredTenants = allCompanies;
    const filteredSet = new Set();
    if (searchText) {
      allCompanies.forEach((x: Tenant) => {
        if (x.name && x.name.toLowerCase().includes(searchText.toLowerCase())) {
          filteredSet.add(x);
          const parents: Tenant[] = [];
          findParents(parents, x);
          parents.forEach((p) => filteredSet.add(p));
        }
      });
      filteredTenants = Array.from(filteredSet) as Tenant[];
    }
    filteredTenants.forEach((tenant) => {
      if (!tenant.parentId) {
        tempRoot.push(tenant.id);
      }
      tempMap.set(tenant.id, {
        id: tenant.id,
        name: tenant.name,
        children: [],
      });
    });

    filteredTenants.forEach((tenant) => {
      if (tenant.parentId && tempMap.has(tenant.parentId)) {
        tempMap.get(tenant.parentId).children.push(tenant.id);
      }
    });

    setRoots(tempRoot);
    setMap(tempMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCompanies, searchText]);

  useEffect(() => {
    if (openDrawer) {
      dispatch(fetchCompanies());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDrawer]);

  const handleCompanySelect = (_event: SyntheticEvent<Element, Event>, nodeIds: string[]) => {
    dispatch(companiesSlice.actions.setSelectedCompanyIds(nodeIds));
  };

  const handleCompanyToggle = (_event: SyntheticEvent<Element, Event>, nodeIds: string[]) => {
    dispatch(companiesSlice.actions.setSelectedCompanyIds([...selectedIds, ...nodeIds]));
    setExpandedIds(nodeIds);
  };

  const renderTree = (rootId?: string) => {
    if (!rootId) {
      return null;
    }
    const node = tenantMap.get(rootId);

    return (
      <TreeItem key={rootId} nodeId={rootId} label={node.name}>
        {node.children && Array.isArray(node.children) && node.children.length
          ? node.children.map((id: string) => renderTree(id))
          : null}
      </TreeItem>
    );
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchText = event.target.value || '';

    setSearchText(newSearchText);
  };

  const handleClose = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      <Button onClick={updateDrawerState} variant="text" color="secondary">
        <Typography variant="subtitle2">{title}</Typography>
        <MenuOpen />
      </Button>
      <Drawer
        anchor="right"
        open={openDrawer}
        onBackdropClick={updateDrawerState}
        PaperProps={{
          sx: { width: 375, padding: '20px' },
        }}
      >
        {isLoading ? (
          <>
            <Skeleton animation="pulse" width={300} height={30} />
            <Skeleton animation="pulse" width={300} height={30} />
            <Skeleton animation="pulse" width={300} height={30} />
            <Skeleton animation="pulse" width={300} height={30} />
          </>
        ) : (
          <Grid container direction="column" rowSpacing={2}>
            <Grid item>
              <DrawerHeader searchText={searchText} onSearch={handleSearch} onClose={handleClose} />
            </Grid>
            <Grid item>
              <TreeView
                multiSelect
                onNodeToggle={handleCompanyToggle}
                onNodeSelect={handleCompanySelect}
                selected={selectedIds}
                expanded={expandedIds}
                defaultCollapseIcon={<ExpandLess />}
                defaultExpandIcon={<ExpandMore />}
              >
                {roots.map((rootId) => renderTree(rootId))}
              </TreeView>
            </Grid>
          </Grid>
        )}
      </Drawer>
    </>
  );
};
