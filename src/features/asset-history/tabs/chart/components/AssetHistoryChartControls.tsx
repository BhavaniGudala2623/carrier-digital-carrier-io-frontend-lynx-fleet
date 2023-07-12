import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import Zoom from '@carrier-io/fds-react/Zoom';

import { useDateRangeFilter, useDateRange } from '../../../hooks';
import { DateRangeFilter } from '../../../components';
import { SYSTEM_DEFAULT_VIEW_INDEX } from '../../../components/AssetHistoryViews';

import { useApplicationContext } from '@/providers/ApplicationContext';

interface IAssetHistoryChartControlsProps {
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  quickDate: Maybe<QuickDate>;
  zoomOutStartDate: Maybe<Date>;
  zoomOutEndDate: Maybe<Date>;
  zoomOutQuickDate: Maybe<QuickDate>;
  selectedView: Maybe<number | string>;
  assetViewsLoaded?: boolean;
  zoomEnabled: boolean;
  onStartDateChange: (date: Maybe<Date>) => void;
  onEndDateChange: (date: Maybe<Date>) => void;
  onQuickDateChange: (date: Maybe<QuickDate>) => void;
  onZoomOutStartDateChange: (date: Maybe<Date>) => void;
  onZoomOutEndDateChange: (date: Maybe<Date>) => void;
  onSelectedViewChange: (view: Maybe<number | string>) => void;
  onFrequencyChange: (value: HistoryFrequency) => void;
}

export const AssetHistoryChartControls = (props: IAssetHistoryChartControlsProps) => {
  const {
    startDate,
    endDate,
    quickDate,
    selectedView,
    assetViewsLoaded,
    zoomEnabled = true,
    zoomOutStartDate,
    zoomOutEndDate,
    zoomOutQuickDate,
    onStartDateChange,
    onEndDateChange,
    onQuickDateChange,
    onSelectedViewChange,
    onZoomOutStartDateChange,
    onZoomOutEndDateChange,
    onFrequencyChange,
  } = props;

  const { t } = useTranslation();

  const applicationContext = useApplicationContext();
  const applicationProps = useMemo(
    () => ({
      selectedView: applicationContext.applicationState?.assetHistoryChartSelectedView,
    }),
    [applicationContext]
  );

  const { minDate, maxDate } = useDateRange(startDate);

  const { handleChangeQuickDate, handleStartDateChange, handleEndDateChange } = useDateRangeFilter({
    startDate,
    endDate,
    onEndDateChange,
    onQuickDateChange,
    onSelectedViewChange,
    onStartDateChange,
    onFrequencyChange,
  });

  const handleZoomOut = () => {
    if (zoomOutStartDate && zoomOutEndDate) {
      onStartDateChange(zoomOutStartDate);
      onEndDateChange(zoomOutEndDate);
    }
    onQuickDateChange(zoomOutQuickDate);
    onZoomOutStartDateChange(null);
    onZoomOutEndDateChange(null);
  };

  const prevSelectedView = useRef<Maybe<number | string>>(null);
  // to make this hook more decent we need to store selected view in one place, now it's context and state
  useEffect(() => {
    if (assetViewsLoaded) {
      if (
        selectedView &&
        (selectedView === SYSTEM_DEFAULT_VIEW_INDEX || applicationProps.selectedView) &&
        selectedView !== prevSelectedView.current
      ) {
        if (selectedView === SYSTEM_DEFAULT_VIEW_INDEX || !applicationProps.selectedView?.quickDate) {
          handleChangeQuickDate('24h', '15m', false);
        } else if (applicationProps.selectedView?.quickDate) {
          handleChangeQuickDate(
            applicationProps.selectedView?.quickDate,
            applicationProps.selectedView?.frequency,
            false
          );
        }
      }

      prevSelectedView.current = selectedView;
    }
  }, [selectedView, assetViewsLoaded, applicationProps.selectedView, handleChangeQuickDate]);

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
        data-testid="temperatureDateFilter"
      >
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          quickDate={quickDate}
          minDate={minDate}
          maxDate={maxDate}
          disableQuickDateButtons={!assetViewsLoaded}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onQuickDateChange={handleChangeQuickDate}
        />
      </Box>
      {zoomEnabled && (
        <Tooltip TransitionComponent={Zoom} title={t('assethistory.graph.zoom-out-tooltip') ?? ''} arrow>
          <div>
            <Button
              variant="outlined"
              disabled={zoomOutStartDate === null && zoomOutEndDate === null}
              onClick={() => handleZoomOut()}
            >
              {t('assethistory.graph.zoom-out')}
            </Button>
          </div>
        </Tooltip>
      )}
    </Box>
  );
};
