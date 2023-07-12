import { useState, SyntheticEvent, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import Button from '@carrier-io/fds-react/Button';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import TextField from '@carrier-io/fds-react/TextField';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';

interface Props {
  onClose: () => void;
  isLoading: boolean;
  onChangeMacId: (macId: string) => void;
  macIdValue: string;
  macIdOptions: string[];
}

export const BluetoothSensorMacIdDialogContent = memo(
  ({ onClose, onChangeMacId, isLoading, macIdValue, macIdOptions }: Props) => {
    const [macId, setMacId] = useState<string>(macIdValue);
    const { t } = useTranslation();

    const handleClickSave = () => onChangeMacId(macId);

    const handleSelectMACID = (_event: SyntheticEvent, value: string) => setMacId(value);

    return (
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <Box display="flex" flexDirection="column" paddingY={0.5} width={320}>
          <Typography variant="body1" color="text.primary" paddingTop={1}>
            {t('device.management.bluetooth-sensors.sensors-table.enter-mac-id')}
          </Typography>
          <Autocomplete
            freeSolo
            fullWidth
            limitTags={1}
            value={macId}
            onChange={handleSelectMACID}
            loading={isLoading}
            loadingText={t('common.loading')}
            options={macIdOptions}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label={t('device.management.bluetooth-sensors.sensors-table.mac-id')} />
            )}
          />
          <FormHelperText>This is the sensor being installed</FormHelperText>
        </Box>
        <Box display="flex" justifyContent="right">
          <Button sx={{ mt: 1, ml: 1 }} variant="outlined" color="secondary" size="medium" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            sx={{ mt: 1, ml: 1, whiteSpace: 'nowrap' }}
            type="submit"
            variant="outlined"
            color="primary"
            size="medium"
            disabled={isLoading}
            endIcon={isLoading ? <CircularProgress size={13} /> : null}
            onClick={handleClickSave}
          >
            {isLoading ? t('common.loading') : t('common.save')}
          </Button>
        </Box>
      </Box>
    );
  }
);

BluetoothSensorMacIdDialogContent.displayName = 'ChangeMacIdDialogContent';
