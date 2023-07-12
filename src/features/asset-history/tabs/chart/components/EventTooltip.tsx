import { differenceInMinutes } from 'date-fns';
import Paper from '@carrier-io/fds-react/Paper';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import { TooltipProps } from 'recharts';
import { Chip } from '@carrier-io/fds-react';
import { Description, DescriptionVariants } from '@carrier-io/fds-react/patterns/Description';
import { useTranslation } from 'react-i18next';

import { dateTimeFormatter } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';

export const EventTooltip = ({ active, payload }: TooltipProps) => {
  const { t } = useTranslation();
  const {
    userSettings: { dateFormat },
  } = useUserSettings();

  if (active && payload && payload.length) {
    return payload.map((data) => {
      if (!data?.payload) {
        return <span />;
      }

      let title = '';
      let subtitle = '';
      let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';

      const eventName = data.payload?.eventName || '';

      const { statusName } = data.payload;
      if (statusName) {
        switch (statusName) {
          case 'powerModeStandby':
            title = t('assets.asset.table.power-mode');
            subtitle = t('asset.data.standby');
            color = 'secondary';
            break;
          case 'powerModeEngine':
            title = t('assets.asset.table.power-mode');
            subtitle = t('asset.data.engine');
            color = 'primary';
            break;
          case 'controlModeContinuous':
            title = t('assets.asset.table.control-mode');
            subtitle = t('asset.data.continuous');
            color = 'primary';
            break;
          case 'controlModeStartStop':
            title = t('assets.asset.table.control-mode');
            subtitle = t('asset.data.start-stop');
            color = 'secondary';
            break;
          default:
            break;
        }
      }

      switch (data.payload.name) {
        case 'rearDoor':
          subtitle = t('common.open');
          title = t('assets.asset.table.rearDoor');
          color = 'error';
          break;
        case 'c1On':
          title = t('assets.asset.table.c1-on');
          subtitle = t('asset.data.on');
          color = 'success';
          break;
        case 'c2On':
          title = t('assets.asset.table.c2-on');
          subtitle = t('asset.data.on');
          color = 'success';
          break;
        case 'c3On':
          title = t('assets.asset.table.c3-on');
          subtitle = t('asset.data.on');
          color = 'success';
          break;
        case 'sideDoor':
          subtitle = t('common.open');
          title = t('assets.asset.table.sideDoor');
          color = 'error';
          break;
        case 'truStatus':
          title = t('assets.asset.table.tru-status');
          subtitle = t('asset.data.on');
          color = 'success';
          break;
        case 'inMotion':
          title = t('assets.asset.table.motion');
          subtitle = t('assets.asset.table.moving');
          color = 'success';
          break;
        case 'defrost':
          title = t('assets.asset.table.freezer-comp-mode.defrost');
          subtitle = t('asset.data.on');
          color = 'primary';
          break;
        case 'geofence':
          title = t('geofences.geofence');
          subtitle = eventName;
          color = 'primary';
          break;
        default:
          break;
      }

      const startMs =
        data.payload.startTime <= data.payload.endTime ? data.payload.startTime : data.payload.endTime;
      const endMs =
        data.payload.startTime >= data.payload.endTime ? data.payload.startTime : data.payload.endTime;
      const start = dateTimeFormatter(startMs, {
        timestampFormat: 'milliseconds',
        dateFormat,
      });
      const end = dateTimeFormatter(endMs, {
        timestampFormat: 'milliseconds',
        dateFormat,
      });
      const duration = differenceInMinutes(endMs, startMs, { roundingMethod: 'ceil' });

      const descriptionItems = [
        { label: t('common.from'), text: start },
        { label: t('common.to'), text: end },
        {
          label: t('common.duration'),
          text: `${duration} ${duration > 1 ? t('common.minutes') : t('common.minute')}`,
        },
      ];

      if (!duration) {
        // this has been added for edge case of geofenceTimeLine events as they have
        // few data points where the the startTime and endTime are same making the
        // duration as '0' and there is no point showing the toolTip for 0 minute
        // interval. (could be removed in future)
        return null;
      }

      return (
        <Paper
          sx={{ p: 1.5, userSelect: 'none', width: 315 }}
          key={data.payload.startTime + data.payload.endTime}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            {title && <Typography variant="subtitle2">{title}</Typography>}
            {subtitle && <Chip label={subtitle} color={color} lightBackground />}
          </Box>
          <Description
            rowIndentCssUnit="rem"
            rowIndentValue={1.25}
            variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
            sx={{ minHeight: 105 }}
          >
            {descriptionItems.map(({ label, text }) => (
              <Description.Item key={label} label={label} labelContainerSx={{ textAlign: 'left' }}>
                {text}
              </Description.Item>
            ))}
          </Description>
        </Paper>
      );
    });
  }

  return null;
};
