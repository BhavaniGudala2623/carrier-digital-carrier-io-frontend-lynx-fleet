import { Alert, Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { ChangeEventHandler, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ImportFileInput } from '../../ImportFileInput';

interface BatchFileUploadProps {
  bulkFile: File | null;
  onBatchFileChange: ChangeEventHandler<HTMLInputElement>;
  isFileNameValid: boolean;
  titles: string[];
  fileTypeRule: string;
  errorMessage: string;
  headersTKeys?: string[];
  fileType?: string;
}

export const BulkImportWirelessSensorForm = ({
  bulkFile,
  onBatchFileChange,
  isFileNameValid,
  titles,
  fileTypeRule,
  errorMessage,
  headersTKeys,
  fileType,
}: BatchFileUploadProps) => {
  const { t } = useTranslation();

  const isFileNameValidForImport = useMemo(() => {
    if (!bulkFile) {
      return true;
    }

    return isFileNameValid;
  }, [bulkFile, isFileNameValid]);

  return (
    <Box width="100%">
      <Box display="flex" flexDirection="column" gap={2}>
        {titles.map((title) => (
          <Typography key={title} variant="body1">
            {t(title)}
          </Typography>
        ))}
      </Box>
      <Box height={40}>
        {!isFileNameValidForImport && (
          <Alert severity="error" variant="standard" sx={{ pt: 0, pb: 0, transform: 'scaleY(0.9)' }}>
            {errorMessage}
          </Alert>
        )}
      </Box>
      <Box height={fileType === 'csv' ? 130 : 80}>
        <ImportFileInput
          fileNameIsValid={isFileNameValid}
          batchFile={bulkFile}
          onBatchFileChange={onBatchFileChange}
          headerList={(headersTKeys?.map((key) => t(key)) as string[]) ?? []}
          buttonTitle={t(`device.management.bluetooth-sensors.bulk-import.choose-file.${fileType}`)}
          fileTypeRule={fileTypeRule}
        />
      </Box>
    </Box>
  );
};
