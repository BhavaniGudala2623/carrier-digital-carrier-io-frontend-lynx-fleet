import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import Typography from '@carrier-io/fds-react/Typography';
import { AlertSummary, AlertType } from '@carrier-io/lynx-fleet-types';

import { squareSelectedSx, squareSx } from '../common';

export const AlarmBox = ({
  alarm,
  selected,
  onSelectAlarm,
}: {
  alarm: AlertSummary;
  selected: boolean;
  onSelectAlarm: (alarm: AlertType) => void;
}) => {
  const { t } = useTranslation();

  const titles: Record<AlertType, string> = {
    DOOR_OPEN: t('assets.widgets.alarm.widget.tru-on-with'),
    OUT_OF_RANGE: t('alarms.widget.out-of-range'),
    ACTIVE_SHUTDOWN: t('alarms.widget.active-shutdown'),
    RUNNING_ON_DIESEL: t('alarms.widget.running-on-diesel'),
    LOW_BATTERY: t('alarms.widget.low-tru-battery'),
    LOW_FUEL: t('alarms.widget.low-fuel'),
  };

  return (
    <Paper
      key={alarm.type}
      sx={selected ? squareSelectedSx : squareSx}
      variant="outlined"
      onClick={() => onSelectAlarm(alarm.type)}
      data-testid={`${alarm.type.toLowerCase()}-widget`}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
        <Typography
          variant="h6"
          color="primary.dark"
          data-testid={`${alarm.type.toLowerCase()}-widget-counter`}
        >
          {alarm.assetIds ? alarm.assetIds.length : 0}
        </Typography>
        <Typography
          variant="caption"
          color="text.primary"
          sx={{ overflowWrap: 'break-word' }}
          data-testid={`${alarm.type.toLowerCase()}-widget-title`}
        >
          {titles[alarm.type]}
        </Typography>
      </Box>
    </Paper>
  );
};
