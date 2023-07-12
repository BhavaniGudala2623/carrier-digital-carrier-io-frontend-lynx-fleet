import { MouseEvent, useEffect, useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { useBulkState, useAssociateState, useBulkCommissionState } from '../../providers';
import { BulkImportDevicesDialog } from '../BulkImportDevicesDialog';
import { DownloadReportConfirmDialog } from '../DownloadReportConfirmDialog';
import { AssociateDeviceWithTruDialog } from '../AssociateDeviceWithTruDialog';
import { CreateSingleDeviceDialog } from '../CreateSingleDeviceDialog';
import { BulkCommissionDevicesDialog } from '../BulkCommissionDevicesDialog';
import { GenerateReportDevices, GenerateReportDialog } from '../DeviceManagementPageHeader';

import { AddInstallDevicesButton } from './AddInstallDevicesButton';

import { Dropdown } from '@/components';
import { useToggle } from '@/hooks';
import { showMessage } from '@/stores/actions';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';

export interface DeviceProvisioningTableHeaderProps {
  totalItems: number;
  totalItemsLoading: boolean;
}

export const DeviceProvisioningTableHeader = ({
  totalItems,
  totalItemsLoading,
}: DeviceProvisioningTableHeaderProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    isBulkLoading,
    resetBulkState,
    isImportStarted: isBulkStarted,
    isImportComplete: isBulkComplete,
    importDevicesState,
  } = useBulkState();
  const {
    resetAssociateState,
    isAssociateLoading,
    associateDevicesState,
    isImportComplete: isAssociateComplete,
    isImportStarted: isAssociateStarted,
  } = useAssociateState();

  const {
    isBulkCommissionLoading,
    resetBulkCommissionState,
    isImportStarted: isBulkCommissionStarted,
    isImportComplete: isBulkCommissionSComplete,
    importBulkCommissionDevicesState,
  } = useBulkCommissionState();

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
    value: generateCommissioningReportOpen,
    toggleOn: handleGenerateCommissioningReportOpen,
    toggleOff: handleGenerateCommissioningReportClose,
  } = useToggle(false);

  const {
    value: bulkCommissionDialogOpen,
    toggleOn: handleBulkCommissionDevicesOpen,
    toggleOff: handleBulkCommissionDevicesClose,
  } = useToggle(false);

  const handleClose = () => setAnchorEl(null);

  const handleAssociateTruCompany = () => {
    if (!isBulkCommissionLoading) {
      resetBulkCommissionState();
    }
    handleBulkCommissionDevicesOpen();
    handleClose();
  };

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

  return (
    <>
      {totalItemsLoading ? (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" color="text.secondary">
            {t('device.management.device.total-devices-loading')}
          </Typography>
          <CircularProgress sx={{ ml: 1 }} size={16} />
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          {t('device.management.device.total-devices', { count: totalItems })}
        </Typography>
      )}

      <Box>
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          onClick={handleGenerateCommissioningReportOpen}
          sx={{ mr: 1 }}
        >
          {t('device.management.generate-commissioning-report')}
        </Button>
        {(createAllowed || editAllowed || batchEditAllowed) && (
          <Dropdown
            handleClose={handleClose}
            anchorEl={anchorEl}
            trigger={<AddInstallDevicesButton onClick={handleClickAddInstallDevices} />}
          >
            {createAllowed && (
              <MenuItem onClick={handleOpenBulkImportDialog} disabled={isBulkLoading || isAssociateLoading}>
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
            {editAllowed && (
              <MenuItem onClick={handleAssociateTruCompany}>
                {t('device.management.device.provisioning.bulk-commission-devices')}
              </MenuItem>
            )}
          </Dropdown>
        )}
      </Box>

      {bulkImportDialogOpen && <BulkImportDevicesDialog handleClose={handleBulkImportDialogClose} />}
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
      {bulkCommissionDialogOpen && (
        <BulkCommissionDevicesDialog handleClose={handleBulkCommissionDevicesClose} />
      )}
      {openCreateSingleDeviceDialog && (
        <CreateSingleDeviceDialog onClose={handleCloseCreateSingleDeviceDialog} />
      )}
      {associateDeviceOpen && <AssociateDeviceWithTruDialog handleClose={handleAssociateDeviceClose} />}
      {generateCommissioningReportOpen && (
        <GenerateReportDialog
          onClose={handleGenerateCommissioningReportClose}
          dialogTitle="device.management.generate-commissioning-report"
          content={<GenerateReportDevices onClose={handleGenerateCommissioningReportClose} />}
        />
      )}
    </>
  );
};

DeviceProvisioningTableHeader.displayName = 'DeviceProvisioningTableHeader';
