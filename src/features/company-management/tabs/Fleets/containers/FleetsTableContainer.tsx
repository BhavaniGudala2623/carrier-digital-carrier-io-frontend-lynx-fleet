import { useMemo } from 'react';
import { AssetRow } from '@carrier-io/lynx-fleet-types';

import { FleetsTable } from '../components/FleetsTable';
import { useFleetsTab } from '../providers/FleetsTabProvider';
import { makeHierarchy } from '../../common/utils/hierarchy';

import { FleetRow } from '@/types';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface IProps {
  loading: boolean;
  rowData: AssetRow[];
  rowFleets: FleetRow[];
}

export const FleetsTableContainer = ({ loading, rowData, rowFleets }: IProps) => {
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();
  const { selectedRowIds, setSelectedRows, permissions } = useFleetsTab();

  const selectedFleetId = useMemo(
    () => (selectedCompanyHierarchy.type === 'FLEET' ? selectedCompanyHierarchy.id : null),
    [selectedCompanyHierarchy.type, selectedCompanyHierarchy.id]
  );
  const hierarchicalData = useMemo(
    () => makeHierarchy(rowData, rowFleets, selectedFleetId),
    [rowData, rowFleets, selectedFleetId]
  );

  return (
    <FleetsTable
      rowData={hierarchicalData}
      loading={loading}
      selectedIds={selectedRowIds}
      onSelectedIdsChange={setSelectedRows}
      permissions={permissions}
    />
  );
};
