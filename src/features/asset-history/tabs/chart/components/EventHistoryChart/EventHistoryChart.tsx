import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  ReferenceArea,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  AxisDomain,
} from 'recharts';
import { getTime } from 'date-fns';
import { isNumber } from 'lodash-es';
import { EventHistoryRec, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { CircularProgress } from '@carrier-io/fds-react';
import { toDate, utcToZonedTime } from 'date-fns-tz';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { CustomizedXAxisTick } from './CustomizedXAxisTick';
import { CustomizedYAxisTick } from './CustomizedYAxisTick';
import { ChartTooltip } from './ChartTooltip';
import './styles.scss';

import { FlatChartConfig, ILegendSettings } from '@/providers/ApplicationContext';
import { toUnit } from '@/utils';
import { FlespiDataField } from '@/types';
import { useUserSettings } from '@/providers/UserSettings';
import { sensorTemperatureFields } from '@/constants';

interface AssetHistoryChartProps {
  chartConfig: FlatChartConfig;
  history?: Maybe<Maybe<EventHistoryRec>[]>;
  legendSettings: ILegendSettings;
  startDate: Maybe<Date>;
  setStartDate: (x: Maybe<Date>) => void;
  endDate: Maybe<Date>;
  setEndDate: (x: Maybe<Date>) => void;
  temperatureSetting?: string;
  dateFormat: DateFormatType;
  assetHistoryLoaded?: boolean;
  zoomOutStartDate: Maybe<Date>;
  setZoomOutStartDate: (x: Maybe<Date>) => void;
  zoomOutEndDate: Maybe<Date>;
  setZoomOutEndDate: (x: Maybe<Date>) => void;
  quickDate: Maybe<QuickDate>;
  setQuickDate: (x: Maybe<QuickDate>) => void;
  setZoomOutQuickDate: (x: Maybe<QuickDate>) => void;
}

interface IConvertedRecord {
  [key: string]: unknown;
}

const truOnFilteredFields: FlespiDataField[] = [
  'freezer_air_temperature',
  'freezer_zone1_temperature_setpoint',
  'freezer_zone2_temperature_setpoint',
  'freezer_zone3_temperature_setpoint',
  'freezer_zone1_supply_air_temperature',
  'freezer_zone2_supply_air_temperature',
  'freezer_zone3_supply_air_temperature',
  'freezer_zone1_return_air_temperature',
  'freezer_zone2_return_air_temperature',
  'freezer_zone3_return_air_temperature',
];

export const EventHistoryChart = (props: AssetHistoryChartProps) => {
  const {
    chartConfig,
    history,
    legendSettings,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    temperatureSetting,
    dateFormat,
    assetHistoryLoaded,
    zoomOutStartDate,
    setZoomOutStartDate,
    zoomOutEndDate,
    setZoomOutEndDate,
    quickDate,
    setQuickDate,
    setZoomOutQuickDate,
  } = props;

  const { t } = useTranslation();
  const {
    userSettings: { timezone },
  } = useUserSettings();

  const getTemperatureForChart = (value: number | string | boolean | null | undefined): number | null =>
    temperatureSetting && isNumber(value) ? toUnit(value, temperatureSetting, 1) : null;

  const convertRecordTemperatures = (
    record: Maybe<EventHistoryRec>,
    priorSyntheticTruStatus?: Maybe<string>
  ): IConvertedRecord =>
    Object.keys(chartConfig).reduce((acc: IConvertedRecord, key) => {
      const fieldName = key as FlespiDataField;
      const fieldValue = record?.[fieldName];

      if (truOnFilteredFields.includes(fieldName)) {
        acc[fieldName] =
          record?.synthetic_tru_status === 'ON' || priorSyntheticTruStatus === 'ON'
            ? getTemperatureForChart(fieldValue)
            : null;
      } else if (sensorTemperatureFields.includes(fieldName)) {
        acc[fieldName] = getTemperatureForChart(fieldValue);
      }

      return acc;
    }, {});

  const convertToRechartsData = (rawData: Maybe<Maybe<EventHistoryRec>[]> | undefined) => {
    if (!rawData?.length) {
      return [];
    }

    const result: Record<string, unknown>[] = [];
    let priorSyntheticTruStatus = rawData[0]?.synthetic_tru_status;
    for (const record of rawData) {
      if (record) {
        result.push({
          ...record,
          ...convertRecordTemperatures(record, priorSyntheticTruStatus),
          timestamp: record?.timestamp
            ? utcToZonedTime(toDate(record?.timestamp!, { timeZone: 'utc' }), timezone)
            : undefined,
        });

        priorSyntheticTruStatus = record.synthetic_tru_status;
      }
    }

    return result;
  };

  const chartData = history && convertToRechartsData(history);
  const [refAreaLeft, setRefAreaLeft] = useState<number | undefined>();
  const [refAreaRight, setRefAreaRight] = useState<number | undefined>();

  const zoom = () => {
    if (refAreaLeft && refAreaRight && refAreaLeft !== refAreaRight) {
      if (!zoomOutStartDate) {
        setZoomOutStartDate(startDate);
      }

      if (!zoomOutEndDate) {
        setZoomOutEndDate(endDate);
      }

      if (quickDate) {
        setZoomOutQuickDate(quickDate);
      }

      if (refAreaLeft < refAreaRight) {
        setStartDate(new Date(refAreaLeft));
        setEndDate(new Date(refAreaRight));
      } else if (refAreaRight > refAreaLeft) {
        setStartDate(new Date(refAreaRight));
        setEndDate(new Date(refAreaLeft));
      }

      setQuickDate(null);
    }

    setRefAreaLeft(undefined);
    setRefAreaRight(undefined);
  };

  const renderXAxis = () => {
    const axisDomain: undefined | [AxisDomain, AxisDomain] =
      startDate && endDate ? [getTime(startDate), getTime(endDate)] : undefined;

    return (
      <XAxis
        dataKey="timestamp"
        tick={<CustomizedXAxisTick dateFormat={dateFormat} />}
        type="number"
        domain={axisDomain}
        height={35}
        allowDataOverflow
      />
    );
  };

  if (!assetHistoryLoaded) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ResponsiveContainer
      className="recharts-responsive-container-custom"
      id="temperature-container"
      height={350}
      width="99%" // setting this to 100% breaks resizing.  See - https://stackoverflow.com/questions/50891591/recharts-responsive-container-does-not-resize-correctly-in-flexbox
    >
      <LineChart
        data={chartData}
        margin={{
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        }}
        onMouseDown={(e) => {
          setRefAreaLeft(e.activeLabel ? new Date(e.activeLabel).getTime() : undefined);
        }}
        onMouseMove={(e) =>
          refAreaLeft && setRefAreaRight(e.activeLabel ? new Date(e.activeLabel).getTime() : undefined)
        }
        onMouseUp={zoom}
      >
        <CartesianGrid opacity={0.3} />
        {renderXAxis()}
        <YAxis width={60} tick={<CustomizedYAxisTick temperatureSetting={temperatureSetting} />} />
        {refAreaLeft && refAreaRight ? (
          <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
        ) : null}
        <Tooltip isAnimationActive animationDuration={0} content={ChartTooltip} />
        {Object.keys(chartConfig).map((key) => {
          let dash = '0';

          if (chartConfig?.[key].lineType === 'dashed') {
            dash = '8';
          } else if (chartConfig && chartConfig[key].lineType === 'dotted') {
            dash = '2';
          }

          const hidden = legendSettings?.columnsToDisplay
            ? !legendSettings.columnsToDisplay?.includes(key)
            : true;
          const name = chartConfig?.[key].i18nKey
            ? t(chartConfig?.[key].i18nKey)
            : chartConfig?.[key].label ?? '';

          return (
            <Line
              key={key}
              name={name}
              type="monotone"
              dataKey={key}
              stroke={chartConfig?.[key].color ?? ''}
              strokeWidth={1.5}
              strokeDasharray={dash}
              hide={hidden}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
              dot={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};
