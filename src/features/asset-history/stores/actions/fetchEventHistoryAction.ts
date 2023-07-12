import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { FlespiData, GetEventHistoryArgs, HistoryFrequency, Maybe } from '@carrier-io/lynx-fleet-types';
import { zonedTimeToUtc } from 'date-fns-tz';

import { assetHistorySlice } from '../slice';
import { getFrequencyMinutesNumber } from '../../tabs/chart/components/EventHistoryTable/utils';
import { getCompartmentDataKey, createChartConfig } from '../../utils';
import { CompartmentsStatuses } from '../../types';

import { AppDispatch } from '@/stores';
import { ChartConfig } from '@/types';

const { actions } = assetHistorySlice;

export const fetchEventHistoryAction =
  (
    assetId: string,
    startDate: Maybe<Date>,
    endDate: Maybe<Date>,
    timezone: string,
    frequency: HistoryFrequency,
    isFeatureTemperatureChartAndTableEnabled: boolean,
    isFeatureCompartmentOnOffModeEnabled: boolean,
    isFeatureGeofenceTmpEventEnabled: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!assetId || !startDate || !endDate) {
      return null;
    }

    dispatch(actions.startFetchEventHistoryCall());

    const frequencyNumber = getFrequencyMinutesNumber(frequency);

    const eventHistoryVariables: GetEventHistoryArgs = {
      assetId,
      startDate: startDate && zonedTimeToUtc(startDate.setSeconds(0, 0), timezone).toISOString(),
      endDate: endDate && zonedTimeToUtc(endDate.setSeconds(59, 999), timezone).toISOString(),
    };

    if (isFeatureTemperatureChartAndTableEnabled) {
      eventHistoryVariables.binTime = frequencyNumber;
    }

    return AssetService.fetchEventHistory(eventHistoryVariables)
      .then((response) => {
        const data = response?.data?.getEventHistory;

        if (!data?.device) {
          dispatch(
            actions.catchFetchEventHistoryError({
              err: { clientMessage: 'Unable to load any device data for the given asset' },
            })
          );

          return;
        }

        const { tenant, fleets, asset, device, flespiData, timelineEvents, binTimeMinutes, history } = data;

        const unfilteredColumns =
          Array.isArray(history) && history.length > 0
            ? Object.keys(history[0] ?? {}).filter((field) =>
                history.find((item) => item?.[field as keyof FlespiData] !== null)
              )
            : [];

        const compartmentsObj: CompartmentsStatuses = {};

        for (let i = 1; i <= 3; i += 1) {
          const dataKey = getCompartmentDataKey(i.toString(), flespiData?.freezer_control_mode);
          compartmentsObj[dataKey] = !!history?.find((historyEvent) => historyEvent?.[dataKey] === true);
        }

        const chartConfig: ChartConfig = createChartConfig(
          device?.sensors,
          unfilteredColumns,
          flespiData,
          compartmentsObj,
          isFeatureCompartmentOnOffModeEnabled,
          isFeatureGeofenceTmpEventEnabled
        );

        const availableColumns = unfilteredColumns.filter((column) => {
          if (column === 'timestamp') {
            return true;
          }

          return Object.keys(chartConfig).some((chartKey) => {
            if (column === chartKey) {
              return true;
            }

            return Object.keys(chartConfig[chartKey].children).some(
              (childChartKey) => column === childChartKey
            );
          });
        });

        const availableColumnsWithEvents = [
          ...availableColumns,
          ...Object.keys(chartConfig.events?.children).filter(
            (c) => chartConfig.events.children[c].available
          ),
        ];
        dispatch(
          actions.eventHistoryFetched({
            tenant,
            fleets,
            history,
            availableColumns: availableColumnsWithEvents,
            asset,
            device,
            flespiData,
            timelineEvents,
            chartConfig,
            totalCount: history?.length ?? 0,
            binTimeMinutes,
          })
        );
      })
      .catch((err) => {
        dispatch(
          actions.catchFetchEventHistoryError({
            ...err,
            err: {
              clientMessage: 'Error loading asset history data',
            },
          })
        );
      });
  };
