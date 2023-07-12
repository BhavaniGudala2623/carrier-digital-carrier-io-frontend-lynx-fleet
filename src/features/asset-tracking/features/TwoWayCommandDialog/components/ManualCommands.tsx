import Typography from '@carrier-io/fds-react/Typography';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import { useTranslation } from 'react-i18next';
import Select from '@carrier-io/fds-react/Select';
import { useFormikContext } from 'formik';
import Grid from '@carrier-io/fds-react/Grid';
import Box from '@carrier-io/fds-react/Box';
import Input from '@carrier-io/fds-react/Input';

import { CommandTypes } from '../constants';
import { TwoWayCommandFormState } from '../useTwoWayCommandForm';

import { CommandListItem } from './CommandListItem';
import { CompartmentControl } from './CompartmentControl';

interface TwoWayManualCommandsProps {
  applicableCommands: Set<string>;
  applicableCompartments: Set<string>;
}

export function TwoWayManualCommands({
  applicableCommands,
  applicableCompartments,
}: TwoWayManualCommandsProps) {
  const { t } = useTranslation();

  const { values, handleChange } = useFormikContext<TwoWayCommandFormState>();

  return (
    <>
      <Box>
        <Typography variant="subtitle1">{t('commands.manual-commands')}</Typography>
        <Typography variant="body2" color="textSecondary">
          {t('commands.dialog.manual-command-helper-text')}
        </Typography>
      </Box>
      <Grid container direction="column" sx={{ mt: 2.5 }}>
        <CompartmentControl
          compartmentIndex={1}
          hidden={!applicableCompartments.has('comp1')}
          showToggle={applicableCommands.has(CommandTypes.c1_toggle)}
          showInput={applicableCommands.has(CommandTypes.setpoint)}
          checkBoxDisabled={
            !applicableCommands.has(CommandTypes.c1_toggle) && !applicableCommands.has(CommandTypes.setpoint)
          }
        />
        <CompartmentControl
          compartmentIndex={2}
          hidden={!applicableCompartments.has('comp2')}
          showToggle={applicableCommands.has(CommandTypes.c2_toggle)}
          showInput={applicableCommands.has(CommandTypes.setpoint)}
          checkBoxDisabled={
            !applicableCommands.has(CommandTypes.c2_toggle) && !applicableCommands.has(CommandTypes.setpoint)
          }
        />
        <CompartmentControl
          compartmentIndex={3}
          hidden={!applicableCompartments.has('comp3')}
          showToggle={applicableCommands.has(CommandTypes.c3_toggle)}
          showInput={applicableCommands.has(CommandTypes.setpoint)}
          checkBoxDisabled={
            !applicableCommands.has(CommandTypes.c3_toggle) && !applicableCommands.has(CommandTypes.setpoint)
          }
        />
        {applicableCommands.has(CommandTypes.run_mode) && (
          <CommandListItem>
            <FormControlLabel
              control={
                <Checkbox name="run_mode_checked" checked={values.run_mode_checked} onChange={handleChange} />
              }
              label={t('asset.run-mode')}
            />

            <Select
              value={values.run_mode}
              name="run_mode"
              onChange={handleChange}
              disabled={!values.run_mode_checked}
              size="small"
              showBorder
              sx={{ width: 174 }}
              input={<Input hiddenLabel />}
            >
              <MenuItem value="Continuous">{t('asset.data.continuous')}</MenuItem>
              <MenuItem value="Start/Stop">{t('asset.data.start-stop')}</MenuItem>
            </Select>
          </CommandListItem>
        )}
        {applicableCommands.has(CommandTypes.defrost) && (
          <CommandListItem>
            <FormControlLabel
              control={
                <Checkbox name="defrost_checked" checked={values.defrost_checked} onChange={handleChange} />
              }
              label={t('commands.initiate-defrost')}
            />
          </CommandListItem>
        )}
      </Grid>
    </>
  );
}
