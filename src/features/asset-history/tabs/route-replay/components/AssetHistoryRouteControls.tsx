import Box from '@carrier-io/fds-react/Box';
import { HistoryFrequency, Maybe } from '@carrier-io/lynx-fleet-types';

import { DateRangeFilter } from '../../../components';
import { useDateRange, useDateRangeFilter } from '../../../hooks';
import { useReplayTabDataContext } from '../providers';
import { useExportAssetTimeline } from '../hooks/useExportAssetTimeline';

import { ExportButton } from '@/components';

interface AssetHistoryRouteControlsProps {
  onSelectedViewChange: (view: Maybe<number | string>) => void;
  onFrequencyChange: (value: HistoryFrequency) => void;
}

export const AssetHistoryRouteControls = ({
  onSelectedViewChange,
  onFrequencyChange,
}: AssetHistoryRouteControlsProps) => {
  const {
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    quickDate,
    onQuickDateChange,
    routeHistoryLoaded,
    gridApi,
  } = useReplayTabDataContext();

  const { handleChangeQuickDate, handleStartDateChange, handleEndDateChange } = useDateRangeFilter({
    startDate,
    endDate,
    onEndDateChange,
    onQuickDateChange,
    onSelectedViewChange,
    onStartDateChange,
    onFrequencyChange,
  });

  const { minDate, maxDate } = useDateRange(startDate);
  const { exportCsv, exportExcel } = useExportAssetTimeline();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        minHeight: '70px',
        borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      <Box
        display="flex"
        flexWrap="nowrap"
        justifyContent="space-between"
        alignItems="center"
        py={1}
        data-testid="routeHistoryDateFilter"
      >
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          quickDate={quickDate}
          minDate={minDate}
          maxDate={maxDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onQuickDateChange={handleChangeQuickDate}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Box>
          <ExportButton
            disabled={!routeHistoryLoaded || !gridApi}
            onExportCsv={exportCsv}
            onExportExcel={exportExcel}
          />
        </Box>
      </Box>
    </Box>
  );
};
