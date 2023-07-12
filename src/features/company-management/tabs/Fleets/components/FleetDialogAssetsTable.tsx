import { AssetRow } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';

import { makeNodeId } from '../../common/utils';

import { Table, Loader, TableProps } from '@/components';

type EditFleetAssetsTableProps = {
  assets?: AssetRow[];
  loading?: boolean;
} & TableProps;

export const FleetDialogAssetsTable = ({ assets, loading = false, ...rest }: EditFleetAssetsTableProps) => (
  <Box height={400} position="relative" display="flex" flexDirection="column">
    {loading && <Loader overlay />}
    <Table
      sortingOrder={['asc', 'desc']}
      rowData={assets}
      getRowId={makeNodeId}
      rowSelection="multiple"
      rowMultiSelectWithClick
      resizeColumnsToFit
      suppressRowClickSelection
      accentedSort
      {...rest}
    />
  </Box>
);
