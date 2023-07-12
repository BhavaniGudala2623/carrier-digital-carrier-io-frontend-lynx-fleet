import Box from '@carrier-io/fds-react/Box';
import { useEffect } from 'react';

import { useReplayMapEffects } from '../hooks';
import { useReplayMap } from '../providers';

import { Map } from '@/components';

export const AssetTimelineMapContainer = () => {
  const { handleClick } = useReplayMapEffects();
  const { map } = useReplayMap();
  useEffect(() => {
    if (map) {
      map.on('click', handleClick);

      return () => {
        map.off('click', handleClick);
      };
    }

    return undefined;
  }, [map, handleClick]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flex: 1,
      }}
    >
      <Map containerId="replayMap" />
    </Box>
  );
};
