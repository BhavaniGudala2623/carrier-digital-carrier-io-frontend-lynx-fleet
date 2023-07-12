import { useCallback, useMemo } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { DoorExpression } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';

import { Dropdown, useDropdownOption } from '../../Dropdown';
import { DoorComparisonType, EventDialogProps } from '../../../../types';

import { DialogActions } from './DialogActions';
import { boldTextSx } from './styles';

import { Dialog } from '@/components';

export function DoorDialog({ handleCancel, handleOk, expression, exclude }: EventDialogProps) {
  const { t } = useTranslation();

  const dropdownItems = useMemo<{ label: string; value: DoorComparisonType }[]>(
    () => [
      {
        label: t('common.open').toLowerCase(),
        value: 'OPEN',
      },
      {
        label: t('common.closed').toLowerCase(),
        value: 'CLOSED',
      },
    ],
    [t]
  );
  const initialComparison = (expression as DoorExpression)?.comparison || dropdownItems[0].value;
  const { option, handleOptionChange } = useDropdownOption<DoorComparisonType>(initialComparison);

  const handleSave = useCallback(() => {
    handleOk({
      type: 'DOOR',
      expression: {
        comparison: option,
      },
    });
  }, [handleOk, option]);

  return (
    <Dialog
      open
      onClose={handleCancel}
      dialogTitle={t('notifications.door')}
      fullWidth
      maxWidth="sm"
      content={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" component="div">
            <Typography sx={boldTextSx}>
              {exclude ? t('notifications.except-when') : t('common.if')}
            </Typography>
            &nbsp;
            {t('notifications.door-is')}
          </Typography>
          <Dropdown value={option} onChange={handleOptionChange} items={dropdownItems} />
        </Box>
      }
      actionsSx={{ p: 1 }}
      actions={<DialogActions onCancel={handleCancel} onSave={handleSave} />}
    />
  );
}
