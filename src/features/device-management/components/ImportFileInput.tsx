import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Chip from '@carrier-io/fds-react/Chip';
import Link from '@carrier-io/fds-react/Link';
import Typography from '@carrier-io/fds-react/Typography';
import { CloudUpload } from '@mui/icons-material';
import { ChangeEvent, ChangeEventHandler, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ImportFileInputProps {
  batchFile: File | null;
  onBatchFileChange: ChangeEventHandler<HTMLInputElement>;
  fileNameIsValid: boolean | null;
  csvTemplate?: string;
  xslxTemplate?: string;
  headerList: string[];
  buttonTitle?: string;
  fileTypeRule?: string;
}

export const ImportFileInput = ({
  batchFile,
  onBatchFileChange,
  fileNameIsValid,
  xslxTemplate,
  csvTemplate,
  headerList,
  buttonTitle,
  fileTypeRule,
}: ImportFileInputProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnDelete = (event: ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current?.value) {
      inputRef.current.value = '';
    }
    onBatchFileChange(event);
  };

  return (
    <>
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Button variant="outlined" component="label" sx={{ textTransform: 'none', mr: 1 }}>
              <CloudUpload fontSize="small" sx={{ mr: 1 }} />
              {buttonTitle ?? t('device.management.device.provisioning.choose-file')}
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                hidden
                onChange={onBatchFileChange}
                ref={inputRef}
              />
            </Button>
          </Box>
          {batchFile && batchFile.toString() !== '' && (
            <Box maxWidth="150px">
              <Chip
                color={fileNameIsValid ? 'default' : 'error'}
                label={batchFile.name}
                onDelete={handleOnDelete}
                size="medium"
                variant={fileNameIsValid ? 'filled' : 'outlined'}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        <Typography variant="helperText" color="text.secondary">
          {fileTypeRule ?? t('device.management.device.must-be-csv-xls-xlsx')}
        </Typography>
        <Box display="flex" flexDirection="column">
          {headerList.map((key) => (
            <Typography key={key} variant="helperText" color="text.secondary">
              <Typography variant="helperText" sx={{ ml: 0.5 }}>
                &#8226;{' '}
              </Typography>
              <Typography variant="helperText" sx={{ ml: 0.5 }}>
                {key}
              </Typography>
            </Typography>
          ))}
        </Box>
      </Box>
      <Box mt={2.5}>
        {csvTemplate && (
          <Button variant="text" sx={{ mr: 3 }}>
            <Link underline="none" href={csvTemplate} color="inherit">
              {t('device.management.device.download-template', { extension: 'CSV' })}
            </Link>
          </Button>
        )}
        {xslxTemplate && (
          <Button variant="text">
            <Link underline="none" href={xslxTemplate} color="inherit">
              {t('device.management.device.download-template', { extension: 'XLSX' })}
            </Link>
          </Button>
        )}
      </Box>
    </>
  );
};

ImportFileInput.displayName = 'ImportFileInput';
