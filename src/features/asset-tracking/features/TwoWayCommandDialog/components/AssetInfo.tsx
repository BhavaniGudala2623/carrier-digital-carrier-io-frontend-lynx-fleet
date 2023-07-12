import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import Grid from '@carrier-io/fds-react/Grid';
import RoomIcon from '@mui/icons-material/Room';
import HistoryIcon from '@mui/icons-material/History';

import { getAssetCoordinates } from '../../map/utils';

import type { SnapshotDataEx } from '@/features/common';
import { dateTimeFormatter } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';
import { useGetAssetAddress } from '@/providers/AssetsAddress/context';

interface TwoWayAssetInfoProps {
  asset: SnapshotDataEx | null;
}

export function TwoWayAssetInfo({ asset }: TwoWayAssetInfoProps) {
  const { t } = useTranslation();

  const assetCoordinates = getAssetCoordinates(asset);
  const assetAddress = useGetAssetAddress({
    longitude: assetCoordinates?.[0],
    latitude: assetCoordinates?.[1],
    address: asset?.computedFields?.address,
  });
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();

  return (
    <div>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {asset?.asset?.name}
      </Typography>
      <Typography variant="body2">{t('assets.management.tru-serial')}</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {asset?.flespiData?.freezer_serial_number || '-'}
      </Typography>
      <Grid container alignItems="center">
        <HistoryIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="caption">
          {t('assets.asset.list.last-updated')}:{' '}
          {asset?.flespiData?.timestamp
            ? dateTimeFormatter(asset.flespiData.timestamp, {
                dateFormat,
                timestampFormat: 'seconds',
                timezone,
              })
            : ''}
        </Typography>
      </Grid>
      {assetAddress && (
        <Grid container alignItems="center">
          <RoomIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption">{assetAddress}</Typography>
        </Grid>
      )}
    </div>
  );
}
