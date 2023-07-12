import { useMemo, useState } from 'react';
import { styled } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '@carrier-io/fds-react/Button';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import {
  Description,
  DescriptionProps,
  DescriptionVariants,
} from '@carrier-io/fds-react/patterns/Description';
import { toNumber } from 'lodash-es';
import { Place, History } from '@mui/icons-material';
import { DescriptionItemProps } from '@carrier-io/fds-react/patterns/Description/DescriptionItem';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { getAssetDataForPopup } from '../../utils/getAssetDataForPopup';
import { getTruFuelLevel } from '../../utils/getTruFuelLevel';
import { useAssetsPageDataContext } from '../../providers/AssetsPageDataProvider';
import { FreezerAlarmModal } from '../../../common/components/FreezerAlarmModal';
import { TwoWayCommandsButton } from '../TwoWayCommandsButton';
import { getAssetCoordinates } from '../../features/map/utils';

import { OperationMode } from './OperationMode';

import type { SnapshotDataEx } from '@/features/common';
import { Dialog, renderOperatingMode, sideRearDoorStatusFormatter } from '@/components';
import { formatDate, toUnit } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';
import { assetChipRenderer } from '@/components/formatters';
import { companyActionPayload } from '@/features/authorization';
import { getAuthTenantId } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { useGetAssetAddress } from '@/providers/AssetsAddress/context';
import { useApplicationContext } from '@/providers/ApplicationContext';

const MovementIcon = styled('div')({
  display: 'flex',
  whiteSpace: 'nowrap',
  alignItems: 'center',
});

const containerSx = {
  p: 2,
  flexGrow: 1,
  borderRadius: 1,
  backgroundColor: 'background.description',
};

export interface AssetDetailsDialogProps {
  assetId: string | null;
  onClose: () => void;
}

const DescriptionItem = ({ children, ...rest }: DescriptionItemProps) => (
  <Description.Item {...rest} TextProps={{ textAlign: 'right' }}>
    {children}
  </Description.Item>
);

export function AssetDetailsDialog({ assetId, onClose }: AssetDetailsDialogProps) {
  const tenantId = useAppSelector(getAuthTenantId);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = useRbac();
  const shouldSendTwoWayCmd = hasPermission(companyActionPayload('2WayCmd.send', tenantId));

  const { userSettings } = useUserSettings();
  const { temperature, timezone, dateFormat } = userSettings;
  const tempUnitText = ` (°${temperature})`;
  const { featureFlags } = useApplicationContext();
  const { filteredSnapshots: snapshots } = useAssetsPageDataContext();
  const selectedAssetSnapshot = useMemo(
    () => snapshots?.find((s) => s.asset?.id === assetId) ?? null,
    [assetId, snapshots]
  );

  const [modalSelectedAsset, setModalSelectedAsset] = useState<SnapshotDataEx | null>(null);

  const assetCoordinates = getAssetCoordinates(selectedAssetSnapshot);

  const assetAddress = useGetAssetAddress({
    longitude: assetCoordinates?.[0],
    latitude: assetCoordinates?.[1],
    address: selectedAssetSnapshot?.computedFields?.address,
  });

  const handleClose = () => {
    onClose();
  };

  const handleAlarmOpen = () => {
    setModalSelectedAsset(selectedAssetSnapshot);
  };

  const assetData = getAssetDataForPopup(selectedAssetSnapshot);
  const { device } = selectedAssetSnapshot ?? {};

  const formattedLastUpdated = assetData?.lastUpdated
    ? formatDate(toNumber(assetData?.lastUpdated) * 1000, dateFormat, {
        timezone,
        dateOptions: {
          variant: 'dateTime',
        },
      })
    : '';

  const numberOfAlarms = assetData?.alarms?.length || 0;

  let alarmDisplay: string;

  if (numberOfAlarms > 0) {
    if (numberOfAlarms === 1) {
      alarmDisplay = `${numberOfAlarms} ${t('notifications.active-alarm')}`;
    } else {
      alarmDisplay = `${numberOfAlarms} ${t('notifications.active-alarms')}`;
    }
  } else {
    alarmDisplay = t('notifications.no-alarms');
  }

  const alarmButton =
    numberOfAlarms > 0 ? (
      <Button
        sx={{
          backgroundColor: 'error.main',
          borderRadius: '4px',
          height: '20px',
          '&:hover': {
            backgroundColor: 'error.containedHoverBackground',
          },
        }}
        onClick={handleAlarmOpen}
      >
        {alarmDisplay}
      </Button>
    ) : (
      <Typography variant="body2" align="left" sx={{ marginBottom: '5px' }}>
        0 {t('common.alarms')}
      </Typography>
    );

  const movementDisplay = assetData.movement ? (
    <MovementIcon>
      <FiberManualRecordIcon
        sx={{
          fill: (theme) => theme.palette.success.main,
          width: '10px',
          height: '10px',
          marginRight: '5px',
        }}
      />
      <Typography variant="body2">{t('assets.asset.table.in-motion')}</Typography>
    </MovementIcon>
  ) : (
    <MovementIcon>
      <FiberManualRecordIcon
        sx={{
          fill: (theme) => theme.palette.warning.main,
          width: '10px',
          height: '10px',
          marginRight: '5px',
        }}
      />
      <Typography variant="body2">{t('assets.asset.table.stationary')}</Typography>
    </MovementIcon>
  );

  const powerModeDisplay = assetData?.powerMode ? (
    <Box sx={{ flex: 1 }}>{assetChipRenderer('computedFields.enginePowerMode', assetData?.powerMode, t)}</Box>
  ) : null;

  const controlModeDisplay = assetData?.controlMode ? (
    <Box sx={{ flex: 1 }}>
      {assetChipRenderer('computedFields.engineControlMode', assetData?.controlMode, t)}
    </Box>
  ) : null;

  const truMode1 = renderOperatingMode({ value: assetData?.compartment1?.truMode, t });
  const truMode2 = renderOperatingMode({ value: assetData?.compartment2?.truMode, t });
  const truMode3 = renderOperatingMode({ value: assetData?.compartment3?.truMode, t });

  const rearDoorDisplay = sideRearDoorStatusFormatter(
    {
      value: assetData?.rearDoor,
      data: { device },
    },
    'rearDoor',
    t
  );

  const sideDoorDisplay = sideRearDoorStatusFormatter(
    {
      value: assetData?.sideDoor,
      data: { device },
    },
    'sideDoor',
    t
  );

  const fuelLevelDisplay =
    getTruFuelLevel({
      freezerControlMode: assetData?.freezerControlMode,
      freezerFuelLevel: assetData?.freezerFuelLevel,
      freezerFuelLevelConfigured: assetData?.freezerFuelLevelConfigured,
      pluginFuelLevel: assetData?.pluginFuelLevel,
      pluginFuelLevelConfigured: assetData?.pluginFuelLevelConfigured,
      textNotAvailable: t('asset.data.n-a'),
    }) || '';

  const productFamilyDisplay =
    assetData?.productFamily || assetData?.productFamily === '' ? assetData?.productFamily : '-';

  const toUnitOrDefault = (value?: string | number | null) =>
    Number.isNaN(Number(value)) ? '' : toUnit(value as string | number, temperature);

  const descriptionProps: Partial<DescriptionProps> = {
    rowIndentCssUnit: 'rem',
    rowIndentValue: 0.5,
    variant: DescriptionVariants.HorizontalJustifiedWithNoDots,
    sx: { backgroundColor: 'background.description', overflowY: 'hidden' },
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={!!assetId}
        maxWidth="md"
        dialogTitle={assetData?.name ?? ''}
        content={
          <Box
            sx={{
              width: '38rem',
            }}
          >
            <Box display="flex" pb={1.5}>
              <Place sx={{ fontSize: '1rem', color: (theme) => theme.palette.action.active }} />
              <Typography variant="caption" pl={0.5}>
                {assetAddress}
              </Typography>
            </Box>
            <Box display="flex">
              <Box
                sx={{
                  width: '57%',
                  marginRight: '.5rem',
                }}
              >
                <Box sx={{ ...containerSx, height: '100%' }}>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <History sx={{ fontSize: '1rem', color: (theme) => theme.palette.action.active }} />
                    <Typography variant="caption">{`${t(
                      'assets.asset.table.last-updated'
                    )} ${formattedLastUpdated}`}</Typography>
                  </Box>
                  <Description {...descriptionProps} rowIndentValue={1}>
                    <DescriptionItem label={t('common.alarms')}>{alarmButton}</DescriptionItem>
                    <DescriptionItem
                      textContainerSx={{ justifyContent: 'flex-end', display: 'flex' }}
                      label={t('assets.asset.table.vehicle-moving')}
                    >
                      {movementDisplay}
                    </DescriptionItem>
                    <DescriptionItem label={t('assethistory.table.fuel-level')}>
                      {fuelLevelDisplay}
                    </DescriptionItem>
                    <DescriptionItem label={t('device.management.drawer.product-family')}>
                      {productFamilyDisplay}
                    </DescriptionItem>
                    <DescriptionItem label={t('assets.asset.table.power-mode')}>
                      {powerModeDisplay}
                    </DescriptionItem>
                    <DescriptionItem label={t('assets.asset.table.control-mode')}>
                      {controlModeDisplay}
                    </DescriptionItem>
                    <DescriptionItem label={t('assets.asset.table.rearDoor')}>
                      {rearDoorDisplay}
                    </DescriptionItem>
                    <DescriptionItem label={t('assets.asset.table.sideDoor')}>
                      {sideDoorDisplay}
                    </DescriptionItem>
                  </Description>
                </Box>
              </Box>
              <Box
                sx={{
                  width: '43%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '.5rem',
                }}
              >
                {(assetData?.compartment1?.setpoint ||
                  assetData?.compartment1?.return ||
                  assetData?.compartment1?.truMode) && (
                  <Box sx={containerSx}>
                    <Typography variant="subtitle2" pb={2}>
                      <b>{t('assets.asset.table.c1')}</b>
                    </Typography>
                    <Description {...descriptionProps}>
                      <DescriptionItem label={`${t('common.setpoint')}${tempUnitText}`}>
                        {toUnitOrDefault(assetData?.compartment1?.setpoint)}
                      </DescriptionItem>
                      <DescriptionItem label={`${t('common.return')}${tempUnitText}`}>
                        {toUnitOrDefault(assetData?.compartment1?.return)}
                      </DescriptionItem>
                    </Description>
                    <OperationMode truMode={truMode1} />
                  </Box>
                )}
                {featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE &&
                !assetData.compartmentConfig?.comp2Configured
                  ? null
                  : (assetData?.compartment2?.setpoint ||
                      assetData?.compartment2?.return ||
                      assetData?.compartment2?.truMode) && (
                      <Box sx={containerSx}>
                        <Typography variant="subtitle2" pb={2}>
                          <b>{t('assets.asset.table.c2')}</b>
                        </Typography>
                        <Description {...descriptionProps}>
                          <DescriptionItem label={`${t('common.setpoint')}${tempUnitText}`}>
                            {toUnitOrDefault(assetData?.compartment2?.setpoint)}
                          </DescriptionItem>
                          <DescriptionItem label={`${t('common.return')}${tempUnitText}`}>
                            {toUnitOrDefault(assetData?.compartment2?.return)}
                          </DescriptionItem>
                        </Description>
                        <OperationMode truMode={truMode2} />
                      </Box>
                    )}
                {featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE &&
                !assetData.compartmentConfig?.comp3Configured
                  ? null
                  : (assetData?.compartment3?.setpoint ||
                      assetData?.compartment3?.return ||
                      assetData?.compartment3?.truMode) && (
                      <Box sx={containerSx}>
                        <Typography variant="subtitle2" pb={2}>
                          <b>{t('assets.asset.table.c3')}</b>
                        </Typography>
                        <Description {...descriptionProps}>
                          <DescriptionItem label={`${t('common.setpoint')}${tempUnitText}`}>
                            {toUnitOrDefault(assetData?.compartment3?.setpoint)}
                          </DescriptionItem>
                          <DescriptionItem label={`${t('common.return')}${tempUnitText}`}>
                            {toUnitOrDefault(assetData?.compartment3?.return)}
                          </DescriptionItem>
                        </Description>
                        <OperationMode truMode={truMode3} />
                      </Box>
                    )}
              </Box>
            </Box>
          </Box>
        }
        actions={
          <Box>
            {shouldSendTwoWayCmd && (
              <TwoWayCommandsButton
                selectedAsset={selectedAssetSnapshot}
                testId="asset-details-send-two-way-command"
              >
                <span>{t('asset.command.send-two-way-command')}</span>
              </TwoWayCommandsButton>
            )}
            <Button
              sx={{
                ml: 2,
              }}
              onClick={() => {
                navigate(`/assets/${assetData?.id || ''}`);
              }}
              variant="outlined"
            >
              {t('common.view-details')}
            </Button>
          </Box>
        }
      />
      {modalSelectedAsset && (
        <FreezerAlarmModal selectedAsset={modalSelectedAsset} setModalSelectedAsset={setModalSelectedAsset} />
      )}
    </>
  );
}
