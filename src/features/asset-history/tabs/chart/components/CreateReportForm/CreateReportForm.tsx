import { useMemo, useState, useCallback } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { ReportFormData } from '../../types';

import { Step1Content } from './Step1Content';
import { Step2Content } from './Step2Content';
import {
  CreateReportFormValues,
  SharedReportState,
  Step1FormValues,
  Step2FormValues,
  Step1FormErrors,
  Step2FormErrors,
} from './types';

import { AssetReportManagement } from '@/providers/ApplicationContext';

type CreateReportFormProps = {
  onClose: () => void;
  data: ReportFormData;
  assetReportManagement: AssetReportManagement;
  setAssetReportManagement: (x: Partial<AssetReportManagement>) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
};

export const CreateReportForm = ({
  onClose,
  data,
  assetReportManagement,
  setAssetReportManagement,
  activeStep,
  setActiveStep,
}: CreateReportFormProps) => {
  const { t } = useTranslation();
  const [logoFile, setLogoFile] = useState<Maybe<File>>(null);
  const [tenantLogoUrl, setTenantLogoUrl] = useState<Maybe<string>>('');
  const [inProgress, setInProgress] = useState(true);
  const navigate = useNavigate();

  const state: SharedReportState = useMemo(
    () => ({
      logoFile,
      setLogoFile,
      tenantLogoUrl,
      setTenantLogoUrl,
      inProgress,
      setInProgress,
    }),
    [logoFile, tenantLogoUrl, inProgress]
  );

  const handleClose = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.resetForm();
    onClose();
  };

  const initialValues: CreateReportFormValues = {
    reportName: assetReportManagement?.reportName || '',
    tempChart: assetReportManagement?.tempChart || false,
    legend: assetReportManagement?.legend || false,
    table: assetReportManagement?.table || false,
    events: assetReportManagement?.events || false,
    attachLogo: assetReportManagement?.attachLogo || false,
    logoUrl: '',
    attachedFile: assetReportManagement?.attachedFile || '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setAssetReportManagement({
        ...values,
        logoUrl: tenantLogoUrl ?? '',
        timeframe: data.quickDate,
        quickDate: data.quickDate,
        historyFrequency: data.frequency,
        flespiData: {
          ...assetReportManagement.flespiData,
          freezer_serial_number: assetReportManagement.flespiData?.freezer_serial_number ?? data.truSerial,
        },
      });
      navigate(`/assets/${data.assetId}/report`);
      handleClose();
    },
  });

  const { events, legend, table, tempChart, attachLogo, reportName, attachedFile } = formik.values;
  const { reportName: reportNameError, legend: legendError } = formik.errors;

  const step1Errors: Step1FormErrors = useMemo(
    () => ({
      legendError,
    }),
    [legendError]
  );

  const step2Errors: Step2FormErrors = useMemo(
    () => ({
      reportNameError,
    }),
    [reportNameError]
  );

  const step1Values: Step1FormValues = useMemo(
    () => ({
      events,
      legend,
      table,
      tempChart,
    }),
    [events, legend, table, tempChart]
  );

  const step2Values: Partial<Step2FormValues> = useMemo(
    () => ({
      attachLogo,
      reportName,
    }),
    [attachLogo, reportName]
  );

  const validateStep1 = useCallback(() => {
    if (![events, legend, table, tempChart].find((selectValue) => selectValue)) {
      formik.setErrors({ legend: t('assethistory.report.error.at_least_one_selection_is_required') });

      return false;
    }

    return true;
  }, [events, legend, table, tempChart, formik, t]);

  const validateStep2 = useCallback(() => {
    if (!reportName.trim().length) {
      formik.setErrors({ reportName: t('assethistory.report.error.report_name_is_required') });

      return false;
    }
    if (!attachedFile.trim().length && attachLogo && !tenantLogoUrl?.trim().length) {
      formik.setErrors({ reportName: t('assethistory.report.error.attachment_is_required') });

      return false;
    }

    return true;
  }, [reportName, attachedFile, attachLogo, tenantLogoUrl, formik, t]);

  return (
    <Box>
      <Box pr={3}>
        {activeStep === 0 ? (
          <Step1Content
            data={data}
            values={step1Values}
            errors={step1Errors}
            handleChange={formik.handleChange}
          />
        ) : (
          <Step2Content
            state={state}
            data={data}
            values={step2Values}
            errors={step2Errors}
            handleChange={formik.handleChange}
          />
        )}
      </Box>
      <br />
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => (activeStep === 0 ? handleClose() : setActiveStep(0))}
          sx={{ mr: 1 }}
        >
          {activeStep === 0 ? t('common.cancel') : t('common.back')}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            if (activeStep === 0 && validateStep1()) {
              setActiveStep(1);
            }

            if (activeStep === 1 && validateStep2()) {
              formik.handleSubmit();
            }
          }}
        >
          {activeStep === 1 ? t('common.create') : t('common.next')}
        </Button>
      </Box>
    </Box>
  );
};
