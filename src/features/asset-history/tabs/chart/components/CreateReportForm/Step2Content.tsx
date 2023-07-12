import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { CircularProgress } from '@carrier-io/fds-react';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import { Upload } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ChangeEvent } from 'react';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { ReportFormData } from '../../types';

import { SharedReportState, Step2FormValues, Step2FormErrors } from './types';

import { HasPermission } from '@/features/authorization';
import { getAuthTenantId } from '@/features/authentication';
import { useAppSelector } from '@/stores';

type Step2ContentProps = {
  data: ReportFormData;
  state: SharedReportState;
  values: Partial<Step2FormValues>;
  errors: Step2FormErrors;
  handleChange: (e: ChangeEvent<unknown>) => void;
};

export function Step2Content(props: Step2ContentProps) {
  const { state, data, values, errors, handleChange } = props;
  const tenantId = useAppSelector(getAuthTenantId);
  const { t } = useTranslation();

  const getTenantLogo = () => {
    CompanyService.getTenantLogoUrl({ id: data.tenantId })
      .then((res) => {
        state.setTenantLogoUrl(res?.data?.getTenantLogoUrl || '');
        state.setInProgress(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Error with getting tenant logo URL ${err}`);

        state.setTenantLogoUrl('');
        state.setInProgress(false);
      });
  };

  const logoOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) {
      return;
    }
    state.setInProgress(true);
    CompanyService.getTenantLogoUploadUrl({ id: data.tenantId, contentType: file.type })
      .then((res) => {
        const preSignedUrl = res?.data?.getTenantLogoUploadUrl;
        if (!preSignedUrl) {
          state.setTenantLogoUrl('');

          return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', preSignedUrl);
        // eslint-disable-next-line func-names
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            // logo upload is done.
            getTenantLogo();
          }
        };
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.send(file);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.debug('err: ', err);
      });
    if (e.currentTarget?.files?.[0]) {
      state.setLogoFile(e.currentTarget.files[0]);
    }
  };

  if (state.tenantLogoUrl === '') {
    getTenantLogo();
  }

  return (
    <Box sx={{ minWidth: 420 }}>
      <Typography mb={3}>{t('assethistory.report.report-name-description')}</Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          id="reportName"
          size="small"
          required
          fullWidth
          placeholder={t('assethistory.report.report-name')}
          value={values.reportName || ''}
          error={Boolean(errors.reportNameError)}
          helperText={errors.reportNameError}
          onChange={handleChange}
        />
      </Box>
      <HasPermission action="report.logoUpload" subjectType="COMPANY" subjectId={tenantId}>
        <Box>
          {state.inProgress && <CircularProgress size={20} />}
          {!state.inProgress && (
            <>
              <Box display="flex" alignItems="center" mb={3}>
                {state.tenantLogoUrl && (
                  <img
                    alt={t('assethistory.report.company-logo')}
                    src={state.tenantLogoUrl}
                    width="70"
                    height="40"
                    style={{ objectFit: 'contain', marginRight: 8 }}
                  />
                )}
                <Button
                  startIcon={<Upload />}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  component="label"
                >
                  <input
                    id="attachedFile"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    hidden
                    onChange={logoOnChange}
                  />
                  {state.tenantLogoUrl
                    ? t('assethistory.report.replace-logo')
                    : t('assethistory.report.add-logo')}
                </Button>
              </Box>
              <FormControlLabel
                sx={{
                  pl: 1,
                }}
                control={
                  <Checkbox
                    name="attachLogo"
                    size="small"
                    checked={values.attachLogo}
                    onChange={handleChange}
                  />
                }
                label={
                  <Typography variant="body2">{t('assethistory.report.attach-company-logo')}</Typography>
                }
              />
            </>
          )}
        </Box>
      </HasPermission>
    </Box>
  );
}
