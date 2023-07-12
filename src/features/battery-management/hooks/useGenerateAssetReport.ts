import { useState } from 'react';
import { FetchPolicy } from '@apollo/client';
import { ApolloQueryResult } from '@apollo/client/core/types';

import { useAppDispatch } from '@/stores';
import { showError } from '@/stores/actions';

const LAMBDA_TIMEOUT = 1000 * 60 * 15; // 15 minutes as per serverless config
const EXPORT_FILE_REQUEST_INTERVAL = 1000 * 5;

interface Props<GenerateReportResponse, GenerateReportArgs, GetUrlResponse, GetUrlArgs> {
  generateBatteryReportFunction: (
    variables: GenerateReportArgs,
    fetchPolicy?: FetchPolicy
  ) => Promise<ApolloQueryResult<GenerateReportResponse>>;
  getBatterytUrlFunction: (
    variables: GetUrlArgs,
    fetchPolicy?: FetchPolicy
  ) => Promise<ApolloQueryResult<GetUrlResponse>>;
}

export const useGenerateAssetReport = <
  GenerateReportResponse,
  GenerateReportArgs,
  GetUrlResponse,
  GetUrlArgs
>(
  props: Props<GenerateReportResponse, GenerateReportArgs, GetUrlResponse, GetUrlArgs>
) => {
  const { generateBatteryReportFunction, getBatterytUrlFunction } = props;

  const dispatch = useAppDispatch();
  const [isReportLoading, setIsReportLoading] = useState(false);

  const getBatteryFileData = <T>(response: ApolloQueryResult<T>, key?: string): string | undefined => {
    const data = response?.data ?? {};

    // function name in the GQL response type
    const funcName = Object.keys(data)[0];

    if (key) {
      return data?.[funcName]?.[key];
    }

    return data?.[funcName]?.url || data?.[funcName];
  };

  const generateBatteryReport = async () => {
    setIsReportLoading(true);

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const handleExportError = (error: Error) => {
      setIsReportLoading(false);
      clearInterval(intervalId);
      clearTimeout(timeoutId);

      showError(dispatch, error);
    };

    await generateBatteryReportFunction({
      format: 'csv',
      sort: 'DESC',
    } as GenerateReportArgs)
      .then((response) => {
        const filePath = getBatteryFileData<GenerateReportResponse>(response, 'filePath');

        if (!filePath) {
          throw new Error('Url of exported file is empty');
        }

        timeoutId = setTimeout(() => {
          clearInterval(intervalId);
          handleExportError(new Error('File request timeout error'));
        }, LAMBDA_TIMEOUT);

        intervalId = setInterval(() => {
          getBatterytUrlFunction({ filePath } as GetUrlArgs)
            .then((res) => {
              const fileUrl = getBatteryFileData<GetUrlResponse>(res);

              if (fileUrl) {
                const link = document.createElement('a');
                link.href = fileUrl;
                document.body.appendChild(link);
                link.click();

                clearInterval(intervalId);
                clearTimeout(timeoutId);
                setIsReportLoading(false);
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

  return { generateBatteryReport, isReportLoading };
};
