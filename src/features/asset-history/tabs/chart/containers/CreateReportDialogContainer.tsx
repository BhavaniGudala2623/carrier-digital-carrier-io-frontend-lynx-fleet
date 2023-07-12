import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';

import { ReportFormData } from '../types';
import { CreateReportForm } from '../components';

import { Dialog } from '@/components';
import { ApplicationContextType, AssetReportManagement } from '@/providers/ApplicationContext';

interface CreateReportDialogContainerProps {
  reportDialogOpen: boolean;
  dialogData: ReportFormData;
  assetReportManagement: AssetReportManagement;
  setAssetReportManagement: ApplicationContextType['setAssetReportManagement'];
  setReportDialogOpen: (open: boolean) => void;
}

export const CreateReportDialogContainer = ({
  reportDialogOpen,
  dialogData,
  setReportDialogOpen,
  assetReportManagement,
  setAssetReportManagement,
}: CreateReportDialogContainerProps) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const setCreateReportActiveStep = (step: number) => {
    setActiveStep(step);
  };

  const handleClose = useCallback(() => setReportDialogOpen(false), [setReportDialogOpen]);

  const assetReportManagementInitState: AssetReportManagement = {
    ...assetReportManagement,
    reportName: '',
    tempChart: true,
    legend: true,
    table: true,
    events: true,
    attachLogo: false,
    timeframe: '24h',
    historyFrequency: '15m',
  };

  return (
    <Dialog
      maxWidth="sm"
      open={reportDialogOpen}
      dialogTitle={t('assethistory.report.create-report-dialog', { activeStep: activeStep + 1 })}
      onClose={handleClose}
      contentSx={{ pr: 1, pl: 4 }}
      dialogTitleSx={{ px: 4 }}
      content={
        <CreateReportForm
          activeStep={activeStep}
          setActiveStep={setCreateReportActiveStep}
          data={dialogData}
          assetReportManagement={assetReportManagementInitState}
          setAssetReportManagement={setAssetReportManagement}
          onClose={handleClose}
        />
      }
    />
  );
};
