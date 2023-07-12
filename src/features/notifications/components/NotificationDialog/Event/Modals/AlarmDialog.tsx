import { useCallback } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';

import { EventDialogProps } from '../../../../types';

import { DialogActions } from './DialogActions';
import { boldTextSx } from './styles';

import { Dialog } from '@/components';

export function AlarmDialog({ handleCancel, handleOk, exclude }: EventDialogProps) {
  const { t } = useTranslation();

  const handleSave = useCallback(() => {
    handleOk({
      type: 'TRU_ALARM',
      expression: {
        comparison: 'ACTIVE_SHUTDOWN',
      },
    });
  }, [handleOk]);

  return (
    <Dialog
      open
      onClose={handleCancel}
      dialogTitle={t('notifications.tru-alarms')}
      fullWidth
      maxWidth="sm"
      content={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" component="div">
            <Typography sx={boldTextSx}>
              {exclude ? t('notifications.except-when') : t('common.if')}
            </Typography>
            &nbsp;
            {t('common.a').toLowerCase()}
            &nbsp;
            <Typography sx={boldTextSx}>{t('notifications.shutdown-alarm')}</Typography>
            &nbsp;
            {t('common.is')}
            &nbsp;
            {t('common.active').toLowerCase()}
          </Typography>
        </Box>
      }
      actionsSx={{ p: 1 }}
      actions={<DialogActions onCancel={handleCancel} onSave={handleSave} />}
    />
  );
}
