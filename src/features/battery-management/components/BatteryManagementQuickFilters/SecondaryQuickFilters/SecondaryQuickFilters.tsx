import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import { BatteryMetrics } from '@carrier-io/lynx-fleet-types';

import { getElectricAssetsFiltersData, getElectricAssetsTable, getSelectedFilter } from '../../../stores';
import { updateSelectedFilter } from '../../../stores/batteryManagement/batteryManagementAction';
import { BatteryFilterTypes } from '../../../types';
import { defaultFiltersCountData } from '../../../constants';

import { SecondaryFilterButton } from './SecondaryFilterButton';
import { SecondaryFiltersSekeleton } from './SecondaryFiltersSkeleton';

import {
  BatteryHighTemperatureIcon,
  BatteryLowTemperatureIcon,
  BatteryPercent0AlertIcon,
  BatteryPercent1To19Icon,
  BatteryPercent50To69Icon,
  BatteryPercent80To99Icon,
  RebalancingOverdueIcon,
} from '@/components';
import { useAppDispatch, useAppSelector } from '@/stores';

const LoadedQuickFilters = ({ filterData }: { filterData: BatteryMetrics }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedFilter = useAppSelector(getSelectedFilter);

  const onFilterSelected = (filterType: BatteryFilterTypes | '') => {
    updateSelectedFilter(dispatch, filterType);
  };

  return (
    <Box display="grid" gridTemplateColumns="repeat(7,fit-content(62px))" gap="6px">
      <SecondaryFilterButton
        id="battery_filter_shutdown"
        buttonType={BatteryFilterTypes.SHUTDOWN}
        count={filterData.shutDown ?? 0}
        icon={BatteryPercent0AlertIcon}
        name={t('battery.management.shutdown')}
        selectedFilter={selectedFilter}
        onSelected={onFilterSelected}
      />
      <SecondaryFilterButton
        id="battery_filter_low_battery"
        buttonType={BatteryFilterTypes.LOW_BATTERY}
        count={filterData.lowBattery ?? 0}
        icon={BatteryPercent1To19Icon}
        name={t('battery.management.low-battery')}
        selectedFilter={selectedFilter}
        onSelected={onFilterSelected}
      />
      <SecondaryFilterButton
        id="battery_filter_normal_battery"
        buttonType={BatteryFilterTypes.NORMAL_BATTERY}
        count={filterData.normalBattery ?? 0}
        icon={BatteryPercent50To69Icon}
        name={t('battery.management.normal-battery')}
        selectedFilter={selectedFilter}
        onSelected={onFilterSelected}
      />
      <SecondaryFilterButton
        id="battery_filter_high_battery"
        buttonType={BatteryFilterTypes.HIGH_BATTERY}
        count={filterData.highBattery ?? 0}
        icon={BatteryPercent80To99Icon}
        name={t('battery.management.high-battery')}
        selectedFilter={selectedFilter}
        onSelected={onFilterSelected}
      />
      <SecondaryFilterButton
        id="battery_filter_rebalancing"
        buttonType={BatteryFilterTypes.REBALANCING}
        count={filterData.rebalance ?? 0}
        icon={RebalancingOverdueIcon}
        name={t('battery.management.rebalancing-overdue')}
        selectedFilter={selectedFilter}
        onSelected={onFilterSelected}
      />
      <SecondaryFilterButton
        id="battery_filter_high_temperature"
        buttonType={BatteryFilterTypes.HIGH_TEMPERATURE}
        count={filterData.highTemperature ?? 0}
        icon={BatteryHighTemperatureIcon}
        name={t('battery.management.high-battery-temperature')}
        selectedFilter={selectedFilter}
        onSelected={onFilterSelected}
      />
      <SecondaryFilterButton
        id="battery_filter_low_temperature"
        buttonType={BatteryFilterTypes.LOW_TEMPERATURE}
        count={filterData.lowTemperature ?? 0}
        icon={BatteryLowTemperatureIcon}
        name={t('battery.management.low-battery-temperature')}
        selectedFilter={selectedFilter}
        onSelected={onFilterSelected}
      />
    </Box>
  );
};

export const SecondaryQuickfilters = () => {
  const electricAssetsTable = useAppSelector(getElectricAssetsTable);
  const filtersData = useAppSelector(getElectricAssetsFiltersData);

  if (electricAssetsTable.isLoading) {
    return <SecondaryFiltersSekeleton />;
  }
  if (electricAssetsTable.isError) {
    return <LoadedQuickFilters filterData={defaultFiltersCountData} />;
  }

  return <LoadedQuickFilters filterData={filtersData ?? defaultFiltersCountData} />;
};
