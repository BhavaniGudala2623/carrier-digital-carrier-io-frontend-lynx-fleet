import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { NotificationRuleConditionType } from '@carrier-io/lynx-fleet-types';

const defaultExceptionColor = {
  color: 'action.active',
};

export const AdditionalRules = (props: { notificationType?: NotificationRuleConditionType }) => {
  const { t } = useTranslation();
  const { notificationType } = props;

  let exceptions: Extract<NotificationRuleConditionType, 'TRU_STATUS' | 'FREEZER_MODE'>[] = [];

  switch (notificationType) {
    case 'TEMPERATURE_DEVIATION':
    case 'TEMPERATURE_DEVIATION_FIXED_VALUE':
      exceptions = ['TRU_STATUS', 'FREEZER_MODE'];
      break;

    case 'TRU_ALARM':
    case 'SETPOINT_CHANGE':
      exceptions = ['TRU_STATUS'];
      break;

    default:
      break;
  }

  return (
    <Box sx={{ pt: 2, pb: 2 }}>
      {!!exceptions.length && (
        <>
          <Typography color={defaultExceptionColor.color} variant="caption">
            {t('notifications.default-exceptions')}
          </Typography>
          <Box sx={{ m: 0, py: 0, pl: 2, pr: 0 }} component="ul">
            {exceptions.includes('TRU_STATUS') && (
              <li style={{ ...defaultExceptionColor }}>
                <Typography color={defaultExceptionColor.color} variant="caption">
                  {t('notifications.tru-off')}
                </Typography>
              </li>
            )}

            {exceptions.includes('FREEZER_MODE') && (
              <li style={{ ...defaultExceptionColor }}>
                <Typography color={defaultExceptionColor.color} variant="caption">
                  {t('notifications.unit-defrosting')}
                </Typography>
              </li>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
