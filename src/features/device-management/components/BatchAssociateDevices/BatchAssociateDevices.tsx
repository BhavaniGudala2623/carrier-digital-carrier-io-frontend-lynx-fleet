import { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';

import { ImportDevicesState } from '../../types';
import { ImportFileInput } from '../ImportFileInput';

import { AssociateImportStats } from './AssociateImportStats';

import { formatDate } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';

const headersTKeys = [
  'device.management.drawer.must-be-csv-xls-xlsx-headers-tru-part-number',
  'device.management.drawer.must-be-csv-xls-xlsx-headers-tru-description',
  'device.management.drawer.must-be-csv-xls-xlsx-headers-tru-serial-number',
  'device.management.drawer.must-be-csv-xls-xlsx-headers-telematics-part-number',
  'device.management.drawer.must-be-csv-xls-xlsx-headers-telematics-serial-number',
];

interface BatchFileUploadProps {
  batchFile: File | null;
  associateDevicesState: ImportDevicesState | null;
  onBatchFileChange: ChangeEventHandler<HTMLInputElement>;
  associateReady: boolean;
  fileNameIsValid: boolean;
}

export const BatchAssociateDevices = ({
  batchFile,
  onBatchFileChange,
  associateDevicesState,
  associateReady,
  fileNameIsValid,
}: BatchFileUploadProps) => {
  const { t } = useTranslation();
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();

  const startedDate =
    associateDevicesState && associateDevicesState.startTime ? associateDevicesState.startTime : null;

  if (!associateDevicesState) {
    return (
      <Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t('device.management.device.upload-the-file-hint-associate')}
        </Typography>
        <ImportFileInput
          csvTemplate="templates/csv_template_tru_import.csv"
          xslxTemplate="templates/xls_template_tru_import.xlsx"
          fileNameIsValid={fileNameIsValid}
          batchFile={batchFile}
          onBatchFileChange={onBatchFileChange}
          headerList={headersTKeys.map((key) => t(key)) as string[]}
        />
      </Box>
    );
  }

  if (associateDevicesState && !associateReady) {
    return (
      <>
        <Typography mb={3} mt={1}>
          {t('device.management.drawer.device-associate-importing-progress')}
        </Typography>
        {startedDate && (
          <Typography variant="caption" component="div">
            {t('common.started-at')} {formatDate(startedDate, dateFormat, { timezone })}
          </Typography>
        )}
      </>
    );
  }

  return (
    <div>
      {associateDevicesState?.taskResult && ['FINISHED', 'FAILED'].includes(associateDevicesState.status) && (
        <AssociateImportStats state={associateDevicesState} />
      )}
    </div>
  );
};
