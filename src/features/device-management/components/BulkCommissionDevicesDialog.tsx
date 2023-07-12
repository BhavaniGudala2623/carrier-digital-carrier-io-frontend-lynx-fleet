import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Link from '@carrier-io/fds-react/Link';
import Alert from '@carrier-io/fds-react/Alert';
import TreeSelectAutoComplete from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { SyntheticEvent, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { endsWith } from 'lodash-es';

import { useBulkCommissionState } from '../providers';

import { ImportFileInput } from './ImportFileInput';
import { BulkCommissionDevices } from './BulkImportDevices/BulkCommissionDevices';

import { useAppSelector } from '@/stores';
import { getAuth } from '@/features/authentication';
import { Dialog, getTreeData } from '@/components';

interface BulkCommissionDevicesDialogProps {
  handleClose: () => void;
}

const headersTKeys = [
  'company.management.fleet-name',
  'assets.asset.table.asset-name',
  'assets.asset.table.tru-serial-number',
  'device.management.device.info.device-serial-number',
];

const SET_COMPANY = 'COMPANY';

export const BulkCommissionDevicesDialog = ({ handleClose }: BulkCommissionDevicesDialogProps) => {
  const { t } = useTranslation();
  const {
    isImportStarted,
    isImportComplete,
    isImportFailed,
    setBulkFile,
    bulkFile,
    importBulkCommissionDevicesState,
    handleBulkFileChange,
    bulkFileUploading,
    isBulkCommissionLoading,
    company,
    setCompany,
    actionStartTime,
    resetBulkCommissionState,
  } = useBulkCommissionState();

  const fileNameIsValid = bulkFile && (endsWith(bulkFile.name, 'csv') || endsWith(bulkFile.name, 'xlsx'));

  const actionButtonsDisabled =
    isBulkCommissionLoading || !bulkFile || bulkFileUploading || !fileNameIsValid || !company;

  const handleResetAndCloseDialog = () => {
    handleClose();
    if (isImportComplete) {
      resetBulkCommissionState();
    }
  };
  const title = t('device.management.device.provisioning.bulk-commission-devices');
  const { tenantsHierarchy, loading } = useAppSelector(getAuth);

  useEffect(() => {
    if (tenantsHierarchy?.tenants) {
      const bluedgeCompany = tenantsHierarchy.tenants.find((tenant) => tenant.name === 'BluEdge Elite ETT');
      if (bluedgeCompany) {
        setCompany({
          name: bluedgeCompany.name,
          id: bluedgeCompany.id,
        });
      }
    }
  }, [setCompany, tenantsHierarchy]);

  const treeData = useMemo(
    () =>
      getTreeData(
        t,
        tenantsHierarchy
          ? {
              tenants: tenantsHierarchy.tenants.filter((tenant) => tenant.name === 'BluEdge Elite ETT'),
              fleets: [],
            }
          : tenantsHierarchy
      ),
    [t, tenantsHierarchy]
  );

  const handleNodeSelect = (_e: SyntheticEvent, eName, nodeId: string) => {
    const items = nodeId?.split('|') ?? [];
    if (items[0] === SET_COMPANY) {
      setCompany({ name: eName, id: items[1] });
    }
  };

  const handleOnClear = () => {
    setCompany(null);
  };

  return (
    <Dialog
      onClose={handleResetAndCloseDialog}
      maxWidth="sm"
      dialogTitle={title}
      fullWidth
      content={
        importBulkCommissionDevicesState ? (
          <BulkCommissionDevices
            loading={isBulkCommissionLoading || bulkFileUploading}
            importBulkCommissionDevicesState={importBulkCommissionDevicesState}
            companyName={company?.name ?? ''}
            actionStartTime={actionStartTime}
          />
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography variant="body1" sx={{ mb: 3, mt: 3 }}>
              {t('device.management.device.commissioning.bulk-commission-devices')}
            </Typography>

            <TreeSelectAutoComplete
              noResults={t('common.no-results-have-been-found')}
              onNodeSelect={handleNodeSelect}
              onClear={handleOnClear}
              isLoading={loading}
              textFieldCompProps={{
                color: 'secondary',
                hideBackgroundColor: false,
                disabled: true,
                value: company?.name ?? '',
                placeholder: t('company.filter.select-company'),
                showBorder: false,
                size: 'small',
                inputSetting: {
                  startAdornment: null,
                },
              }}
              treeData={treeData}
              treeSelectProps={{
                controlledBy: 'input',
                showInputArrow: true,
              }}
            />
            <Box sx={{ mt: 3 }}>
              <ImportFileInput
                csvTemplate="templates/csv_template_bulk_commission.csv"
                xslxTemplate="templates/xls_template_bulk_commission.xlsx"
                fileNameIsValid={fileNameIsValid}
                batchFile={bulkFile}
                onBatchFileChange={(event) => setBulkFile(event.currentTarget.files?.[0] ?? null)}
                headerList={headersTKeys.map((key) => t(key)) as string[]}
              />
            </Box>
          </Box>
        )
      }
      actions={
        <Box width="100%">
          <Box display="flex" justifyContent="flex-end" mb={1}>
            {importBulkCommissionDevicesState === null && (
              <>
                <Button
                  autoFocus
                  onClick={handleResetAndCloseDialog}
                  color="secondary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={handleBulkFileChange}
                  type="submit"
                  variant="outlined"
                  disabled={actionButtonsDisabled}
                >
                  {t('device.management.device.provisioning.import-file')}
                </Button>
              </>
            )}
            {isImportStarted && (
              <Button color="primary" onClick={handleClose} variant="outlined">
                {t('device.management.device.provisioning.hide-dialog')}
              </Button>
            )}
            {isImportComplete && (
              <Button color="primary" variant="outlined">
                <Link
                  underline="none"
                  href={importBulkCommissionDevicesState?.taskResult?.reportLink}
                  color="inherit"
                >
                  {t('device.management.device.provisioning.download-full-report')}
                </Link>
              </Button>
            )}
          </Box>
          {isImportFailed && (
            <Alert
              sx={{ height: '64px', margin: '0 -20px -20px -20px' }}
              color="error"
              role="alert"
              severity="error"
              variant="standard"
            >
              {t('device.management.device.import-failed')}
            </Alert>
          )}
        </Box>
      }
      open
    />
  );
};

BulkCommissionDevicesDialog.displayName = 'BulkCommissionDevicesDialog';
