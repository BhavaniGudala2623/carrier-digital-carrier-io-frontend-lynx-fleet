import Button from '@carrier-io/fds-react/Button';
import Grid from '@carrier-io/fds-react/Grid';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Paper from '@carrier-io/fds-react/Paper';
import { BluetoothService } from '@carrier-io/lynx-fleet-data-lib';
import { useRbac } from '@carrier-io/rbac-provider-react';
import AddIcon from '@mui/icons-material/Add';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAssociateState, useBulkCommissionState, useBulkState, useTabsState } from '../../providers';
import { DeviceManagementTabI } from '../../types';
import { AssociateDeviceWithTruDialog } from '../AssociateDeviceWithTruDialog';
import { BulkCommissionDevicesDialog } from '../BulkCommissionDevicesDialog';
import { BulkImportDevicesDialog } from '../BulkImportDevicesDialog';
import { CreateSingleDeviceDialog } from '../CreateSingleDeviceDialog';
import { AddInstallDevicesButton } from '../DeviceProvisioningTable/AddInstallDevicesButton';
import { DownloadReportConfirmDialog } from '../DownloadReportConfirmDialog';

import { BulkImportWirelessSensorDialog } from './BulkImportWirelessSensor';
import { GenerateReportDevices, GenerateReportDialog, GenerateReportWirelessSensors } from './GenerateReport';
import { PageTabs } from './PageTabs';
import { ProgressBarButton, ProgressDialog } from './ProgressDialog';

import { Dropdown } from '@/components';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';
import { useToggle } from '@/hooks';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { useAppDispatch, useAppSelector } from '@/stores';
import { showMessage } from '@/stores/actions';

const devicesTabGroupIds = ['DEVICES'];
const sensorsTabGroupIds = ['WIRELESS_SENSORS'];

export const LIMIT = 30;

export const DeviceManagementPageHeader = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    totalDeviceCount,
    totalDeviceCountLoading,
    totalBluetoothSensorsCount,
    setTotalBluetoothSensorsCount,
    totalBluetoothSensorsCountLoading,
    selectedTabId,
    setSelectedTabId,
  } = useTabsState();

  const isWirelessSensorsTab = selectedTabId === 'WIRELESS_SENSORS';
  const isDevicesTab = selectedTabId === 'DEVICES';

  const {
    isBulkLoading,
    resetBulkState,
    isImportStarted: isBulkStarted,
    isImportComplete: isBulkComplete,
    importDevicesState,
  } = useBulkState();

  const {
    isBulkCommissionLoading,
    resetBulkCommissionState,
    isImportStarted: isBulkCommissionStarted,
    isImportComplete: isBulkCommissionSComplete,
    importBulkCommissionDevicesState,
  } = useBulkCommissionState();

  const {
    resetAssociateState,
    isAssociateLoading,
    associateDevicesState,
    isImportComplete: isAssociateComplete,
    isImportStarted: isAssociateStarted,
  } = useAssociateState();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);

  const createAllowed = hasPermission(companyActionPayload('device.create', tenantId));
  const editAllowed = hasPermission(companyActionPayload('device.edit', tenantId));
  const batchEditAllowed = hasPermission(companyActionPayload('device.batchEdit', tenantId));

  const {
    value: bulkImportDialogOpen,
    toggleOn: handleBulkImportDialogOpen,
    toggleOff: handleBulkImportDialogClose,
  } = useToggle(false);

  const {
    value: confirmBulkReportDialogOpen,
    toggleOn: handleConfirmBulkReportDialogOpen,
    toggleOff: handleConfirmBulkReportDialogClose,
  } = useToggle(false);

  const {
    value: associateDeviceOpen,
    toggleOn: handleAssociateDeviceOpen,
    toggleOff: handleAssociateDeviceClose,
  } = useToggle(false);

  const {
    value: isGenerateReportOpen,
    toggleOn: handleGenerateReportOpen,
    toggleOff: handleGenerateReportClose,
  } = useToggle(false);

  const { featureFlags } = useApplicationContext();

  const isWirelessSensorsReportEnabled = featureFlags.REACT_APP_FEATURE_WIRELESS_SENSORS_GENERATE_REPORT;
  const isBulkImportWirelessSensorsEnabled = featureFlags.REACT_APP_FEATURE_BULK_IMPORT_WIRELESS_SENSORS;
  const isBulkCommissionDevicesEnabled = featureFlags.REACT_APP_FEATURE_BULK_COMMISSION_DEVICES;

  const handleClose = () => setAnchorEl(null);

  const handleClickAddInstallDevices = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    handleConfirmBulkReportDialogClose();
  };

  const handleOpenBulkImportDialog = () => {
    if (!isBulkLoading) {
      resetBulkState();
    }

    handleBulkImportDialogOpen();
    handleClose();
  };

  const handleOpenAssociateDeviceDialog = () => {
    if (!isAssociateLoading) {
      resetAssociateState();
    }

    handleAssociateDeviceOpen();
    handleClose();
  };

  useEffect(() => {
    BluetoothService.getBluetoothSensors({
      options: {
        pagination: { limit: LIMIT },
        sorting: { direction: 'ASC', field: 'assetName' },
      },
    }).then((response) => {
      const data = response.data.getBluetoothSensors;
      const payload = data?.payload;

      if (data.success && payload && payload !== null) {
        const { totalItems } = payload;
        setTotalBluetoothSensorsCount(totalItems);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bulkImportDialogOpen && importDevicesState) {
      if (isBulkStarted) {
        showMessage(
          dispatch,
          t('device.management.device.provisioning.import-in-progress'),
          'info',
          {
            label: t('device.management.device.provisioning.show-dialog'),
            callback: handleBulkImportDialogOpen,
          },
          60000
        );
      } else if (isBulkComplete) {
        showMessage(
          dispatch,
          t('device.management.device.provisioning.import-complete'),
          'info',
          {
            label: t('device.management.device.provisioning.show-details'),
            callback: handleBulkImportDialogOpen,
          },
          600000,
          handleConfirmBulkReportDialogOpen
        );
      }
    }
  }, [
    importDevicesState,
    dispatch,
    handleBulkImportDialogOpen,
    isAssociateComplete,
    isBulkStarted,
    bulkImportDialogOpen,
    t,
    isBulkComplete,
    handleConfirmBulkReportDialogOpen,
  ]);

  useEffect(() => {
    if (!associateDeviceOpen && associateDevicesState) {
      if (isAssociateStarted) {
        showMessage(
          dispatch,
          t('device.management.device.provisioning.import-in-progress'),
          'info',
          {
            label: t('device.management.device.provisioning.show-dialog'),
            callback: handleAssociateDeviceOpen,
          },
          60000
        );
      } else if (isAssociateComplete) {
        showMessage(
          dispatch,
          t('device.management.device.provisioning.import-complete'),
          'info',
          {
            label: t('device.management.device.provisioning.show-details'),
            callback: handleAssociateDeviceOpen,
          },
          600000,
          handleConfirmBulkReportDialogOpen
        );
      }
    }
  }, [
    importDevicesState,
    dispatch,
    handleBulkImportDialogOpen,
    isAssociateComplete,
    isAssociateStarted,
    bulkImportDialogOpen,
    t,
    isBulkComplete,
    associateDeviceOpen,
    associateDevicesState,
    handleAssociateDeviceOpen,
    handleConfirmBulkReportDialogOpen,
  ]);

  const handleResetDialog = (type: 'associate' | 'bulk') => {
    if (type === 'associate') {
      resetAssociateState();
    }

    if (type === 'bulk') {
      resetBulkState();
    }

    handleConfirmBulkReportDialogClose();
  };

  const {
    value: openCreateSingleDeviceDialog,
    toggleOn: handleOpenCreateSingleDeviceDialog,
    toggleOff: handleCloseCreateSingleDeviceDialog,
  } = useToggle(false);

  const handleCreateSingleDeviceMenuItem = () => {
    handleOpenCreateSingleDeviceDialog();
    setAnchorEl(null);
  };

  const {
    value: bulkCommissionDialogOpen,
    toggleOn: handleBulkCommissionDevicesOpen,
    toggleOff: handleBulkCommissionDevicesClose,
  } = useToggle(false);

  const {
    value: isBulkImportWirelessSensorsDialogOpen,
    toggleOn: handleBulkImportWirelessSensorsDialogOpen,
    toggleOff: handleBulkImportWirelessSensorsDialogClose,
  } = useToggle(false);

  const {
    value: isProgressDialogOpen,
    toggleOn: handleProgressDialogOpen,
    toggleOff: handleProgressDialogClose,
  } = useToggle(false);

  const {
    value: isProgressBarButtonOpen,
    toggleOn: handleProgressBarButtonOpen,
    toggleOff: handleProgressBarButtonClose,
  } = useToggle(false);

  const hideProgressDialog = useCallback(() => {
    handleProgressDialogClose();
    handleProgressBarButtonOpen();
  }, [handleProgressBarButtonOpen, handleProgressDialogClose]);

  const resumeProgressDialog = useCallback(() => {
    handleProgressBarButtonClose();
    handleProgressDialogOpen();
  }, [handleProgressBarButtonClose, handleProgressDialogOpen]);

  const handleAssociateTruCompany = () => {
    if (!isBulkCommissionLoading) {
      resetBulkCommissionState();
    }
    handleBulkCommissionDevicesOpen();
    handleClose();
  };

  const tabs: DeviceManagementTabI[] = useMemo(
    () => [
      {
        id: 'DEVICES',
        label: t('device.management.device.provisioning.devices'),
        itemsCount: totalDeviceCount,
        isLoading: totalDeviceCountLoading,
      },
      {
        id: 'WIRELESS_SENSORS',
        label: t('device.management.bluetooth-sensors.wireless-sensors'),
        itemsCount: totalBluetoothSensorsCount,
        isLoading: totalBluetoothSensorsCountLoading,
      },
    ],
    [
      t,
      totalBluetoothSensorsCount,
      totalBluetoothSensorsCountLoading,
      totalDeviceCount,
      totalDeviceCountLoading,
    ]
  );

  const devicesTabs = useMemo(
    () => devicesTabGroupIds.map((tabId) => tabs.find((tab) => tab.id === tabId) as DeviceManagementTabI),
    [tabs]
  );

  const sensorsTabs = useMemo(
    () => sensorsTabGroupIds.map((tabId) => tabs.find((tab) => tab.id === tabId) as DeviceManagementTabI),
    [tabs]
  );

  useEffect(() => {
    if (!bulkCommissionDialogOpen && importBulkCommissionDevicesState) {
      if (isBulkCommissionStarted) {
        showMessage(
          dispatch,
          t('device.management.device.provisioning.import-in-progress'),
          'info',
          {
            label: t('device.management.device.provisioning.show-dialog'),
            callback: handleBulkCommissionDevicesOpen,
          },
          60000
        );
      } else if (isBulkCommissionSComplete) {
        showMessage(
          dispatch,
          t('device.management.device.provisioning.import-complete'),
          'info',
          {
            label: t('device.management.device.provisioning.show-details'),
            callback: handleBulkCommissionDevicesOpen,
          },
          600000,
          handleConfirmBulkReportDialogOpen
        );
      }
    }
  }, [
    importBulkCommissionDevicesState,
    dispatch,
    handleBulkCommissionDevicesOpen,
    isBulkCommissionSComplete,
    isBulkCommissionStarted,
    bulkCommissionDialogOpen,
    t,
    handleConfirmBulkReportDialogOpen,
  ]);

  const renderGenerateReportDialog = () => {
    let dialogTitle;
    let contentContainer;

    if (isDevicesTab) {
      dialogTitle = 'device.management.generate-commissioning-report';
      contentContainer = <GenerateReportDevices onClose={handleGenerateReportClose} />;
    } else {
      dialogTitle = 'device.management.generate-report-wireless-sensors';
      contentContainer = <GenerateReportWirelessSensors onClose={handleGenerateReportClose} />;
    }

    return (
      <GenerateReportDialog
        onClose={handleGenerateReportClose}
        content={contentContainer}
        dialogTitle={dialogTitle}
      />
    );
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        '&.MuiPaper-rounded': { borderRadius: 0, borderTopLeftRadius: 8 },
      }}
      variant="outlined"
    >
      <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
        <Grid display="flex" item>
          <PageTabs tabs={devicesTabs} selectedTabId={selectedTabId} onTabChanged={setSelectedTabId} />
          <PageTabs tabs={sensorsTabs} selectedTabId={selectedTabId} onTabChanged={setSelectedTabId} />
        </Grid>

        {isDevicesTab && (
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={handleGenerateReportOpen}
              sx={{ mr: 1 }}
            >
              {t('device.management.generate-report')}
            </Button>
            {(createAllowed || editAllowed || batchEditAllowed) && (
              <Dropdown
                handleClose={handleClose}
                anchorEl={anchorEl}
                trigger={<AddInstallDevicesButton onClick={handleClickAddInstallDevices} />}
              >
                {createAllowed && (
                  <MenuItem
                    onClick={handleOpenBulkImportDialog}
                    disabled={isBulkLoading || isAssociateLoading}
                  >
                    {t('device.management.drawer.bulk-import-devices')}
                  </MenuItem>
                )}
                {createAllowed && (
                  <MenuItem onClick={handleCreateSingleDeviceMenuItem}>
                    {t('device.management.drawer.single-device')}
                  </MenuItem>
                )}
                {batchEditAllowed && (
                  <MenuItem
                    onClick={handleOpenAssociateDeviceDialog}
                    disabled={isBulkLoading || isAssociateLoading}
                  >
                    {t('device.management.drawer.associate-device-with-tru')}
                  </MenuItem>
                )}

                {editAllowed && isBulkCommissionDevicesEnabled && (
                  <MenuItem onClick={handleAssociateTruCompany}>
                    {t('device.management.device.provisioning.bulk-commission-devices')}
                  </MenuItem>
                )}
              </Dropdown>
            )}
          </Grid>
        )}

        {isWirelessSensorsTab && (
          <Grid item>
            {isWirelessSensorsReportEnabled && (
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={handleGenerateReportOpen}
                sx={{ mr: 1 }}
              >
                {t('device.management.generate-report')}
              </Button>
            )}
            {isBulkImportWirelessSensorsEnabled && (
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={handleBulkImportWirelessSensorsDialogOpen}
                sx={{ mr: 1 }}
                startIcon={<AddIcon />}
              >
                {t('device.management.bluetooth-sensors.bulk-import.wireless-sensors')}
              </Button>
            )}
          </Grid>
        )}

        {bulkImportDialogOpen && <BulkImportDevicesDialog handleClose={handleBulkImportDialogClose} />}
        {bulkCommissionDialogOpen && (
          <BulkCommissionDevicesDialog handleClose={handleBulkCommissionDevicesClose} />
        )}
        {confirmBulkReportDialogOpen &&
          (importDevicesState || associateDevicesState || importBulkCommissionDevicesState) && (
            <DownloadReportConfirmDialog
              reportLink={
                importDevicesState?.taskResult?.reportLink ??
                associateDevicesState?.taskResult?.reportLink ??
                importBulkCommissionDevicesState?.taskResult?.reportLink
              }
              handleResetDialog={() => handleResetDialog('bulk')}
            />
          )}
        {openCreateSingleDeviceDialog && (
          <CreateSingleDeviceDialog onClose={handleCloseCreateSingleDeviceDialog} />
        )}
        {associateDeviceOpen && <AssociateDeviceWithTruDialog handleClose={handleAssociateDeviceClose} />}
        {isGenerateReportOpen && renderGenerateReportDialog()}
        {isBulkImportWirelessSensorsDialogOpen && (
          <BulkImportWirelessSensorDialog
            onClose={handleBulkImportWirelessSensorsDialogClose}
            onImport={handleProgressDialogOpen}
          />
        )}
        {isProgressDialogOpen && (
          <ProgressDialog onClose={handleProgressDialogClose} onHide={hideProgressDialog} />
        )}
        {isProgressBarButtonOpen && <ProgressBarButton onClose={resumeProgressDialog} />}
      </Grid>
    </Paper>
  );
};

DeviceManagementPageHeader.displayName = 'DeviceManagementPageHeader';
