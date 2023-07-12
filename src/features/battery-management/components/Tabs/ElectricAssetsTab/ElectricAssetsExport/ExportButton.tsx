import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import { BatteryService } from '@carrier-io/lynx-fleet-data-lib';
import {
  ExportBatteryAssetsArgs,
  BatteryAssetsReportResponse,
  GetBatteryAssetsReportFileArgs,
} from '@carrier-io/lynx-fleet-types';

import { useGenerateAssetReport } from '../../../../hooks/useGenerateAssetReport';

export interface GetBatteryAssetsReportFileGqlResponse {
  getBatteryAssetsPreSignedUrl: string;
}
export function ExportButton() {
  const { t } = useTranslation();

  const { generateBatteryReport, isReportLoading } = useGenerateAssetReport<
    BatteryAssetsReportResponse,
    ExportBatteryAssetsArgs,
    GetBatteryAssetsReportFileGqlResponse,
    GetBatteryAssetsReportFileArgs
  >({
    generateBatteryReportFunction: BatteryService.getBatteryAssetsReport,
    getBatterytUrlFunction: BatteryService.getBatteryAssetsPreSignedUrl,
  });

  const handleOnClick = () => generateBatteryReport();

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="medium"
      onClick={handleOnClick}
      sx={{ mt: 1, ml: 'auto' }}
      disabled={isReportLoading}
      endIcon={isReportLoading ? <CircularProgress size={13} /> : null}
      data-testid="common-export-button"
    >
      {isReportLoading ? t('common.loading') : t('common.export')}
    </Button>
  );
}
