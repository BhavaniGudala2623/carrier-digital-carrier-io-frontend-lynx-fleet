import { useState } from 'react';
import { DeviceFilter } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';

import { DeviceProvisioningTable } from './DeviceProvisioningTable';

import { Loader } from '@/components';

interface DeviceProvisioningTableContainerProps {
  filter: DeviceFilter;
}

export const DeviceProvisioningTableContainer = ({ filter }: DeviceProvisioningTableContainerProps) => {
  const [rowLoading, setRowLoading] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);
  const [reLoading, setReLoading] = useState(false);

  return (
    <Box position="relative" flex={1}>
      <DeviceProvisioningTable
        filter={filter}
        setRowLoading={setRowLoading}
        setFirstLoading={setFirstLoading}
        setReLoading={setReLoading}
      />
      {firstLoading && (
        <div>
          <Loader overlay />
        </div>
      )}
      {rowLoading && !firstLoading && !reLoading && (
        <Box
          sx={{
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: '85px',
            width: '100%',
          }}
        >
          <Loader overlay size={30} />
        </Box>
      )}
    </Box>
  );
};
