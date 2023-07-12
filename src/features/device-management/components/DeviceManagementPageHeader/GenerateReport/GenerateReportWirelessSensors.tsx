import { useState } from 'react';
import {
  ReportFileFormat,
  GenerateBluetoothSensorsReportGqlResponse,
  GetSensorsReportFileUrlGqlResponse,
  GenerateBluetoothSensorsReportArgs,
  GetSensorsReportFileUrlArgs,
} from '@carrier-io/lynx-fleet-types';
import { BluetoothService } from '@carrier-io/lynx-fleet-data-lib';

import { useGenerateReport } from '../../../hooks';

import { GenerateReportDialogContent } from './GenerateReportDialogContent';

import { useDateRange } from '@/hooks';

interface Props {
  onClose: () => void;
}

export const GenerateReportWirelessSensors = ({ onClose }: Props) => {
  const [reportFormat, setReportFormat] = useState<ReportFileFormat>('xlsx');
  const { dateRange, handleDateRangeChangeReport } = useDateRange([null, null]);

  const { generateReport, isReportLoading } = useGenerateReport<
    GenerateBluetoothSensorsReportGqlResponse,
    GenerateBluetoothSensorsReportArgs,
    GetSensorsReportFileUrlGqlResponse,
    GetSensorsReportFileUrlArgs
  >({
    startDate: dateRange[0],
    endDate: dateRange[1],
    format: reportFormat,
    onClose,
    generateReportFunction: BluetoothService.generateBluetoothSensorsReport,
    getUrlFunction: BluetoothService.getSensorsReportFileUrl,
  });

  const handleGenerateReportClick = async () => {
    await generateReport();
  };

  const handleChangeReportFormat = (format: ReportFileFormat) => {
    setReportFormat(format);
  };

  return (
    <GenerateReportDialogContent
      onClose={onClose}
      reportFormat={reportFormat}
      onChangeReportFormat={handleChangeReportFormat}
      dateRange={dateRange}
      onChangeDateRange={handleDateRangeChangeReport}
      isLoading={isReportLoading}
      onGenerateReport={handleGenerateReportClick}
      text="device.management.wireless-sensors-report-is"
    />
  );
};

GenerateReportWirelessSensors.displayName = 'GenerateReportWirelessSensors';
