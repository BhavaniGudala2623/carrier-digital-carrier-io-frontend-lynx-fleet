import Box from '@carrier-io/fds-react/Box';
import { Maybe, Sorting, QuickDate, HistoryFrequency } from '@carrier-io/lynx-fleet-types';

import { useDateRangeFilter, useDateRange } from '../../../hooks';
import { DateRangeFilter } from '../../../components';
import { useExportAssetHistory } from '../hooks/useExportAssetHistory';

import { ExportButton } from '@/components';
import { getAuthTenantId } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { HasPermission } from '@/features/authorization';

interface AssetHistoryTableControlsProps {
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  quickDate: Maybe<QuickDate>;
  exportAssetHistoryAvailable: boolean;
  assetId: string;
  assetHistorySort?: Maybe<Sorting>;
  onStartDateChange: (date: Maybe<Date>) => void;
  onEndDateChange: (date: Maybe<Date>) => void;
  onQuickDateChange: (date: Maybe<QuickDate>) => void;
  onSelectedViewChange: (view: Maybe<number | string>) => void;
  onFrequencyChange: (value: HistoryFrequency) => void;
}

export const AssetHistoryTableControls = ({
  startDate,
  endDate,
  quickDate,
  assetId,
  assetHistorySort,
  onStartDateChange,
  onEndDateChange,
  onQuickDateChange,
  onSelectedViewChange,
  exportAssetHistoryAvailable,
  onFrequencyChange,
}: AssetHistoryTableControlsProps) => {
  const tenantId = useAppSelector(getAuthTenantId);

  const { exportCsv, exportExcel, isExportLoading } = useExportAssetHistory({
    assetId,
    startDate,
    endDate,
    assetHistorySort,
  });

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

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap" width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap">
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
      <HasPermission action="dashboard.assetHistoryExport" subjectType="COMPANY" subjectId={tenantId}>
        <ExportButton
          disabled={isExportLoading || !exportAssetHistoryAvailable}
          loading={isExportLoading}
          onExportCsv={exportCsv}
          onExportExcel={exportExcel}
        />
      </HasPermission>
    </Box>
  );
};
