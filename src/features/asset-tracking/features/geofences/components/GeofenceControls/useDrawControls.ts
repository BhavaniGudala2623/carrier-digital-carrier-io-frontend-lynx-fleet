import { useCallback, useEffect, useState } from 'react';

import { useMap } from '../../../map';

type DrawMode = 'draw_polygon' | 'draw_circle' | 'simple_select';

export const useDrawControls = () => {
  const { map, draw } = useMap();
  const [drawMode, setDrawMode] = useState<DrawMode | null>(null);

  const handleModeChange = useCallback(
    ({ mode }: { mode: DrawMode }) => {
      if (draw && mode === 'simple_select') {
        draw.deleteAll();
      }

      if (mode !== 'draw_polygon' && mode !== 'draw_circle') {
        setDrawMode(null);
      }
    },
    [draw]
  );

  useEffect(() => {
    if (map) {
      map.on('draw.modechange', handleModeChange);

      return () => {
        map.off('draw.modechange', handleModeChange);
      };
    }

    return undefined;
  }, [handleModeChange, map]);

  const handleDrawModeChange = useCallback(
    (newMode: DrawMode | null) => {
      if (draw && newMode && drawMode !== newMode) {
        draw.changeMode(newMode as 'simple_select');
        setDrawMode(newMode);
      }
    },
    [draw, drawMode]
  );

  return { drawMode, handleDrawModeChange };
};
