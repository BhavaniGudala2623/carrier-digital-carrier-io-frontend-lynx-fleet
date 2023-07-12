import { AssetRow } from '@carrier-io/lynx-fleet-types';

import { AssetsTable } from '../components';
import { useAssetsTab } from '../providers';

interface IProps {
  loading: boolean;
  rowData: AssetRow[];
}

export const AssetsTableContainer = ({ loading, rowData }: IProps) => {
  const { selectedRowIds, setSelectedRows, permissions } = useAssetsTab();

  const assetPermissions = {
    editAssetAllowed: permissions.editAssetAllowed,
    deleteAssetAllowed: permissions.deleteAssetAllowed,
  };

  return (
    <AssetsTable
      rowData={rowData}
      loading={loading}
      selectedIds={selectedRowIds}
      onSelectedIdsChange={setSelectedRows}
      permissions={assetPermissions}
    />
  );
};
