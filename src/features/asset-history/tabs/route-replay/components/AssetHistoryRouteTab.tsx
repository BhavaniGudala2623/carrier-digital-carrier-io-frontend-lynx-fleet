import { memo } from 'react';
import Paper from '@carrier-io/fds-react/Paper';
import { HistoryFrequency, Maybe } from '@carrier-io/lynx-fleet-types';

import { ReplayTabDataProvider, ReplayMapProvider, ColumnPopupProvider } from '../providers';

import { AssetHistoryRouteControls } from './AssetHistoryRouteControls';
import { AssetHistoryRouteContent } from './AssetHistoryRouteContent';

interface AssetRouteTabProps {
  onSelectedViewChange: (view: Maybe<number | string>) => void;
  onFrequencyChange: (value: HistoryFrequency) => void;
}

export const AssetHistoryRouteTab = memo((props: AssetRouteTabProps) => {
  const { onSelectedViewChange, onFrequencyChange } = props;

  return (
    <ReplayTabDataProvider>
      <ReplayMapProvider>
        <ColumnPopupProvider>
          <Paper square sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <AssetHistoryRouteControls
              onSelectedViewChange={onSelectedViewChange}
              onFrequencyChange={onFrequencyChange}
            />
            <AssetHistoryRouteContent />
          </Paper>
        </ColumnPopupProvider>
      </ReplayMapProvider>
    </ReplayTabDataProvider>
  );
});
