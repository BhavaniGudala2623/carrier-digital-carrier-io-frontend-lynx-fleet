import { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';

import { ImportDevicesState } from '../../types';
import { ImportFileInput } from '../ImportFileInput';

import { BulkImportStats } from './BulkImportStats';

import { formatDate } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';

const headersTKeys = [
  'device.management.device.serial-number',
  'device.management.device.IMEI',
  'device.management.device.phone-or-ICCID',
];

interface BatchFileUploadProps {
  batchFile: File | null;
  importDevicesState: ImportDevicesState | null;
  onBatchFileChange: ChangeEventHandler<HTMLInputElement>;
  loading: boolean;
  fileNameIsValid: boolean | null;
}

export const BulkImportDevices = ({
  batchFile,
  onBatchFileChange,
  importDevicesState,
  loading,
  fileNameIsValid,
}: BatchFileUploadProps) => {
  const { t } = useTranslation();
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();

  if (!importDevicesState) {
    return (
      <Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t('device.management.device.upload-the-file-hint')}
        </Typography>
        <ImportFileInput
          csvTemplate="templates/csv_template.csv"
          xslxTemplate="templates/xls_template.xlsx"
          fileNameIsValid={fileNameIsValid}
          batchFile={batchFile}
          onBatchFileChange={onBatchFileChange}
          headerList={headersTKeys.map((key) => t(key)) as string[]}
        />
      </Box>
    );
  }

  const startedDate =
    importDevicesState && importDevicesState.startTime ? importDevicesState?.startTime : null;

  if (loading) {
    return (
      <>
        <Box mb={3} mt={1}>
          <Typography variant="body1">{t('device.management.device.device-import-progress')}...</Typography>
        </Box>
        {startedDate && (
          <Typography variant="helperText">
            {t('common.started-at')} {formatDate(startedDate, dateFormat, { timezone })}
          </Typography>
        )}
      </>
    );
  }

  return (
    <div>
      {importDevicesState?.taskResult && ['FINISHED', 'FAILED'].includes(importDevicesState.status) && (
        <BulkImportStats state={importDevicesState} />
      )}
    </div>
  );
};
