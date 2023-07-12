import { Maybe, Sorting } from '@carrier-io/lynx-fleet-types';
import { useState } from 'react';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { getTimezoneOffset, zonedTimeToUtc } from 'date-fns-tz';

// eslint-disable-next-line no-restricted-imports
import { getAssetHistoryState } from '@/features/asset-history/stores';
import { useAppDispatch, useAppSelector } from '@/stores';
import { assetHistorySlice } from '@/features/asset-history';
import { useUserSettings } from '@/providers/UserSettings';

const { actions } = assetHistorySlice;
const LAMBDA_TIMEOUT = 1000 * 60 * 15; // 15 minutes as per serverless config
const EXPORT_FILE_REQUEST_INTERVAL = 1000 * 5;

interface UseExportAssetHistoryProps {
  assetId: string;
  startDate?: Maybe<Date>;
  endDate?: Maybe<Date>;
  assetHistorySort?: Maybe<Sorting>;
}

export const useExportAssetHistory = (props: UseExportAssetHistoryProps) => {
  const { startDate, endDate, assetHistorySort, assetId } = props;
  const { asset } = useAppSelector(getAssetHistoryState);
  const dispatch = useAppDispatch();
  const [exportLoading, setExportLoading] = useState(false);
  const {
    userSettings: { timezone },
  } = useUserSettings();

  const exportAssetHistory = (format: string) => {
    if (!startDate || !endDate || !assetHistorySort || !asset?.name) {
      return;
    }

    setExportLoading(true);

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const handleExportError = (error: Error) => {
      setExportLoading(false);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      const clientError = { ...error, clientMessage: `Error exporting assets history: ${error}` };
      // eslint-disable-next-line
      console.error(JSON.stringify(clientError));
      dispatch(actions.catchExportAssetHistoryError({ err: clientError }));
    };

    AssetService.exportAssetHistory({
      assetId,
      startDate: zonedTimeToUtc(startDate.setSeconds(0, 0), timezone).toISOString(),
      endDate: zonedTimeToUtc(endDate.setSeconds(59, 999), timezone).toISOString(),
      sort: assetHistorySort,
      format,
      assetName: asset.name,
      timezoneOffset: (getTimezoneOffset(timezone) / 60000) * -1, // convert millis to the minutes and reverse sign of number,
    })
      .then((response) => {
        const filePath = response?.data?.exportAssetHistory;
        if (!filePath) {
          throw new Error('Url of exported file is empty');
        }

        timeoutId = setTimeout(() => {
          clearInterval(intervalId);
          handleExportError(new Error('File request timeout error'));
        }, LAMBDA_TIMEOUT);

        intervalId = setInterval(() => {
          AssetService.getExportFile({ filePath, assetId })
            .then((res) => {
              const fileUrl = res?.data?.getExportFile;
              if (fileUrl) {
                const link = document.createElement('a');
                link.href = fileUrl;
                document.body.appendChild(link);
                link.click();

                clearInterval(intervalId);
                clearTimeout(timeoutId);
                setExportLoading(false);
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

  const exportExcel = () => exportAssetHistory('xlsx');
  const exportCsv = () => exportAssetHistory('csv');

  return { exportExcel, exportCsv, isExportLoading: exportLoading };
};
