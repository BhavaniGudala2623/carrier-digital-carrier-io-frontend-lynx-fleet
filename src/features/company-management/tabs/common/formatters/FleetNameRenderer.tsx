import Box from '@carrier-io/fds-react/Box';
import type { ICellRendererParams } from '@ag-grid-community/core';
import { AssetRow } from '@carrier-io/lynx-fleet-types';

type FleetNameRendererProps = Omit<ICellRendererParams, 'data'> & {
  data: AssetRow;
};

export const FleetNameRenderer = (params: FleetNameRendererProps) => {
  const { data } = params;

  if (!data.fleets?.length) {
    return '';
  }

  return (
    <Box>
      {data.fleets?.map((fleet, index, arr) => {
        const isLast = index === arr.length - 1;

        return (
          <Box key={fleet.id} display="inline-block" mr={isLast ? 'none' : '0.5em'}>
            {`${fleet.name}${isLast ? '' : ','}`}
          </Box>
        );
      })}
    </Box>
  );
};
