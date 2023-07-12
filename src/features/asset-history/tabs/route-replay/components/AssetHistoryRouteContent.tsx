import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import ResizeObserver from 'rc-resize-observer';
import { Resizable } from 're-resizable';

import { AssetTimelineMapContainer } from '../containers';
import { useColumnPopupContext, useReplayMap } from '../providers';

import { AssetTimelineTable } from './AssetTimelineTable';
import { Search } from './Search';

export const AssetHistoryRouteContent = () => {
  const { map } = useReplayMap();
  const { viewPortColumnsWidth } = useColumnPopupContext();
  const [widthChangedTime, setWidthChangedTime] = useState<number | null>(null);
  const [isResized, setIsResized] = useState<boolean>(false);
  const resizableRef = useRef<Resizable>(null);

  const resizeMap = useCallback(() => {
    map?.resize();
  }, [map]);

  const resizeViewPort = (value: number) => {
    resizableRef.current?.updateSize({ width: value, height: '100%' });
    setWidthChangedTime(new Date().getTime());
  };

  const handleResizeStart = () => {
    setIsResized(true);
  };

  useEffect(() => {
    if (widthChangedTime) {
      map?.resize();
    }
  }, [widthChangedTime, map]);

  return (
    <ResizeObserver onResize={resizeMap}>
      <Box
        sx={{
          width: '100%',
          height: 'calc(100% - 70px)',
          display: 'flex',
        }}
      >
        <Resizable
          ref={resizableRef}
          onResizeStart={handleResizeStart}
          onResize={resizeMap}
          enable={{ right: true }}
          defaultSize={{ width: viewPortColumnsWidth, height: '100%' }}
        >
          <Search />
          <AssetTimelineTable onChange={resizeViewPort} isResized={isResized} />
        </Resizable>
        <AssetTimelineMapContainer />
      </Box>
    </ResizeObserver>
  );
};
