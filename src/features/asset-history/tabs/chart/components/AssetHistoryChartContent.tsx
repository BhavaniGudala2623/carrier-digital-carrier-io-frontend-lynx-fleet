import { createRef, useMemo } from 'react';
import { AssetTimelineEvent, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';

import { getAssetHistoryState } from '../../../stores';

import { EventHistoryEvents } from './EventHistoryEvents';
import { EventHistoryChart } from './EventHistoryChart';
import { AssetHistoryLegend } from './AssetHistoryLegend';

import { useAppSelector } from '@/stores';
import { FlatChartConfig, useApplicationContext } from '@/providers/ApplicationContext';
import { useUserSettings } from '@/providers/UserSettings';

interface IAssetHistoryChartCardProps {
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  quickDate: Maybe<QuickDate>;
  setStartDate: (x: Maybe<Date>) => void;
  setEndDate: (x: Maybe<Date>) => void;
  zoomOutStartDate: Maybe<Date>;
  setZoomOutStartDate: (x: Maybe<Date>) => void;
  zoomOutEndDate: Maybe<Date>;
  setZoomOutQuickDate: (x: Maybe<QuickDate>) => void;
  setZoomOutEndDate: (x: Maybe<Date>) => void;
  setQuickDate: (x: Maybe<QuickDate>) => void;
  assetHistoryLoaded?: boolean;
  setSelectedView: (view: Maybe<number | string>) => void;
  flatChartConfig: FlatChartConfig;
  columnsToDisplay?: string[];
  timelineEvents?: Maybe<Maybe<AssetTimelineEvent>[]>;
}

export const AssetHistoryChartContent = (props: IAssetHistoryChartCardProps) => {
  const {
    startDate,
    endDate,
    quickDate,
    setStartDate,
    setEndDate,
    setQuickDate,
    setSelectedView,
    zoomOutStartDate,
    zoomOutEndDate,
    setZoomOutStartDate,
    setZoomOutEndDate,
    setZoomOutQuickDate,
    flatChartConfig,
    columnsToDisplay,
    assetHistoryLoaded,
    timelineEvents,
  } = props;

  const { history, chartConfig } = useAppSelector(getAssetHistoryState);
  const eventsRef = createRef<HTMLDivElement>();
  const { userSettings } = useUserSettings();
  const { temperature, dateFormat } = userSettings;

  const applicationContext = useApplicationContext();

  const applicationProps = useMemo(
    () => ({
      legendSettings: applicationContext.applicationState.legendSettings,
      setLegendSettings: applicationContext.setLegendSettings,
      assetHistoryChartSelectedView: applicationContext.applicationState.assetHistoryChartSelectedView,
    }),
    [applicationContext]
  );

  return (
    <Box width="100%" display="flex" fontFamily={`Gibson, Helvetica, "sans-serif"`}>
      <Box width="100%" display="flex" flexDirection="column">
        <EventHistoryChart
          chartConfig={flatChartConfig}
          history={history}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          zoomOutStartDate={zoomOutStartDate}
          setZoomOutStartDate={setZoomOutStartDate}
          zoomOutEndDate={zoomOutEndDate}
          setZoomOutEndDate={setZoomOutEndDate}
          legendSettings={applicationProps?.legendSettings}
          temperatureSetting={temperature}
          dateFormat={dateFormat}
          assetHistoryLoaded={assetHistoryLoaded}
          quickDate={quickDate}
          setQuickDate={setQuickDate}
          setZoomOutQuickDate={setZoomOutQuickDate}
        />
        <EventHistoryEvents
          startDate={startDate}
          endDate={endDate}
          legendSettings={applicationProps?.legendSettings}
          timelineEvents={timelineEvents}
          eventsRef={eventsRef}
          chartConfig={chartConfig?.events?.children}
        />
      </Box>
      <div id="rechart-legend">
        <AssetHistoryLegend
          chartConfig={chartConfig}
          defaultColumnsToDisplay={columnsToDisplay}
          setLegendSettings={applicationProps?.setLegendSettings}
          setSelectedView={setSelectedView}
        />
      </div>
    </Box>
  );
};
