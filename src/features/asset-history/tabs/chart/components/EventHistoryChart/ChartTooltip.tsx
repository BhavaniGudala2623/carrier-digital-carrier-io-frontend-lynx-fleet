import Paper from '@carrier-io/fds-react/Paper';
import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';
import { TooltipProps } from 'recharts';

import { getChartTooltipData } from '../../../../utils';

import { formatDate } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';

type ICustomTooltipProps = {
  label: number;
} & Pick<TooltipProps, 'active' | 'payload'>;

export const ChartTooltip = ({ active, payload, label }: ICustomTooltipProps) => {
  const {
    userSettings: { dateFormat },
  } = useUserSettings();

  if (active && payload && payload.length) {
    const { other, c1Payload, c2Payload, c3Payload } = getChartTooltipData(payload);

    return (
      <Paper
        sx={{
          p: 2,
          textAlign: 'left',
          userSelect: 'none',
          zIndex: 10,
          width: 200,
        }}
      >
        <Box mb={1.5}>
          <Typography variant="helperText" sx={{ weight: '300' }}>
            {formatDate(new Date(label), dateFormat)}
          </Typography>
        </Box>
        {[other, c1Payload, c2Payload, c3Payload].map(
          (lines, index) =>
            lines &&
            lines.length > 0 && (
              <Box key={lines[0]?.name ?? index} mb={1.5}>
                {lines.map((line) => (
                  <Box key={line.name} display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="helperText" sx={{ color: line.color, weight: '300' }}>
                      {`${line.name}:`}
                    </Typography>
                    <Typography variant="helperText" sx={{ color: line.color, weight: '300' }}>
                      {`${line.value}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )
        )}
      </Paper>
    );
  }

  return null;
};
