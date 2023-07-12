import { useState, useEffect, useMemo } from 'react';
import { HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import Divider from '@carrier-io/fds-react/Divider';
import { utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';

import { assetHistorySlice, getAssetHistoryState } from '../../../stores';
import { isAT52Device } from '../../../utils';
import { useTabPanelsContext } from '../../../providers';
import { useEventHistory } from '../hooks';

import { AssetHistoryChartTab } from './AssetHistoryChartTab';
import { AssetHistoryChartControls } from './AssetHistoryChartControls';
import { AssetHistoryChartContent } from './AssetHistoryChartContent';

import { HasPermission } from '@/features/authorization';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getAuthUserEmail } from '@/features/authentication';
import { FlatChartConfig, useApplicationContext } from '@/providers/ApplicationContext';
import { MS_48_HR } from '@/constants';
import { useUserSettings } from '@/providers/UserSettings';
import { showMessage } from '@/stores/actions';
import { AssetHistoryTabs } from '@/features/asset-history/types';
import { getDateRangeEndDate, getDateRangeStartDateByEndDate } from '@/utils';

interface IAssetHistoryTempTabProps {
  assetId: string;
  reportDialogOpen: boolean;
  setReportDialogOpen: (open: boolean) => void;
  selectedView: Maybe<number | string>;
  quickDate: Maybe<QuickDate>;
  setSelectedView: (view: Maybe<number | string>) => void;
  onQuickDateChange: (date: Maybe<QuickDate>) => void;
  frequency: HistoryFrequency;
  onFrequencyChange: (value: HistoryFrequency) => void;
}

export const AssetHistoryTempTab = (props: IAssetHistoryTempTabProps) => {
  const {
    assetId,
    reportDialogOpen,
    quickDate,
    setReportDialogOpen,
    selectedView,
    onQuickDateChange,
    setSelectedView,
    frequency,
    onFrequencyChange,
  } = props;

  const authUserEmail = useAppSelector(getAuthUserEmail);
  const { userSettings } = useUserSettings();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { selectedTab } = useTabPanelsContext();

  // currently selected start and end dates
  const initialEndDate = useMemo(
    () => utcToZonedTime(getDateRangeEndDate(new Date()), userSettings.timezone),
    [userSettings.timezone]
  );

  const [startDate, setStartDate] = useState<Maybe<Date>>(null);
  const [endDate, setEndDate] = useState<Maybe<Date>>(null);

  // start and end date, and quick time used by the 'Zoom Out' button; set when a user zooms on the graph
  const [zoomOutStartDate, setZoomOutStartDate] = useState<Maybe<Date>>(null);
  const [zoomOutEndDate, setZoomOutEndDate] = useState<Maybe<Date>>(null);
  const [zoomOutQuickDate, setZoomOutQuickDate] = useState<Maybe<QuickDate>>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);

  useEffect(() => {
    setStartDate(getDateRangeStartDateByEndDate(initialEndDate, 1));
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  const handleTimeIntervalChange = (start: Maybe<Date>, end: Maybe<Date>) => {
    const time = end && start ? end.getTime() - start.getTime() : 0;

    if (time > MS_48_HR && (frequency === '1m' || frequency === '5m')) {
      onFrequencyChange('1h');
    }
  };

  const handleStartDateChange = (value: Maybe<Date>) => {
    setStartDate(value);
    handleTimeIntervalChange(value, endDate);
  };

  const handleEndDateChange = (value: Maybe<Date>) => {
    setEndDate(value);
    handleTimeIntervalChange(startDate, value);
  };

  const {
    history,
    tenant,
    fleets,
    device,
    flespiData,
    chartConfig,
    asset,
    eventHistoryLoaded,
    assetViewsLoaded,
    emptyDataMessageShown,
  } = useAppSelector(getAssetHistoryState);

  const [flatChartConfig, setFlatChartConfig] = useState<FlatChartConfig>({});
  const [columnsToDisplay, setColumnsToDisplay] = useState<string[]>([]);

  const applicationContext = useApplicationContext();
  const applicationProps = useMemo(
    () => ({
      selectedView: applicationContext.applicationState.assetHistoryChartSelectedView,
      setAssetReportManagement: applicationContext.setAssetReportManagement,
    }),
    [
      applicationContext.applicationState.assetHistoryChartSelectedView,
      applicationContext.setAssetReportManagement,
    ]
  );

  const { filteredHistory, filteredTimelineEvents } = useEventHistory({
    assetId,
    startDate,
    onSetStartDate: handleStartDateChange,
    endDate,
    onSetEndDate: handleEndDateChange,
    onQuickDateChange,
    onSetZoomOutEndDate: setZoomOutEndDate,
    onSetZoomOutQuickDate: setZoomOutQuickDate,
    onSetZoomOutStartDate: setZoomOutStartDate,
    zoomOutEndDate,
    zoomOutQuickDate,
    zoomOutStartDate,
    frequency,
  });

  // Data needed for asset history report
  useEffect(() => {
    applicationProps.setAssetReportManagement({
      asset,
      chartConfig,
      flatChartConfig,
      fleets,
      tenant,
      flespiId: device?.flespiId,
      flespiData,
      userEmail: authUserEmail,
      startDate,
      endDate,
      quickDate,
      historyFrequency: frequency,
    });
  }, [
    history,
    asset,
    fleets,
    tenant,
    device,
    flespiData,
    authUserEmail,
    chartConfig,
    flatChartConfig,
    applicationProps,
    startDate,
    endDate,
    quickDate,
    frequency,
  ]);

  useEffect(() => {
    if (
      !isFirstLaunch &&
      selectedTab === AssetHistoryTabs.TemperatureGraphTabView &&
      !emptyDataMessageShown &&
      eventHistoryLoaded &&
      history?.length === 0
    ) {
      showMessage(dispatch, `${t('common.temperature')}: ${t('assethistory.asset-has-no-data')}`);
      dispatch(assetHistorySlice.actions.setEmptyDataMessageShown(true));
    }

    if (isFirstLaunch) {
      setIsFirstLaunch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, emptyDataMessageShown, history, t, eventHistoryLoaded, isFirstLaunch]);

  return (
    <Paper square sx={{ width: '100%', minHeight: '100%' }}>
      <AssetHistoryChartControls
        startDate={startDate}
        onStartDateChange={handleStartDateChange}
        endDate={endDate}
        onEndDateChange={handleEndDateChange}
        quickDate={quickDate}
        onQuickDateChange={onQuickDateChange}
        selectedView={selectedView}
        onSelectedViewChange={setSelectedView}
        assetViewsLoaded={assetViewsLoaded}
        zoomOutStartDate={zoomOutStartDate}
        onZoomOutStartDateChange={setZoomOutStartDate}
        zoomOutEndDate={zoomOutEndDate}
        onZoomOutEndDateChange={setZoomOutEndDate}
        zoomOutQuickDate={zoomOutQuickDate}
        zoomEnabled
        onFrequencyChange={onFrequencyChange}
      />
      <Box p={2}>
        <AssetHistoryChartContent
          startDate={startDate}
          endDate={endDate}
          quickDate={quickDate}
          setStartDate={handleStartDateChange}
          setEndDate={handleEndDateChange}
          setQuickDate={onQuickDateChange}
          setSelectedView={setSelectedView}
          zoomOutStartDate={zoomOutStartDate}
          zoomOutEndDate={zoomOutEndDate}
          setZoomOutStartDate={setZoomOutStartDate}
          setZoomOutEndDate={setZoomOutEndDate}
          setZoomOutQuickDate={setZoomOutQuickDate}
          flatChartConfig={flatChartConfig}
          columnsToDisplay={columnsToDisplay}
          assetHistoryLoaded={eventHistoryLoaded}
          timelineEvents={filteredTimelineEvents}
        />
      </Box>
      <Divider light hidden={!eventHistoryLoaded} />
      <HasPermission action="dashboard.eventHistoryList" subjectType="COMPANY" subjectId={tenant?.id ?? ''}>
        <AssetHistoryChartTab
          assetHistoryLoaded={eventHistoryLoaded}
          selectedAsset={asset}
          history={filteredHistory}
          startDate={startDate}
          endDate={endDate}
          reportDialogOpen={reportDialogOpen}
          setReportDialogOpen={setReportDialogOpen}
          selectedView={selectedView}
          flatChartConfig={flatChartConfig}
          columnsToDisplay={columnsToDisplay}
          setFlatChartConfig={setFlatChartConfig}
          setColumnsToDisplay={setColumnsToDisplay}
          quickDate={quickDate}
          isAT52Device={isAT52Device(flespiData?.freezer_control_mode)}
          frequency={frequency}
          onFrequencyChange={onFrequencyChange}
          setSelectedView={setSelectedView}
        />
      </HasPermission>
    </Paper>
  );
};
