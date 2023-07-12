import { useCallback } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import { AssetOfflineExpression } from '@carrier-io/lynx-fleet-types';

import { EventDialogAssetOfflineProps } from '../../../../types';

import { DialogActions } from './DialogActions';
import { boldTextSx } from './styles';

import { Dialog } from '@/components';

export function AssetOfflineDialog({ handleCancel, handleOk, exclude }: EventDialogAssetOfflineProps) {
  const { t } = useTranslation();

  const handleSave = useCallback(() => {
    handleOk({
      type: 'ASSET_OFFLINE',
      expression: {
        comparison: 'ASSET_OFFLINE',
      } as AssetOfflineExpression,
    });
  }, [handleOk]);

  return (
    <Dialog
      open
      onClose={handleCancel}
      dialogTitle={t('notifications.asset-offline-dialog-title')}
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
            <Typography sx={boldTextSx}>{t('notifications.asset-offline-dialog-content-asset')}</Typography>
            &nbsp;
            {t('common.is').toLowerCase()}
            &nbsp;
            <Typography sx={boldTextSx}>{t('notifications.asset-offline-dialog-content')}</Typography>
          </Typography>
        </Box>
      }
      actionsSx={{ p: 1 }}
      actions={<DialogActions onCancel={handleCancel} onSave={handleSave} />}
    />
  );
}
