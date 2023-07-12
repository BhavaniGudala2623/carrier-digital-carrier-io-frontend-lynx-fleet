import { useEffect, useMemo, useRef, useState } from 'react';
import { AssetGql, Maybe, QuickDate, HistoryFrequency, EventHistoryRec } from '@carrier-io/lynx-fleet-types';
import Paper from '@carrier-io/fds-react/Paper';

import { flattenChartConfig } from '../../../utils';
import { getAssetHistoryState } from '../../../stores';
import { CreateReportDialogContainer } from '../containers/CreateReportDialogContainer';
import { ReportFormData } from '../types';
import { SYSTEM_DEFAULT_VIEW_INDEX } from '../../../components/AssetHistoryViews';
import { useAssetHistoryPageContext } from '../../../providers';

import { EventHistoryTable } from './EventHistoryTable';

import { useAppSelector } from '@/stores';
import { ChartConfig } from '@/types';
import { FlatChartConfig, useApplicationContext } from '@/providers/ApplicationContext';
import { MS_48_HR } from '@/constants';

interface AssetHistoryChartTabProps {
  assetHistoryLoaded?: boolean;
  selectedAsset?: Maybe<AssetGql>;
  history?: Maybe<EventHistoryRec[]>;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  quickDate: Maybe<QuickDate>;
  reportDialogOpen: boolean;
  setReportDialogOpen: (open: boolean) => void;
  selectedView: Maybe<number | string>;
  columnsToDisplay: string[];
  flatChartConfig: ChartConfig | {};
  setFlatChartConfig: (chartConfig: FlatChartConfig | {}) => void;
  setColumnsToDisplay: (columns: string[]) => void;
  isAT52Device: boolean;
  frequency: HistoryFrequency;
  onFrequencyChange: (value: HistoryFrequency) => void;
  setSelectedView: (view: Maybe<number | string>) => void;
}

export const AssetHistoryChartTab = (props: AssetHistoryChartTabProps) => {
  const {
    assetHistoryLoaded,
    selectedAsset,
    history,
    startDate,
    endDate,
    reportDialogOpen,
    setReportDialogOpen,
    selectedView,
    flatChartConfig,
    columnsToDisplay,
    setFlatChartConfig,
    setColumnsToDisplay,
    quickDate,
    isAT52Device,
    frequency,
    onFrequencyChange,
    setSelectedView,
  } = props;
  const { availableColumns, chartConfig, tenant, fleets, device, flespiData, assetViewsLoaded } =
    useAppSelector(getAssetHistoryState);
  const { assetDetails } = useAssetHistoryPageContext();

  const applicationContext = useApplicationContext();
  const applicationProps = useMemo(
    () => ({
      legendSettings: applicationContext.applicationState.legendSettings,
      assetReportManagement: applicationContext.applicationState.assetReportManagement,
      setAssetReportManagement: applicationContext.setAssetReportManagement,
      assetHistoryChartSelectedView: applicationContext.applicationState.assetHistoryChartSelectedView,
    }),
    [applicationContext]
  );

  const time = endDate && startDate ? endDate.getTime() - startDate.getTime() : 0;
  const frequencyButtonDisabled = time > MS_48_HR;

  const [dialogData, setDialogData] = useState<ReportFormData>({
    assetId: selectedAsset?.id || '',
    assetName: selectedAsset?.name || '-',
    tenantName: tenant?.name || '-',
    tenantId: tenant?.id || '',
    fleetNames: fleets?.map((f) => f.name) || [],
    licensePlate: selectedAsset?.licensePlateNumber || '-',
    truSerial: flespiData?.freezer_serial_number || '-',
    truSystemType: flespiData?.freezer_control_mode || '-',
    startDate,
    endDate,
    flespiId: device?.flespiId,
    quickDate,
    frequency,
  });
  useEffect(() => {
    setFlatChartConfig(flattenChartConfig(chartConfig));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartConfig]);

  const columnsToDisplayRef = useRef(columnsToDisplay);

  useEffect(() => {
    columnsToDisplayRef.current = columnsToDisplay;
  }, [columnsToDisplay]);

  // todo: refactor this logic
  useEffect(() => {
    // selectedView === null means the view has been deselected
    if (selectedView === null && !columnsToDisplayRef.current) {
      setColumnsToDisplay(availableColumns as string[]);
    }

    if (selectedView && assetViewsLoaded) {
      // applicationProps.assetHistoryChartSelectedView === null means the default view is the current selection
      if (
        selectedView === SYSTEM_DEFAULT_VIEW_INDEX ||
        !applicationProps.assetHistoryChartSelectedView?.legendSettings
      ) {
        setColumnsToDisplay(availableColumns || []);
      } else if (applicationProps.assetHistoryChartSelectedView?.legendSettings && availableColumns) {
        console.log(
          'final list',
          JSON.stringify([
            ...availableColumns.filter((column) =>
              applicationProps.assetHistoryChartSelectedView?.legendSettings?.includes(column)
            ),
          ])
        );
        setColumnsToDisplay([
          ...availableColumns.filter((column) =>
            applicationProps.assetHistoryChartSelectedView?.legendSettings?.includes(column)
          ),
        ]);
      }
    }
  }, [
    selectedView,
    setColumnsToDisplay,
    applicationProps.assetHistoryChartSelectedView,
    availableColumns,
    assetViewsLoaded,
  ]);

  useEffect(() => {
    if (tenant && selectedAsset && reportDialogOpen) {
      setDialogData((priorData) => ({
        ...priorData,
        assetId: selectedAsset.id || '',
        assetName: selectedAsset.name || '-',
        licensePlate: selectedAsset.licensePlateNumber || '-',
        tenantName: tenant.name || '-',
        tenantId: tenant.id,
        fleetNames: fleets?.map((f) => f.name) || [],
        truSerial: assetDetails?.truSerialNumber ?? '-',
        truSystemType: flespiData?.freezer_control_mode || '-',
        startDate,
        endDate,
        flespiId: device?.flespiId,
        quickDate,
        frequency,
      }));
    }
  }, [
    reportDialogOpen,
    device?.flespiId,
    endDate,
    fleets,
    flespiData?.freezer_control_mode,
    flespiData?.freezer_serial_number,
    quickDate,
    selectedAsset,
    startDate,
    tenant,
    frequency,
    assetDetails,
  ]);

  return (
    <>
      <Paper square elevation={0}>
        <EventHistoryTable
          setSelectedFrequency={onFrequencyChange}
          selectedFrequency={frequency}
          assetId={device?.flespiId}
          history={history}
          chartConfig={chartConfig}
          flatChartConfig={flatChartConfig}
          listLoading={!assetHistoryLoaded}
          legendSettings={applicationProps?.legendSettings}
          isAT52Device={isAT52Device}
          frequencyButtonDisabled={frequencyButtonDisabled}
          setSelectedView={setSelectedView}
        />
      </Paper>
      {reportDialogOpen && (
        <CreateReportDialogContainer
          reportDialogOpen
          setReportDialogOpen={setReportDialogOpen}
          setAssetReportManagement={applicationProps.setAssetReportManagement}
          assetReportManagement={applicationProps.assetReportManagement}
          dialogData={dialogData}
        />
      )}
    </>
  );
};
