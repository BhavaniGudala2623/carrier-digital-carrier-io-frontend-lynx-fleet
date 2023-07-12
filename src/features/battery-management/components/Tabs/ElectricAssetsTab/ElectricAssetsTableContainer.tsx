import Box from '@carrier-io/fds-react/Box';
import { useState } from 'react';

import { ElectricAssetsTable } from './ElectricAssetsTable';

import { Loader } from '@/components';

export const ElectricAssetsTableContainer: React.FunctionComponent = () => {
  const [rowLoading, setRowLoading] = useState<boolean>(true);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [reLoading, setReLoading] = useState<boolean>(false);

  return (
    <Box position="relative" flex={1} height="100%">
      <ElectricAssetsTable
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
