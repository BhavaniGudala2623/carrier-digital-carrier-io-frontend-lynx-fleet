import { useState } from 'react';
import {
  GenerateCommissioningReportArgs,
  DeviceCommissioningReportGqlResponse,
  GetDeviceCommissioningReportFileArgs,
  GetDeviceCommissioningReportFileGqlResponse,
  ReportFileFormat,
} from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { useGenerateReport } from '../../../hooks';

import { GenerateReportDialogContent } from './GenerateReportDialogContent';

import { useDateRange } from '@/hooks';

interface Props {
  onClose: () => void;
}

export const GenerateReportDevices = ({ onClose }: Props) => {
  const [reportFormat, setReportFormat] = useState<ReportFileFormat>('xlsx');
  const { dateRange, handleDateRangeChangeReport } = useDateRange([null, null]);

  const { generateReport, isReportLoading } = useGenerateReport<
    DeviceCommissioningReportGqlResponse,
    GenerateCommissioningReportArgs,
    GetDeviceCommissioningReportFileGqlResponse,
    GetDeviceCommissioningReportFileArgs
  >({
    startDate: dateRange[0],
    endDate: dateRange[1],
    format: reportFormat,
    onClose,
    generateReportFunction: AssetService.generateDeviceCommissioningReport,
    getUrlFunction: AssetService.getDeviceCommissioningReportFile,
  });

  const handleGenerateReportClick = () => generateReport();

  const handleChangeReportFormat = (format: ReportFileFormat) => setReportFormat(format);

  return (
    <GenerateReportDialogContent
      onClose={onClose}
      reportFormat={reportFormat}
      onChangeReportFormat={handleChangeReportFormat}
      dateRange={dateRange}
      onChangeDateRange={handleDateRangeChangeReport}
      isLoading={isReportLoading}
      onGenerateReport={handleGenerateReportClick}
      text="device.management.commissioning-report-is"
    />
  );
};

GenerateReportDevices.displayName = 'GenerateReportDevices';
