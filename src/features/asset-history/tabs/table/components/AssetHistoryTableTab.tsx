import { useEffect, useMemo, useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import { Maybe, FlespiData, SortingParams, QuickDate, HistoryFrequency } from '@carrier-io/lynx-fleet-types';
import { utcToZonedTime } from 'date-fns-tz';

import { AssetHistoryTable } from './AssetHistoryTable';
import { AssetHistoryTableControls } from './AssetHistoryTableControls';

import { useUserSettings } from '@/providers/UserSettings';
import { getDateRangeEndDate, getDateRangeStartDateByEndDate } from '@/utils';

interface AssetHistoryTableTabProps {
  assetId: string;
  flespiData?: Maybe<Partial<FlespiData>>;
  onSelectedViewChange: (view: Maybe<number | string>) => void;
  onFrequencyChange: (value: HistoryFrequency) => void;
}

export const AssetHistoryTableTab = (props: AssetHistoryTableTabProps) => {
  const { assetId, onSelectedViewChange, flespiData, onFrequencyChange } = props;

  const [assetHistorySort] = useState<SortingParams['direction']>('DESC');
  const [exportAssetHistoryAvailable, setExportAssetHistoryAvailable] = useState(false);

  const [quickDate, setQuickDate] = useState<Maybe<QuickDate>>('24h');
  const {
    userSettings: { timezone },
  } = useUserSettings();

  const initialEndDate = useMemo(() => utcToZonedTime(getDateRangeEndDate(new Date()), timezone), [timezone]);
  // currently selected start and end dates
  const [startDate, setStartDate] = useState<Maybe<Date>>(null);
  const [endDate, setEndDate] = useState<Maybe<Date>>(null);

  useEffect(() => {
    setStartDate(getDateRangeStartDateByEndDate(initialEndDate, 1));
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Paper sx={{ height: '90%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            minHeight: '70px',
            borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
          }}
        >
          <AssetHistoryTableControls
            assetHistorySort={assetHistorySort}
            assetId={assetId}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            quickDate={quickDate}
            onQuickDateChange={setQuickDate}
            onSelectedViewChange={onSelectedViewChange}
            exportAssetHistoryAvailable={exportAssetHistoryAvailable}
            onFrequencyChange={onFrequencyChange}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {assetId && startDate && endDate && (
            <AssetHistoryTable
              assetId={assetId}
              startDate={startDate}
              endDate={endDate}
              onExportAvailable={setExportAssetHistoryAvailable}
              flespiData={flespiData}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};
