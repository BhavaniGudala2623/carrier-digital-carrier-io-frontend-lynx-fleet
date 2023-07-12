import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Container from '@carrier-io/fds-react/Container';
import Popover from '@carrier-io/fds-react/Popover';
import Typography from '@carrier-io/fds-react/Typography';
import { NotificationPageItem, NotificationRuleCondition } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import {
  isDoorEvent,
  isTemperatureDeviationEvent,
  isGeofenceEvent,
  isTruAlarmEvent,
  isFuelLevelEvent,
  isBatteryLevelEvent,
  isSetpointChangeEvent,
  isAssetOfflineEvent,
} from '../../utils';
import {
  AlarmEventView,
  DoorEventView,
  GeofenceEventView,
  SetpointEventView,
  FuelLevelEventView,
  BatteryLevelEventView,
  TemperatureDeviationEventView,
  AssetOfflineEventView,
} from '../EventViews';

import { secondsAsTimePickerValue } from '@/utils';
import { useApplicationContext } from '@/providers/ApplicationContext';

export type NotificationRuleViewAction = 'CLOSE' | 'EDIT';

interface RuleViewProps {
  anchor: HTMLElement;
  notification: NotificationPageItem;
  hasNotificationEditPermission: boolean;
  onCallback: (action: NotificationRuleViewAction) => void;
}

export function RuleView(props: RuleViewProps) {
  const { anchor, onCallback, hasNotificationEditPermission, notification } = props;
  const { rule } = notification;
  const { condition, exceptConditions, onlySendWhenConditionMetActive, onlySendWhenConditionMetSeconds } =
    rule;
  const time = secondsAsTimePickerValue(onlySendWhenConditionMetSeconds);

  const { t } = useTranslation();

  const { featureFlags } = useApplicationContext();
  const isFeatureFuelLevelEnabled = featureFlags.REACT_APP_FEATURE_FUEL_LEVEL;
  const isFeatureBatteryLevelEnabled = featureFlags.REACT_APP_FEATURE_BATTERY_LEVEL;
  const isAssetOfflineEnabled = featureFlags.REACT_APP_FEATURE_ASSET_OFFLINE;
  const handleClose = () => {
    onCallback('CLOSE');
  };

  const handleEdit = () => {
    onCallback('EDIT');
  };

  return (
    <Popover
      anchorEl={anchor}
      open
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Container
        style={{ paddingRight: '8px' }}
        sx={{
          pt: 3,
          pl: 3,
          pb: 1,
        }}
      >
        <Box sx={{ mb: 2, pr: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t('notifications.send-notification')}&nbsp;{t('common.if')}
            <Typography
              sx={{ fontWeight: 'bold', textTransform: 'lowercase', px: 0.5 }}
              component="span"
              variant="body2"
            >
              {t('common.all')}
            </Typography>
            {t('notifications.conditions-met')}
          </Typography>
          {condition ? (
            <Box sx={{ ml: 1 }}>
              {isDoorEvent(condition.type, condition.expression) && (
                <DoorEventView expression={condition.expression} />
              )}
              {isTemperatureDeviationEvent(condition.type, condition.expression) && (
                <TemperatureDeviationEventView expression={condition.expression} type={condition.type} />
              )}
              {isGeofenceEvent(condition.type, condition.expression) && (
                <GeofenceEventView expression={condition.expression} />
              )}
              {isFuelLevelEvent(condition.type, condition.expression) && isFeatureFuelLevelEnabled && (
                <FuelLevelEventView expression={condition.expression} />
              )}
              {isBatteryLevelEvent(condition.type, condition.expression) && isFeatureBatteryLevelEnabled && (
                <BatteryLevelEventView expression={condition.expression} />
              )}
              {isAssetOfflineEvent(condition.type, condition.expression) && isAssetOfflineEnabled && (
                <AssetOfflineEventView />
              )}
              {
                // @ts-ignore delete this ts-ignore after LYNXFLT-5533 is completed
                isTruAlarmEvent(condition.type, condition.expression) && (
                  <AlarmEventView expression={condition.expression} />
                )
              }
              {
                // @ts-ignore delete this ts-ignore after LYNXFLT-5533 is completed
                isSetpointChangeEvent(condition.type, condition.expression) && (
                  <SetpointEventView expression={condition.expression} />
                )
              }
            </Box>
          ) : (
            <Typography sx={{ ml: 1 }}>{t('notifications.none')}</Typography>
          )}
        </Box>

        <Box sx={{ mb: 2, pr: 2 }}>
          {condition.type !== 'DOOR' &&
            condition.type !== 'FUEL_LEVEL' &&
            condition.type !== 'ASSET_OFFLINE' &&
            condition.type !== 'BATTERY_LEVEL' && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('notifications.except-when')}
                  <Typography
                    sx={{ textTransform: 'lowercase', fontWeight: 'bold', px: 0.5 }}
                    component="span"
                    variant="body2"
                  >
                    {t('common.any')}
                  </Typography>
                  {t('notifications.conditions-met')}
                </Typography>
                {exceptConditions.length > 0 ? (
                  exceptConditions.map((exceptCondition: NotificationRuleCondition) => (
                    <Box key={exceptCondition.type + exceptCondition.expression.comparison} sx={{ ml: 1 }}>
                      {
                        // @ts-ignore delete this ts-ignore after LYNXFLT-5533 is completed
                        isDoorEvent(exceptCondition.type, exceptCondition.expression) && (
                          <Typography variant="body2" component="div" sx={{ pr: 0.5 }}>
                            <DoorEventView expression={exceptCondition.expression} />
                          </Typography>
                        )
                      }
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    &bull;&nbsp;{t('notifications.none')}
                  </Typography>
                )}
              </>
            )}
        </Box>

        <Box sx={{ pr: 2 }}>
          {onlySendWhenConditionMetActive && (
            <>
              <Typography variant="body2" sx={{ mb: 1, pr: 0.5 }}>
                {t('notifications.time-conditions-met')}
              </Typography>
              <Typography variant="body2" sx={{ ml: 1 }}>
                <b>
                  &bull; {time.hr} {t(time.hr !== 1 ? 'common.hours' : 'common.hour')} &amp;&nbsp;
                  {time.min} {t(time.min !== 1 ? 'common.minutes' : 'common.minute')}
                </b>
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button sx={{ mr: 1 }} color="secondary" variant="outlined" onClick={handleClose}>
            {t('common.close')}
          </Button>
          {hasNotificationEditPermission && (
            <Button variant="outlined" onClick={handleEdit}>
              {t('common.edit')}
            </Button>
          )}
        </Box>
      </Container>
    </Popover>
  );
}
