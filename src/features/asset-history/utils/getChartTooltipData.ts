import type { TooltipProps } from 'recharts';

export const getChartTooltipData = (payload: TooltipProps['payload']) =>
  payload.reduce(
    (acc, line) => {
      if (line.name.includes('C1')) {
        return {
          ...acc,
          c1Payload: acc.c1Payload ? [...acc.c1Payload, line] : [line],
        };
      }

      if (line.name.includes('C2')) {
        return {
          ...acc,
          c2Payload: acc.c2Payload ? [...acc.c2Payload, line] : [line],
        };
      }

      if (line.name.includes('C3')) {
        return {
          ...acc,
          c3Payload: acc.c3Payload ? [...acc.c3Payload, line] : [line],
        };
      }

      return {
        ...acc,
        other: acc.other ? [...acc.other, line] : [line],
      };
    },
    {
      other: null,
      c1Payload: null,
      c2Payload: null,
      c3Payload: null,
    }
  );
