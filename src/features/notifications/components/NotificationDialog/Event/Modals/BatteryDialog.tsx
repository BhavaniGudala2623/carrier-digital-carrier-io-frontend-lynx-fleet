import { useCallback } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import { BatteryLevelExpression } from '@carrier-io/lynx-fleet-types';

import { EventDialogBatteryProps } from '../../../../types';
import { VoltagePicker } from '../../VoltagePicker';
import { useNumericValue } from '../../../../hooks';

import { DialogActions } from './DialogActions';
import { boldTextSx } from './styles';

import { Dialog } from '@/components';

export function BatteryDialog({ handleCancel, handleOk, exclude, expression }: EventDialogBatteryProps) {
  const { t } = useTranslation();

  const initialfuelValue = (expression as BatteryLevelExpression)?.value || 12;

  const { value: batteryValue, handleValueChange: handleBatteryLevelChange } = useNumericValue(
    Number(initialfuelValue)
  );

  const handleSave = useCallback(() => {
    handleOk({
      type: 'BATTERY_LEVEL',
      expression: {
        value: batteryValue,
        comparison: 'FREEZER_BATTERY_VOLTAGE',
      } as BatteryLevelExpression,
    });
  }, [handleOk, batteryValue]);

  return (
    <Dialog
      open
      onClose={handleCancel}
      dialogTitle={t('notifications.battery-level')}
      fullWidth
      maxWidth="sm"
      content={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" component="div">
            <Typography sx={boldTextSx}>
              {exclude ? t('notifications.except-when') : t('common.if')}
            </Typography>
            &nbsp;
            {t('common.the').toLowerCase()}
            &nbsp;
            <Typography sx={boldTextSx}>{t('notifications.battery-level-accessory')}</Typography>
            &nbsp;
            {t('common.goes-below')}
          </Typography>
          <Box ml={1}>
            <VoltagePicker
              value={batteryValue}
              onChange={handleBatteryLevelChange}
              lowerLimit={0}
              upperLimit={100}
            />
          </Box>
        </Box>
      }
      actionsSx={{ p: 1 }}
      actions={<DialogActions onCancel={handleCancel} onSave={handleSave} />}
    />
  );
}
