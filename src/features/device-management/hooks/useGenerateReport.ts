import { Maybe, ReportFileFormat } from '@carrier-io/lynx-fleet-types';
import { useState } from 'react';
import { getTimezoneOffset, zonedTimeToUtc } from 'date-fns-tz';
import { FetchPolicy } from '@apollo/client';
import { ApolloQueryResult } from '@apollo/client/core/types';

import { useAppDispatch } from '@/stores';
import { useUserSettings } from '@/providers/UserSettings';
import { showError } from '@/stores/actions';

const LAMBDA_TIMEOUT = 1000 * 60 * 15; // 15 minutes as per serverless config
const EXPORT_FILE_REQUEST_INTERVAL = 1000 * 5;

interface Props<GenerateReportResponse, GenerateReportArgs, GetUrlResponse, GetUrlArgs> {
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  format: ReportFileFormat;
  onClose: () => void;
  generateReportFunction: (
    variables: GenerateReportArgs,
    fetchPolicy?: FetchPolicy
  ) => Promise<ApolloQueryResult<GenerateReportResponse>>;
  getUrlFunction: (variables: GetUrlArgs) => Promise<ApolloQueryResult<GetUrlResponse>>;
}

export const useGenerateReport = <GenerateReportResponse, GenerateReportArgs, GetUrlResponse, GetUrlArgs>(
  props: Props<GenerateReportResponse, GenerateReportArgs, GetUrlResponse, GetUrlArgs>
) => {
  const { startDate, endDate, format, onClose, generateReportFunction, getUrlFunction } = props;

  const dispatch = useAppDispatch();
  const [isReportLoading, setIsReportLoading] = useState(false);
  const {
    userSettings: { timezone },
  } = useUserSettings();

  const getFileData = <T>(response: ApolloQueryResult<T>, key?: string): string | undefined => {
    const data = response?.data ?? {};

    // function name in the GQL response type
    const funcName = Object.keys(data)[0];

    if (key) {
      return data?.[funcName]?.[key];
    }

    return data?.[funcName]?.url || data?.[funcName];
  };

  const generateReport = async () => {
    if (!startDate || !endDate) {
      return;
    }

    setIsReportLoading(true);

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const handleExportError = (error: Error) => {
      setIsReportLoading(false);
      clearInterval(intervalId);
      clearTimeout(timeoutId);

      // eslint-disable-next-line
      console.error(`Error generate report: ${error}`);
      onClose();
      showError(dispatch, error);
    };

    await generateReportFunction({
      startDate: startDate ? zonedTimeToUtc(startDate, timezone).toISOString() : '',
      endDate: endDate ? zonedTimeToUtc(endDate.setHours(23, 59, 59, 999), timezone).toISOString() : '',
      sort: 'DESC',
      format,
      timezoneOffset: (getTimezoneOffset(timezone) / 60000) * -1, // convert millis to the minutes and reverse sign of number,
    } as GenerateReportArgs)
      .then((response) => {
        const filePath = getFileData<GenerateReportResponse>(response, 'filePath');

        if (!filePath) {
          throw new Error('Url of exported file is empty');
        }

        timeoutId = setTimeout(() => {
          clearInterval(intervalId);
          handleExportError(new Error('File request timeout error'));
        }, LAMBDA_TIMEOUT);

        intervalId = setInterval(() => {
          getUrlFunction({ filePath } as GetUrlArgs)
            .then((res) => {
              const fileUrl = getFileData<GetUrlResponse>(res);

              if (fileUrl) {
                const link = document.createElement('a');
                link.href = fileUrl;
                document.body.appendChild(link);
                link.click();

                clearInterval(intervalId);
                clearTimeout(timeoutId);
                setIsReportLoading(false);
                onClose();
              }
            })
            .catch((error) => {
              handleExportError(error);
            });
        }, EXPORT_FILE_REQUEST_INTERVAL);
      })
      .catch((error) => {
        handleExportError(error);
      });
  };

  return { generateReport, isReportLoading };
};
