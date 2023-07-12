import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { ConfigureDeviceInput } from '@carrier-io/lynx-fleet-types';
import { Description } from '@carrier-io/fds-react/patterns/Description';
import { DescriptionItem } from '@carrier-io/fds-react/patterns/Description/DescriptionItem';
import Button from '@carrier-io/fds-react/Button';
import Grid from '@carrier-io/fds-react/Grid';
import Divider from '@carrier-io/fds-react/Divider';
import Box from '@carrier-io/fds-react/Box';
import { Alert, CircularProgress } from '@carrier-io/fds-react';
import { Error } from '@mui/icons-material';
import { TFunction } from 'i18next';

import {
  updateDeviceConfigAction,
  setConfigStatus,
  setConfigTask,
  setFirmwareTask,
  clearState,
  checkAndUpdateTaskStatusAction,
} from '../../../stores';
import { DeviceCommissioningFormValues } from '../../../types';
import { DeviceCommissioningContext } from '../../../providers';
import { useConfigStatus } from '../../../hooks';
import {
  CONFIGURATION_STATUS_DEFAULT,
  CONFIGURATION_STATUS_FAILED,
  CONFIG_UPDATE_REQUIRED,
  CONFIG_UPDATED,
  FIRMWARE_UPDATE_REQUIRED,
  FIRMWARE_UPDATED,
  FOTAWEB_TASK_STATUS_PENDING,
  FOTAWEB_TASK_STATUS_RUNNING,
} from '../../../constants';
import { getTruInfoByFotawebGroup } from '../../../utils';
import { ConfigurationStatus } from '../../ConfigurationStatus';
import { FirmwareStatus } from '../../FirmwareStatus';
import { GeneralStatus } from '../../GeneralStatus';

import { GSMWeakSignalWarning } from './GSMWeakSignalWarning';

import { FormSelect, LynxFormLabel, LynxFormControl } from '@/components';
import { useAppDispatch } from '@/stores';
import { useUserSettings } from '@/providers/UserSettings';
import { formatDate } from '@/utils';

const getSignalStrengthDisplayValue = (value: number, isWeak: boolean, translate: TFunction) =>
  isWeak
    ? translate('device.management.device.provisioning.gsm-weak-signal', {
        value,
      })
    : `${value}%`;

export const DeviceSection = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, handleBlur, errors } = useFormikContext<DeviceCommissioningFormValues>();
  const { device, fotaweb } = values;

  const { permissions, snapshot, isLoading, fotawebDevice, fotawebGroups } =
    useContext(DeviceCommissioningContext);
  const { deviceEditAllowed } = permissions;

  const dispatch = useAppDispatch();
  const { configStatus, configTask, firmwareTask, isLoading: isStatusLoading } = useConfigStatus();
  const { userSettings } = useUserSettings();
  const { timezone, dateFormat } = userSettings;
  const configTaskRunning = [FOTAWEB_TASK_STATUS_PENDING, FOTAWEB_TASK_STATUS_RUNNING].includes(
    configTask?.status
  );
  const firmwareTaskRunning = [FOTAWEB_TASK_STATUS_PENDING, FOTAWEB_TASK_STATUS_RUNNING].includes(
    firmwareTask?.status
  );
  const isFotawebTaskRunning = configTaskRunning || firmwareTaskRunning;

  const isInfoDisabled = isFotawebTaskRunning;

  const handleFotawebGroupChange = (event) => {
    const groupName = event.target.value;

    if (groupName && fotawebGroups) {
      const selectedGroup = fotawebGroups?.find((group) => group.name === groupName);

      const { configuration, firmware } = selectedGroup || {};

      const confStatus =
        configuration?.name === fotawebDevice?.current_configuration
          ? CONFIG_UPDATED
          : CONFIG_UPDATE_REQUIRED;

      dispatch(
        setConfigTask({
          status: confStatus,
        })
      );

      const firmwareStatus =
        fotawebDevice?.current_firmware && firmware?.name?.includes(fotawebDevice.current_firmware)
          ? FIRMWARE_UPDATED
          : FIRMWARE_UPDATE_REQUIRED;

      dispatch(
        setFirmwareTask({
          status: firmwareStatus,
        })
      );

      setFieldValue('fotaweb.groupId', selectedGroup?.id);
      setFieldValue('fotaweb.groupName', selectedGroup?.name);
      setFieldValue('fotaweb.groupConf', configuration?.name);
      setFieldValue('fotaweb.groupFirmware', firmware?.name);

      const { productFamily, truControlSystemType } = getTruInfoByFotawebGroup(
        selectedGroup?.name,
        device.productFamily,
        snapshot?.flespiData?.freezer_control_mode
      );
      setFieldValue('device.productFamily', productFamily);
      setFieldValue('device.truControlSystemType', truControlSystemType);
    }
  };

  useEffect(() => {
    dispatch(setConfigStatus(device?.configTaskStatus || { status: CONFIGURATION_STATUS_DEFAULT }));
    dispatch(checkAndUpdateTaskStatusAction({ id: device.id, t, showSuccessMessage: false }));

    return () => {
      dispatch(clearState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device.id]);

  useEffect(() => {
    if (!snapshot.device?.imei || !isFotawebTaskRunning) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      dispatch(checkAndUpdateTaskStatusAction({ id: device.id, t }));
    }, 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFotawebTaskRunning]);

  const handleConfigureDeviceClick = () => {
    const input: ConfigureDeviceInput = {
      id: values.device.id,
      productFamily: values.device.productFamily,
      truControlSystemType: values.device.truControlSystemType,
      fotawebGroupId: values.fotaweb.groupId,
    };

    dispatch(updateDeviceConfigAction(input));
  };

  const isGSMSignalWeak = snapshot.GSMSignalStrength === 'weak';

  const firmwareTaskUpdateDate = firmwareTask?.lastModified
    ? formatDate(firmwareTask.lastModified, dateFormat, { timezone })
    : '-';

  const configTaskUpdateDate = configTask?.lastModified
    ? formatDate(configTask.lastModified, dateFormat, { timezone })
    : '-';

  const snapshotDeviceData = useMemo(
    () => [
      {
        label: 'device.management.device-gsm-network',
        title: snapshot.flespiData?.gsm_network_type,
      },
      {
        label: 'device.management.device-gsm-signal-strength',
        title:
          snapshot.flespiData?.gsm_signal_level || snapshot.flespiData?.gsm_signal_level === 0
            ? getSignalStrengthDisplayValue(snapshot.flespiData?.gsm_signal_level, isGSMSignalWeak, t)
            : null,
        sx: isGSMSignalWeak ? { color: '#FFC107' } : {},
      },
      {
        label: '',
        title: '',
      },
      {
        label: 'device.management.drawer.device-serial-number',
        title: snapshot.device?.serialNumber,
      },
      {
        label: 'device.management.drawer.device-IMEI-number',
        title: snapshot.device?.imei,
      },
      {
        label: 'device.management.drawer.device-ICCID',
        title: snapshot.device?.iccid,
      },
    ],
    [
      snapshot.device?.iccid,
      snapshot.device?.imei,
      snapshot.device?.serialNumber,
      snapshot.flespiData?.gsm_network_type,
      snapshot.flespiData?.gsm_signal_level,
      isGSMSignalWeak,
      t,
    ]
  );

  const getSnapshotDeviceData = () =>
    snapshotDeviceData.map((deviceField) => (
      <Grid item xs={4} pb={1} key={deviceField.label}>
        <Description rowIndentCssUnit="rem" rowIndentValue={1.25}>
          <DescriptionItem label={t(deviceField.label)}>
            <LynxFormLabel variant="subtitle1" title={deviceField.title ?? '-'} sx={deviceField.sx} />
          </DescriptionItem>
        </Description>
      </Grid>
    ));

  return (
    <Grid container spacing={2.5} px={1} pb={1}>
      <Grid item xs={12}>
        {configStatus.status === CONFIGURATION_STATUS_FAILED && (
          <Alert
            icon={<Error fontSize="inherit" sx={{ color: 'error.main' }} />}
            severity="error"
            sx={{
              py: 2,
              backgroundColor: 'secondary.light',
              color: 'secondary.dark',
            }}
          >
            {`${t('device.management.device.info.device-configuration-error')} ${configStatus.error}`}
          </Alert>
        )}

        <Divider variant="fullWidth" light sx={{ mb: 0.5 }} />
      </Grid>

      <Grid item container xs={12} mb={0.5} spacing={2.5}>
        <>
          {getSnapshotDeviceData()}
          <Divider variant="fullWidth" sx={{ width: '100%', mt: 0.5 }} light />
        </>
      </Grid>

      <Grid item container xs={12} spacing={2.5}>
        <Grid item xs={4}>
          <Box mb={1}>
            <LynxFormLabel
              variant="subtitle1"
              title={t('device.management.drawer.configuration-settings')}
              sx={{ mb: 0.8 }}
            />
            <FormSelect
              name="fotaweb.groupName"
              placeholder={t('device.management.drawer.unit-type-options')}
              value={fotaweb.groupName}
              onChange={handleFotawebGroupChange}
              options={fotawebGroups?.map((item) => item.name)}
              onBlur={handleBlur}
              error={!!errors.fotaweb?.groupId}
              helperText={errors.fotaweb?.groupId}
              sx={{ minWidth: 200, maxWidth: 380 }}
              readOnly={isInfoDisabled || !deviceEditAllowed}
              required
            />
          </Box>
          <LynxFormLabel variant="body2" title={t('device.management.drawer.status')} />
          <LynxFormControl sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between" maxWidth={380}>
              <GeneralStatus
                firmwareStatus={firmwareTask?.status}
                configStatus={configTask?.status}
                isSameGroup={fotaweb?.groupId === fotawebDevice?.group_id}
              />
              <Button
                variant="outlined"
                color={isGSMSignalWeak ? 'warning' : 'secondary'}
                size="small"
                onClick={handleConfigureDeviceClick}
                disabled={!values.fotaweb.groupId || isInfoDisabled || isLoading || !deviceEditAllowed}
                sx={{ ml: 1 }}
              >
                {t('device.management.drawer.configure-device')}
              </Button>
            </Box>
          </LynxFormControl>
          {isGSMSignalWeak && <GSMWeakSignalWarning />}
        </Grid>

        <Grid item xs={4}>
          <LynxFormLabel
            variant="subtitle1"
            title={t('device.management.drawer.firmware')}
            sx={{ mb: 0.8 }}
          />
          <Description rowIndentCssUnit="rem" rowIndentValue={1.25} sx={{ mb: 1 }}>
            <DescriptionItem label={t('device.management.drawer.firmware-version')}>
              <LynxFormLabel variant="subtitle1" title={fotawebDevice?.current_firmware ?? 'Empty'} />
            </DescriptionItem>
          </Description>

          <Description rowIndentCssUnit="rem" rowIndentValue={1.25}>
            <DescriptionItem label={t('device.management.drawer.last-update')}>
              <LynxFormLabel variant="subtitle1" title={firmwareTaskUpdateDate} />
            </DescriptionItem>
          </Description>
          <Description rowIndentCssUnit="rem" rowIndentValue={1.25}>
            <DescriptionItem label={t('common.status')}>
              {isStatusLoading && !firmwareTask?.status ? (
                <CircularProgress size={15} sx={{ mt: 0.5, justifyContent: 'flex-start' }} />
              ) : (
                <FirmwareStatus status={firmwareTask?.status} />
              )}
            </DescriptionItem>
          </Description>
        </Grid>

        <Grid item xs={4}>
          <LynxFormLabel
            variant="subtitle1"
            title={t('device.management.drawer.configuration-file')}
            sx={{ mb: 0.8 }}
          />

          <Description rowIndentCssUnit="rem" rowIndentValue={1.25} sx={{ mb: 1 }}>
            <DescriptionItem label={t('device.management.drawer.configuration-file-version')}>
              <LynxFormLabel variant="subtitle1" title={fotawebDevice?.current_configuration ?? '-'} />
            </DescriptionItem>
          </Description>

          <Description rowIndentCssUnit="rem" rowIndentValue={1.25}>
            <DescriptionItem label={t('device.management.drawer.last-update')}>
              <LynxFormLabel variant="subtitle1" title={configTaskUpdateDate} />
            </DescriptionItem>
          </Description>
          <Description rowIndentCssUnit="rem" rowIndentValue={1.25}>
            <DescriptionItem label={t('common.status')}>
              {isStatusLoading && !configTask?.status ? (
                <CircularProgress size={15} sx={{ mt: 0.5, justifyContent: 'flex-start' }} />
              ) : (
                <ConfigurationStatus status={configTask?.status} />
              )}
            </DescriptionItem>
          </Description>
        </Grid>
      </Grid>
    </Grid>
  );
};

DeviceSection.displayName = 'DeviceSection';
