import { BluetoothSensorFilter, DeviceFilter, DeviceFilterField } from '@carrier-io/lynx-fleet-types';
import { useCallback, useMemo, useState } from 'react';

import { useTabsState } from '../providers';

import { DeviceManagementPageHeader } from './DeviceManagementPageHeader';
import { DeviceManagementPageTablesContainer } from './DeviceManagementPageTablesContainer';
import { DeviceProvisioningControls } from './DeviceProvisioningControls';
import { DeviceProvisioningTableContainer } from './DeviceProvisioningTable/DeviceProvisioningTableContainer';

import { TableBox, TableBoxHeader } from '@/components/TableBox';
import { useDebouncedState } from '@/hooks';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface Filter {
  field: string;
  value: string;
}

const deviceFilter: DeviceFilter = {
  field: 'imei',
  value: '',
};

const bluetoothSensorFilter: BluetoothSensorFilter = {
  field: 'macId',
  value: '',
};

function useFilterState<T extends Filter>(filter: T) {
  const [queryParams, setQueryParams] = useState(filter);

  const debouncedSearchText = useDebouncedState<string>(queryParams.value, 1000);

  const debouncedFilter: T = useMemo(
    () => ({
      ...queryParams,
      value: debouncedSearchText,
    }),
    [debouncedSearchText, queryParams]
  );

  const onFilterFieldChange = useCallback(
    (field: DeviceFilterField) => {
      setQueryParams({
        ...queryParams,
        field,
      });
    },
    [queryParams]
  );

  const onFilterValueChange = useCallback(
    (value: string) => {
      setQueryParams({
        ...queryParams,
        value,
      });
    },
    [queryParams]
  );

  return { debouncedFilter, onFilterFieldChange, onFilterValueChange, queryParams };
}

export function DeviceManagement() {
  const { featureFlags } = useApplicationContext();
  const { selectedTabId } = useTabsState();

  const {
    debouncedFilter: deviceDebouncedFilter,
    onFilterFieldChange: deviceOnFilterFieldChange,
    onFilterValueChange: deviceOnFilterValueChange,
    queryParams: deviceQueryParams,
  } = useFilterState(deviceFilter);
  const {
    debouncedFilter: bluetoothdebouncedFilter,
    onFilterFieldChange: bluetoothoonFilterFieldChange,
    onFilterValueChange: bluetoothonFilterValueChange,
    queryParams: bluetoothQueryParams,
  } = useFilterState(bluetoothSensorFilter);

  return (
    <TableBox>
      <TableBoxHeader>
        <DeviceProvisioningControls
          onFilterFieldChange={
            selectedTabId === 'DEVICES' ? deviceOnFilterFieldChange : bluetoothoonFilterFieldChange
          }
          onFilterValueChange={
            selectedTabId === 'DEVICES' ? deviceOnFilterValueChange : bluetoothonFilterValueChange
          }
          searchField={selectedTabId === 'DEVICES' ? deviceQueryParams.field : bluetoothQueryParams.field}
        />
      </TableBoxHeader>
      {featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT ? (
        <>
          <DeviceManagementPageHeader />
          <DeviceManagementPageTablesContainer
            deviceFilter={deviceDebouncedFilter}
            bluetoothFilter={bluetoothdebouncedFilter}
          />
        </>
      ) : (
        <DeviceProvisioningTableContainer filter={deviceDebouncedFilter} />
      )}
    </TableBox>
  );
}
