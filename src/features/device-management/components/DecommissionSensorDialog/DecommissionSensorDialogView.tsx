import Button from '@carrier-io/fds-react/Button';
import Grid from '@carrier-io/fds-react/Grid';
import Typography from '@carrier-io/fds-react/Typography';
import { BluetoothSensor, Maybe } from '@carrier-io/lynx-fleet-types';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DecommissionSensorDialogReason } from './DecommissionSensorDialogReason';
import { DecommissionSensorDialogTable } from './DecommissionSensorDialogTable';

import { Dialog, Loader } from '@/components';

export interface DeleteNotificationConfirmationDialogViewProps {
  macId: BluetoothSensor['macId'];
  selectedReason: Maybe<string>;
  open: boolean;
  decommissionLoading: boolean;
  onClose: () => void;
  setSelectedReason: Dispatch<SetStateAction<string | null>>;
  handleOkClick: () => void;
}

export const DecommissionSensorDialogView = ({
  macId,
  open,
  decommissionLoading,
  onClose,
  selectedReason,
  setSelectedReason,
  handleOkClick,
}: DeleteNotificationConfirmationDialogViewProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleOnChange = (value: string) => {
    setSelectedReason(value);
  };

  const handleOnLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleCancelClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleCancelClick}
      dialogTitle={t('device.management.bluetooth-sensors.sensors-table.actions.decommission-sensor')}
      dialogTitleSx={{ marginBottom: '21px', variant: 'h6' }}
      contentSx={{ overflowY: 'hidden' }}
      content={
        <Grid container direction="column">
          <Typography variant="body1">
            {t('device.management.bluetooth-sensors.sensors-table.decommission-dialog.message')}
          </Typography>
          <DecommissionSensorDialogTable macId={macId} isLoading={isLoading} onLoad={handleOnLoad} />
          <DecommissionSensorDialogReason onChange={handleOnChange} />
          {isLoading && <Loader overlay />}
        </Grid>
      }
      actions={
        <>
          <Button
            color="secondary"
            variant="outlined"
            disabled={isLoading || decommissionLoading}
            onClick={handleCancelClick}
          >
            {t('common.no')}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            disabled={isLoading || decommissionLoading || !selectedReason}
            onClick={handleOkClick}
          >
            {t('common.yes')}
          </Button>
        </>
      }
      actionsSx={{ mt: 0 }}
    />
  );
};
