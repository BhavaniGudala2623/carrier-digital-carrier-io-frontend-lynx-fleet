import Box from '@carrier-io/fds-react/Box';

import { ParamsProps } from '../types';

import { AssetStatusStopIcon, AssetStatusMovingIcon } from '@/components';

export const AssetStatusFormatter = ({ value }: ParamsProps) => {
  if (value === undefined) {
    return (
      <div className="ag-loading px-0">
        <span className="ag-loading-icon">
          <span className="ag-icon ag-icon-loading" />
        </span>
      </div>
    );
  }

  if (value === null) {
    return <span />;
  }
  if (value === 'NotMoving') {
    return (
      <Box display="flex" alignItems="center">
        <AssetStatusStopIcon />
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center">
      <AssetStatusMovingIcon />
    </Box>
  );
};
