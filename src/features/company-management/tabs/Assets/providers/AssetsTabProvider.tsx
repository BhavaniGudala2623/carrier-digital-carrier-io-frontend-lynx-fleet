import { useContext, useMemo, useState, createContext } from 'react';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { Maybe, AssetRow } from '@carrier-io/lynx-fleet-types';

import { AssetTableView, RowSelected } from '../../common/types';
import { isAssetPopulatedRow } from '../../../utils';

import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';

export interface Permissions {
  editAssetAllowed: boolean;
  editFleetAllowed: boolean;
  deleteAssetAllowed: boolean;
  deleteFleetAllowed: boolean;
}

type AssetsTabContext = {
  selectedRows: RowSelected[];
  selectedAssets: RowSelected[];
  selectedAssetsIds: AssetRow['id'][];
  selectedRowIds: AssetRow['id'][];
  setSelectedRows: (newAssets: RowSelected[]) => void;
  tableView: AssetTableView;
  setTableView: (newView: AssetTableView) => void;
  permissions: Permissions;
};

const AssetsTabContextValue = createContext<Maybe<AssetsTabContext>>(null);

export const useAssetsTab = () => {
  const context = useContext(AssetsTabContextValue);

  if (!context) {
    throw Error('No provider found for AssetsTabContext');
  }

  return context;
};

export const AssetsTabProvider = ({ children }: { children: JSX.Element }) => {
  const [selectedRows, setSelectedRows] = useState<RowSelected[]>([]);

  const [tableView, setTableView] = useState<AssetTableView>('Assets');
  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);

  const permissions = useMemo(
    () => ({
      editAssetAllowed: hasPermission(companyActionPayload('asset.edit', tenantId)),
      editFleetAllowed: hasPermission(companyActionPayload('fleet.edit', tenantId)),
      deleteAssetAllowed: hasPermission(companyActionPayload('fleet.edit', tenantId)),
      deleteFleetAllowed: hasPermission(companyActionPayload('fleet.delete', tenantId)),
    }),
    [hasPermission, tenantId]
  );

  const selectedRowIds = useMemo(() => selectedRows.map((asset) => asset.id), [selectedRows]);
  const selectedAssets = useMemo(
    () => selectedRows.filter((row) => isAssetPopulatedRow(row)),
    [selectedRows]
  );
  const selectedAssetsIds = useMemo(() => selectedAssets.map(({ id }) => id), [selectedAssets]);

  const contextValue = useMemo(
    () => ({
      selectedRows,
      selectedAssetsIds,
      setSelectedRows,
      selectedAssets,
      selectedRowIds,
      tableView,
      setTableView,
      permissions,
    }),
    [selectedAssets, selectedRows, selectedAssetsIds, selectedRowIds, tableView, permissions]
  );

  return <AssetsTabContextValue.Provider value={contextValue}>{children}</AssetsTabContextValue.Provider>;
};
