import { useCallback } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import { FuelLevelExpression } from '@carrier-io/lynx-fleet-types';

import { EventDialogFuelProps } from '../../../../types';
import { PercentagePicker } from '../../PercentagePicker';
import { useNumericValue } from '../../../../hooks';

import { DialogActions } from './DialogActions';
import { boldTextSx } from './styles';

import { Dialog } from '@/components';

export function FuelDialog({ handleCancel, handleOk, exclude, expression }: EventDialogFuelProps) {
  const { t } = useTranslation();

  const initialfuelValue = (expression as FuelLevelExpression)?.value || 15;

  const { value: fuelnumber, handleValueChange: handleFuelLevelChange } = useNumericValue(
    Number(initialfuelValue)
  );

  const handleSave = useCallback(() => {
    handleOk({
      type: 'FUEL_LEVEL',
      expression: {
        value: fuelnumber,
        comparison: 'FREEZER_FUEL_LEVEL',
      } as FuelLevelExpression,
    });
  }, [handleOk, fuelnumber]);

  return (
    <Dialog
      open
      onClose={handleCancel}
      dialogTitle={t('notifications.fuel-level')}
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
            <Typography sx={boldTextSx}>{t('notifications.fuel-level')}</Typography>
            &nbsp;
            {t('common.goes-below')}
          </Typography>
          <Box ml={1}>
            <PercentagePicker
              value={fuelnumber}
              onChange={handleFuelLevelChange}
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
