import { GetEventsData } from '@carrier-io/lynx-fleet-types';

import { EnrichedEventData } from '../types';

const getColumnsMap = (columns: GetEventsData['columns']) =>
  columns.reduce(
    (acc: { [k: string]: number }, colName: string, i: number) => ({
      ...acc,
      [i]: colName as keyof EnrichedEventData,
    }),
    {}
  );

export const getEventsPart = (eventsData: GetEventsData | undefined) => {
  if (!eventsData?.columns || !eventsData?.rows) {
    return [];
  }
  const columns = getColumnsMap(eventsData.columns);

  return eventsData.rows.reduce((acc: EnrichedEventData[], eventArray) => {
    const event: EnrichedEventData = eventArray.reduce(
      (eventAcc: EnrichedEventData, value, i) => ({
        ...eventAcc,
        ...(columns?.[i] ? { [columns[i] as keyof EnrichedEventData]: value } : {}),
      }),

      {} as EnrichedEventData
    );

    return [...acc, event];
  }, []);
};
