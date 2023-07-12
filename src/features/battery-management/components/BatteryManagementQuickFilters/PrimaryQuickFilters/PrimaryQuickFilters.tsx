import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import { BatteryMetrics } from '@carrier-io/lynx-fleet-types';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { BatteryFilterTypes } from '../../../types';
import { updateSelectedFilter } from '../../../stores/batteryManagement/batteryManagementAction';
import { getElectricAssetsFiltersData, getElectricAssetsTable, getSelectedFilter } from '../../../stores';
import { defaultFiltersCountData } from '../../../constants';

import { primaryFilterStyles } from './styles';
import { TotalBatteriesCount } from './TotalBatteriesCount';
import { PrimaryFilterButton } from './PrimaryFilterButton';
import { PrimaryFiltersSkeleton } from './PrimaryFiltersSkeleton';

import { useAppDispatch, useAppSelector } from '@/stores';
import {
  BatteryChargingIcon,
  BatteryInUseIcon,
  BatteryOfflineRedIcon,
  BatteryOfflineYellowIcon,
  BatteryOnlineIcon,
  EmptyIcon,
} from '@/components/icons';

const LoadedFilterButtons = ({ filterData }: { filterData: BatteryMetrics }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const selectedFilter = useAppSelector(getSelectedFilter);

  const onFilterSelected = (filterType: BatteryFilterTypes | '') => {
    updateSelectedFilter(dispatch, filterType);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <PrimaryFilterButton
        id="battery_filter_online"
        name={t('battery.management.recently-online')}
        count={filterData.online ?? 0}
        onSelected={onFilterSelected}
        boxStyles={{
          borderLeft: 'none',
          borderRight: 'none',
        }}
        icons={[EmptyIcon, BatteryOnlineIcon]}
        buttonType={BatteryFilterTypes.ONLINE}
        selectedFilter={selectedFilter}
      />
      <PrimaryFilterButton
        id="battery_filter_charging"
        name={t('battery.management.charging')}
        count={filterData.charging ?? 0}
        onSelected={onFilterSelected}
        boxStyles={{
          borderRight: 'none',
        }}
        icons={[BatteryChargingIcon, null]}
        iconColors={{ fisrtIconColor: fleetThemeOptions.palette.success.dark }}
        buttonType={BatteryFilterTypes.CHARGING}
        selectedFilter={selectedFilter}
      />
      <PrimaryFilterButton
        id="battery_filter_offline"
        name={t('battery.management.offline')}
        count={filterData.offline ?? 0}
        onSelected={onFilterSelected}
        boxStyles={{
          border: 'none',
        }}
        icons={[BatteryOfflineRedIcon, BatteryOfflineYellowIcon]}
        buttonType={BatteryFilterTypes.OFFLINE}
        selectedFilter={selectedFilter}
      />
      <PrimaryFilterButton
        id="battery_filter_discharging"
        name={t('battery.management.discharging')}
        count={filterData.inUse ?? 0}
        onSelected={onFilterSelected}
        boxStyles={{
          borderRight: 'none',
          borderBottom: 'none',
          borderTop: 'none',
        }}
        icons={[BatteryInUseIcon, null]}
        buttonType={BatteryFilterTypes.IN_USE}
        selectedFilter={selectedFilter}
      />
    </Box>
  );
};

const FilterButtons = () => {
  const electricAssetsTable = useAppSelector(getElectricAssetsTable);
  const filtersData = useAppSelector(getElectricAssetsFiltersData);

  if (electricAssetsTable.isError) {
    return <LoadedFilterButtons filterData={defaultFiltersCountData} />;
  }

  return <LoadedFilterButtons filterData={filtersData ?? defaultFiltersCountData} />;
};

export const PrimaryQuickFilters = () => {
  const classes = primaryFilterStyles();

  const electricAssetsTable = useAppSelector(getElectricAssetsTable);
  const filtersData = useAppSelector(getElectricAssetsFiltersData);

  if (electricAssetsTable.isLoading) {
    return <PrimaryFiltersSkeleton />;
  }

  return (
    <Box className={classes.root}>
      <TotalBatteriesCount count={filtersData?.totalBatteryCount ?? 0} />
      <FilterButtons />
    </Box>
  );
};
