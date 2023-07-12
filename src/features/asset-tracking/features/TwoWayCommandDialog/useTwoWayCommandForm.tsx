import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { CommandElement, CommandKey } from '@carrier-io/lynx-fleet-types';

import { getSetpointValue, getStatus } from './utils';
import { CommandTypes } from './constants';

import type { SnapshotDataEx } from '@/features/common';
import { useAppDispatch } from '@/stores';
import { toCelsius } from '@/utils';
import { showError, showMessage } from '@/stores/actions';
import { useUserSettings } from '@/providers/UserSettings';
import { useApplicationContext } from '@/providers/ApplicationContext';

export interface TwoWayCommandFormState {
  c1_checked: boolean;
  c1_status: boolean;
  c1_temp: number;
  c2_checked: boolean;
  c2_status: boolean;
  c2_temp: number;
  c3_checked: boolean;
  c3_status: boolean;
  c3_temp: number;
  defrost_checked: boolean;
  run_mode_checked: boolean;
  run_mode: string;
}

export const useTwoWayCommandForm = ({ asset }: { asset: SnapshotDataEx | null }) => {
  const { t } = useTranslation();
  const { featureFlags } = useApplicationContext();
  const isCompToggleEnabled = featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE;
  const { userSettings } = useUserSettings();
  const { temperature } = userSettings;
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [inProgress, setInProgress] = useState(false);
  const [applicableCommands, setApplicableCommands] = useState<Set<string>>(new Set());
  const [applicableCompartments, setApplicableCompartments] = useState<Set<string>>(new Set());
  const setpoint1 = getSetpointValue(asset || {}, 1, temperature);
  const setpoint2 = getSetpointValue(asset || {}, 2, temperature);
  const setpoint3 = getSetpointValue(asset || {}, 3, temperature);

  const initialValues = {
    c1_checked: false,
    c1_status: getStatus(asset || {}, 1),
    c1_temp: setpoint1,
    c2_checked: false,
    c2_status: getStatus(asset || {}, 2),
    c2_temp: setpoint2,
    c3_checked: false,
    c3_status: getStatus(asset || {}, 3),
    c3_temp: setpoint3,
    defrost_checked: false,
    run_mode_checked: false,
    run_mode: (asset?.computedFields?.engineControlMode as string) || '',
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate: (values) => {
      const errors: { c1_temp?: string; c2_temp?: string; c3_temp?: string } = {};

      if (!Number.isInteger(values.c1_temp)) {
        errors.c1_temp = t('error.should-be-a-number');
      }

      if (!Number.isInteger(values.c2_temp)) {
        errors.c2_temp = t('error.should-be-a-number');
      }

      if (!Number.isInteger(values.c3_temp)) {
        errors.c3_temp = t('error.should-be-a-number');
      }

      return errors;
    },
    validateOnChange: true,
    onSubmit: (values) => {
      const deviceId = asset?.device?.id as string;
      const input: {
        key: CommandKey;
        deviceId: string;
        args: {
          element: CommandElement;
          floatValue?: number;
          booleanValue?: boolean;
          stringValue?: string;
        }[];
      }[] = [];
      let [setpoint1Send, setpoint2Send, setpoint3Send] = [values.c1_temp, values.c2_temp, values.c3_temp];
      if (temperature === 'F') {
        setpoint1Send = toCelsius(setpoint1Send);
        setpoint2Send = toCelsius(setpoint2Send);
        setpoint3Send = toCelsius(setpoint3Send);
      } else {
        setpoint1Send = Number(setpoint1Send);
        setpoint2Send = Number(setpoint2Send);
        setpoint3Send = Number(setpoint3Send);
      }

      if (values.c1_checked) {
        if (applicableCommands.has(CommandTypes.setpoint) && setpoint1Send !== initialValues.c1_temp) {
          // Only send setpoint if compartment is toggled on OR if toggle is not supported by the device
          if (!applicableCommands.has(CommandTypes.c1_toggle) || values.c1_status) {
            input.push({
              key: CommandTypes.setpoint,
              deviceId,
              args: [{ element: 'C1 Setpoint', floatValue: setpoint1Send }],
            });
          }
        }
        if (applicableCommands.has(CommandTypes.c1_toggle) && values.c1_status !== initialValues.c1_status) {
          input.push({
            key: CommandTypes.c1_toggle,
            deviceId,
            args: [{ element: 'Toggle Compartment', booleanValue: values.c1_status }],
          });
        }
      }
      if (values.c2_checked) {
        if (applicableCommands.has(CommandTypes.setpoint) && setpoint2Send !== initialValues.c2_temp) {
          // Only send setpoint if compartment is toggled on OR if toggle is not supported by the device
          if (!applicableCommands.has(CommandTypes.c2_toggle) || values.c2_status) {
            input.push({
              key: CommandTypes.setpoint,
              deviceId,
              args: [{ element: 'C2 Setpoint', floatValue: setpoint2Send }],
            });
          }
        }
        if (applicableCommands.has(CommandTypes.c2_toggle) && values.c2_status !== initialValues.c2_status) {
          input.push({
            key: CommandTypes.c2_toggle,
            deviceId,
            args: [{ element: 'Toggle Compartment', booleanValue: values.c2_status }],
          });
        }
      }
      if (values.c3_checked) {
        if (applicableCommands.has(CommandTypes.setpoint) && setpoint3Send !== initialValues.c3_temp) {
          // Only send setpoint if compartment is toggled on OR if toggle is not supported by the device
          if (!applicableCommands.has(CommandTypes.c3_toggle) || values.c3_status) {
            input.push({
              key: CommandTypes.setpoint,
              deviceId,
              args: [{ element: 'C3 Setpoint', floatValue: setpoint3Send }],
            });
          }
        }
        if (applicableCommands.has(CommandTypes.c3_toggle) && values.c3_status !== initialValues.c3_status) {
          input.push({
            key: CommandTypes.c3_toggle,
            deviceId,
            args: [{ element: 'Toggle Compartment', booleanValue: values.c3_status }],
          });
        }
      }

      if (applicableCommands.has(CommandTypes.defrost) && values.defrost_checked) {
        input.push({
          key: CommandTypes.defrost,
          deviceId,
          args: [],
        });
      }
      if (applicableCommands.has(CommandTypes.run_mode) && values.run_mode_checked && values.run_mode) {
        input.push({
          key: CommandTypes.run_mode,
          deviceId,
          args: [{ element: 'Run Mode', stringValue: values.run_mode }],
        });
      }

      if (input.length === 0) {
        return;
      }
      setInProgress(true);

      AssetService.sendCommand({ input })
        .then((res) => {
          if (res?.data?.sendCommands?.error) {
            showError(dispatch, `${res.data.sendCommands.error}`);
          } else {
            const onClickViewHistory = (e) => {
              e.preventDefault();
              navigate('/command-history');
            };
            showMessage(dispatch, t('commands.dialog.success'), 'info', {
              callback: onClickViewHistory,
              label: t('common.view-details'),
            });
          }
          setInProgress(false);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.debug(err);
          showError(dispatch, t('commands.dialog.error'));
          setInProgress(false);
        });
    },
  });

  useEffect(() => {
    if (!asset || !asset?.device?.id) {
      return;
    }
    setInProgress(true);
    AssetService.applicableCommands({
      input: { deviceId: asset.device.id as string, protocol: 'FLESPI-TELTONIKA-REEFER' },
    })
      .then((res) => {
        if (res?.data?.applicableCommands) {
          const availableCommands = new Set(res.data.applicableCommands.map((x) => x.commandType));
          const newApplicableCompartments = new Set(['comp1', 'comp2', 'comp3']);

          const { comp2Configured, comp3Configured } = asset.device?.compartmentConfig ?? {};

          if (asset?.flespiData?.freezer_comp1_mode === null) {
            newApplicableCompartments.delete('comp1');
          }
          if ((isCompToggleEnabled && !comp2Configured) || asset?.flespiData?.freezer_comp2_mode === null) {
            newApplicableCompartments.delete('comp2');
          }
          if ((isCompToggleEnabled && !comp3Configured) || asset?.flespiData?.freezer_comp3_mode === null) {
            newApplicableCompartments.delete('comp3');
          }

          setApplicableCommands(availableCommands);
          setApplicableCompartments(newApplicableCompartments);
        }
        setInProgress(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.debug(err);
      });
  }, [asset, dispatch, isCompToggleEnabled]);

  return { applicableCommands, applicableCompartments, inProgress, formik };
};
