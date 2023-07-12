import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { AlertType } from '@carrier-io/lynx-fleet-types';

import { useAssetsPageContext } from '../../../../providers';
import { useAssetsPageDataContext } from '../../../../providers/AssetsPageDataProvider';

import { AlarmBox } from './AlarmsBox';

const ALERT_ORDER = {
  ACTIVE_SHUTDOWN: 1,
  DOOR_OPEN: 2,
  LOW_BATTERY: 3,
  OUT_OF_RANGE: 4,
  RUNNING_ON_DIESEL: 5,
  LOW_FUEL: 6,
} as Record<AlertType, number>;

export const AlarmsWidget = () => {
  const { t } = useTranslation();

  const { selectedAlarm, setSelectedAlarm, setSelectedStatus, setSelectedAssetHealthStatus } =
    useAssetsPageContext();
  const { filteredAlertSummaries } = useAssetsPageDataContext();

  const selectAlarm = (type: AlertType) => {
    let newAlarmType: AlertType | null = null;
    if (type !== selectedAlarm) {
      newAlarmType = type;
    }
    setSelectedAlarm(newAlarmType);
    setSelectedStatus(null);
    setSelectedAssetHealthStatus(null); // TODO: rename
  };

  return (
    <Box my={2}>
      <Typography variant="subtitle2" color="text.primary" pl={1} mb={1}>
        {t('assets.widgets.alarm.widget.live-status')}
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
        {filteredAlertSummaries?.length > 0 ? (
          [...filteredAlertSummaries]
            .sort((alertA, alertB) => ALERT_ORDER[alertA.type] - ALERT_ORDER[alertB.type])
            .map((x) => (
              <AlarmBox
                key={x.type}
                alarm={x}
                selected={x.type === selectedAlarm}
                onSelectAlarm={selectAlarm}
              />
            ))
        ) : (
          <Box className="spinner spinner-primary" sx={{ margin: '200px' }} />
        )}
      </Box>
    </Box>
  );
};

AlarmsWidget.displayName = 'AlarmsWidget';
