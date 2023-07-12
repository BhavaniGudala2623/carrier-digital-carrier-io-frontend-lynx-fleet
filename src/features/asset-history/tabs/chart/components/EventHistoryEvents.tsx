import { useState, useEffect, RefObject, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Text,
  AxisDomain,
  CartesianGrid,
} from 'recharts';
import { toDate, utcToZonedTime } from 'date-fns-tz';
import { AssetTimelineEvent, Maybe } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { debounce } from 'lodash-es';

import { CustomizedDot } from './CustomizedDot';
import { EventTooltip } from './EventTooltip';
import { defAxisTextStyles } from './defAxisTextStyles';

import { ChartConfigChildren } from '@/types';
import { ILegendSettings } from '@/providers/ApplicationContext';
import { useUserSettings } from '@/providers/UserSettings';

const CustomizedLabelTick = ({ x, y, labelText }: ICustomizedLabelTick) => {
  if (labelText) {
    return (
      <Text {...defAxisTextStyles} x={x} y={y} textAnchor="end" verticalAnchor="middle">
        {labelText ?? ''}
      </Text>
    );
  }

  return null;
};

interface ICustomizedLabelTick {
  x?: number;
  y?: number;
  labelText?: string;
}

interface IChartData {
  color?: string;
  endTime?: number;
  name?: string;
  startTime?: number;
  truStatus?: number;
}

interface IProps {
  timelineEvents?: Maybe<Maybe<AssetTimelineEvent>[]>;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  legendSettings: ILegendSettings;
  chartConfig?: ChartConfigChildren;
  eventsRef: RefObject<HTMLDivElement>;
}

export const EventHistoryEvents = (props: IProps) => {
  const { timelineEvents, startDate, endDate, legendSettings, chartConfig = {}, eventsRef } = props;
  const { t } = useTranslation();
  const {
    userSettings: { timezone },
  } = useUserSettings();

  const [eventGraphWidth, setEventGraphWidth] = useState(0);

  const startDateInMillis = startDate ? startDate.getTime() : 0;
  const endDateInMillis = endDate ? endDate.getTime() : 0;

  const convertEventsToRechartsData = useCallback(
    (events?: Maybe<Maybe<AssetTimelineEvent>[]>) => {
      const dataKeyToSettingsMap: Record<string, string> = {};

      for (const setting of Object.keys(chartConfig)) {
        const { dataKey } = chartConfig[setting];

        if (dataKey) {
          dataKeyToSettingsMap[dataKey] = setting;
        }

        const { statuses } = chartConfig[setting];
        if (statuses && statuses.length) {
          statuses.forEach((status) => {
            dataKeyToSettingsMap[status.dataKey] = setting;
          });
        }
      }

      if (events && Object.keys(chartConfig).length > 0) {
        return events
          .map((event) => {
            if (!event) {
              return null;
            }

            const eventStartTimeInMillis = utcToZonedTime(
              toDate(event.startTime as string, {
                timeZone: 'utc',
              }),
              timezone
            ).getTime();

            const eventEndTimeInMillis = utcToZonedTime(
              toDate(event.endTime as string, {
                timeZone: 'utc',
              }),
              timezone
            ).getTime();

            const eventName = event.name;

            if (
              chartConfig[dataKeyToSettingsMap[event.eventType as string]]?.available &&
              eventStartTimeInMillis < endDateInMillis &&
              eventEndTimeInMillis > startDateInMillis
            ) {
              const commonRechartProperties = {
                name: dataKeyToSettingsMap[event.eventType as string],
                startTime:
                  eventStartTimeInMillis < startDateInMillis ? startDateInMillis : eventStartTimeInMillis,
                endTime: eventEndTimeInMillis,
                [dataKeyToSettingsMap[event.eventType as string]]: 1,
                eventName,
              };

              const status = chartConfig[dataKeyToSettingsMap[event.eventType as string]].statuses?.find(
                (option) => option.dataKey === event.eventType
              );

              if (status) {
                return {
                  ...commonRechartProperties,
                  color: status.color,
                  statusName: status.statusName,
                };
              }

              return {
                ...commonRechartProperties,
                color: chartConfig[dataKeyToSettingsMap[event.eventType as string]].color,
              };
            }

            return null;
          })
          .filter(Boolean) as Record<string, string | number>[];
      }

      return [];
    },
    [chartConfig, endDateInMillis, startDateInMillis, timezone]
  );

  useEffect(() => {
    if (eventsRef?.current) {
      setEventGraphWidth(eventsRef.current.offsetWidth - 60);
    }
  }, [eventsRef]);

  useEffect(() => {
    const resizeHandler = debounce(
      () => eventsRef.current && setEventGraphWidth(eventsRef.current.offsetWidth - 60),
      200
    );

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [eventsRef]);

  const [chartData, setChartData] = useState<IChartData[]>([]);

  useEffect(() => {
    if (Object.keys(chartConfig).length > 0) {
      const data = convertEventsToRechartsData(timelineEvents);
      setChartData(data);
    }
  }, [chartConfig, convertEventsToRechartsData, timelineEvents]);

  const renderXAxis = () => {
    const axisDomain: undefined | [AxisDomain, AxisDomain] =
      startDateInMillis && endDateInMillis ? [startDateInMillis, endDateInMillis] : undefined;

    return (
      <XAxis domain={axisDomain} type="number" dataKey="startTime" hide tickLine={false} allowDataOverflow />
    );
  };

  if (!legendSettings) {
    return <div />;
  }

  return (
    <Box id="events-container" ref={eventsRef} mt={2}>
      {Object.keys(chartConfig)
        .filter((c) => chartConfig[c].available)
        .map(
          (dataKey) =>
            legendSettings?.columnsToDisplay?.includes(dataKey) && (
              <ResponsiveContainer key={dataKey} height={25} width="99%">
                <LineChart
                  data={chartData.filter((data) => data.name === dataKey)}
                  margin={{
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                  }}
                >
                  <CartesianGrid opacity={0.3} />
                  {renderXAxis()}
                  <YAxis
                    width={60}
                    tick={
                      <CustomizedLabelTick
                        labelText={
                          chartConfig[dataKey].i18nKey
                            ? t(chartConfig[dataKey].i18nKey!)
                            : chartConfig[dataKey].label
                        }
                      />
                    }
                    domain={[0, 3]}
                    verticalAnchor="middle"
                  />
                  <Tooltip
                    isAnimationActive
                    animationDuration={0}
                    cursor={false}
                    wrapperStyle={{ zIndex: 10 }}
                    content={EventTooltip}
                  />
                  <Line
                    dataKey={dataKey}
                    type="linear"
                    activeDot={(prop) =>
                      CustomizedDot({
                        ...prop,
                        hovered: true,
                        eventGraphWidth,
                        startDateInMillis,
                        endDateInMillis,
                      })
                    }
                    dot={(prop) =>
                      CustomizedDot({ ...prop, eventGraphWidth, startDateInMillis, endDateInMillis })
                    }
                    isAnimationActive={false}
                    legendType="none"
                    stroke="#FFFFFF"
                  />
                </LineChart>
              </ResponsiveContainer>
            )
        )}
    </Box>
  );
};
