import { ChangeEvent, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import Switch from '@carrier-io/fds-react/Switch';
import Typography from '@carrier-io/fds-react/Typography';
import Button from '@carrier-io/fds-react/Button';
import TextField from '@carrier-io/fds-react/TextField';

import { Dialog } from '@/components';
import { useToggle } from '@/hooks';

interface ContractViewProps {
  usesBluetoothSensors: boolean;
  handleToggle: () => void;
  checkBoxChecked: boolean;
  toggleChecked: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  handleChangeReplacementPeriod: (value: number) => void;
  countryLabel: string;
  defaultReplacementPeriod: number;
  replacementPeriod: number;
  editMode: boolean;
}
export const ContractView = ({
  usesBluetoothSensors,
  handleToggle,
  checkBoxChecked,
  toggleChecked,
  countryLabel,
  replacementPeriod,
  defaultReplacementPeriod,
  handleChangeReplacementPeriod,
  editMode,
}: ContractViewProps) => {
  const { t } = useTranslation();
  const { value: openDialog, toggleOn: handleOpenDialog, toggleOff: handleCloseDialog } = useToggle(false);
  const [isApproved, setApproved] = useState(false);
  const [cachedValue, setCachedValue] = useState(0);

  const handleSave = () => {
    handleCloseDialog();
    setApproved(true);
    handleChangeReplacementPeriod(cachedValue);
  };

  const handleChangeNumberInput = (event) => {
    if (event.target.value > defaultReplacementPeriod - 1) {
      return;
    }
    if (editMode && !isApproved) {
      setCachedValue(event.target.value);

      return handleOpenDialog();
    }

    return handleChangeReplacementPeriod(event.target.value);
  };

  return (
    <Box width="70%">
      <Box>
        <FormControlLabel
          control={
            <Switch
              size="medium"
              key=""
              disabled={false}
              checked={usesBluetoothSensors}
              onChange={handleToggle}
              sx={{ mr: 2, ml: 1 }}
              data-testid="bluetooth-sensors-use"
            />
          }
          label={t('company.management.company.contract.bluetooth-sensors-use-notifications')}
          sx={{ mb: 3 }}
        />
      </Box>
      <Typography
        variant="body1"
        color="theme.palette.text.disabled"
        sx={{
          mb: 3,
          color: (theme) => (usesBluetoothSensors ? theme.palette.text.primary : theme.palette.text.disabled),
        }}
      >
        {t('company.management.company.contract.bluetooth-sensors-recommended-guideline')}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          color: (theme) => (usesBluetoothSensors ? theme.palette.text.primary : theme.palette.text.disabled),
        }}
      >
        <Trans
          i18nKey="company.management.default-replacement-schedule"
          values={{
            country: countryLabel,
            months: defaultReplacementPeriod,
          }}
        />
      </Typography>
      <Box display="flex" alignItems="center">
        <FormControlLabel
          disabled={!usesBluetoothSensors}
          control={
            <Checkbox
              checked={checkBoxChecked}
              onChange={toggleChecked}
              name=""
              color="primary"
              data-testid="bluetooth-sensors-replacement"
            />
          }
          label={t('company.management.company.contract.bluetooth-sensors-replacement-schedule')}
        />
        <TextField
          id="months"
          name="months"
          type="number"
          value={replacementPeriod}
          disabled={!checkBoxChecked || !usesBluetoothSensors}
          showBorder
          onChange={handleChangeNumberInput}
          helperText={t('common.month.plural')}
          size="small"
          fullWidth
          sx={{
            m: 0,
            width: 200,
            '& .MuiInputBase-root': {
              color: (theme) =>
                checkBoxChecked && usesBluetoothSensors
                  ? theme.palette.text.primary
                  : theme.palette.text.disabled,
              position: 'relative',
              margin: 0,
            },
            '& .MuiFormHelperText-root': {
              color: (theme) =>
                checkBoxChecked && usesBluetoothSensors
                  ? theme.palette.text.primary
                  : theme.palette.text.disabled,
              fontSize: 14,
              position: 'absolute',
              bottom: 12,
              left: replacementPeriod > 9 ? 32 : 26,
            },
          }}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        dialogTitle={t(
          'company.management.company.contract.changing-replacement-schedule-confirmation.dialog-title'
        )}
        fullWidth
        maxWidth="sm"
        content={
          <Box>
            <Typography variant="body1">
              {t(
                'company.management.company.contract.changing-replacement-schedule-confirmation.dialog-message'
              )}
            </Typography>
          </Box>
        }
        actions={
          <>
            <Button color="secondary" variant="outlined" onClick={handleCloseDialog}>
              {t('common.cancel')}
            </Button>
            <Button color="primary" variant="outlined" onClick={handleSave} disabled={false}>
              {t('common.confirm')}
            </Button>
          </>
        }
      />
    </Box>
  );
};
