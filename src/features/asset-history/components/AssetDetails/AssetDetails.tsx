import { Typography } from '@carrier-io/fds-react';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';

import { useAssetHistoryPageContext } from '../../providers';

import { AssetAddress } from './AssetAddress';
import { AssetLastUpdated } from './AssetLastUpdated';

import { useGetAssetAddress } from '@/providers/AssetsAddress/context';
import { BluetoothIcon } from '@/icons';

const dividerStyle = { marginLeft: 8, marginRight: 8, opacity: 0.6 };

export const AssetDetails = () => {
  const { t } = useTranslation();
  const { assetDetails: data, assetDetailsLoading: loading } = useAssetHistoryPageContext();

  const {
    position_longitude,
    position_latitude,
    fleetName,
    truSerialNumber,
    truModelNumber,
    tenantName,
    assetName,
    timestamp,
    bluetoothSensorConfigured,
    address,
  } = data ?? {};

  const assetAddress = useGetAssetAddress({
    longitude: position_longitude,
    latitude: position_latitude,
    address,
  });

  const fleetInfo = fleetName ? `, ${t('company.management.fleet')}: ${fleetName}` : '';

  const truSerialNumberInfo = truSerialNumber ? `${t('assethistory.header.serial')} ${truSerialNumber}` : '';

  if (loading) {
    return <Box sx={{ height: 69, width: '100%', mb: 2 }} />;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography component="p" variant="overline" color="text.secondary" data-testid="tenant-name">
        {tenantName}
        {fleetInfo}
      </Typography>
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ mr: 1 }} data-testid="asset-name">
          {assetName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'inline-flex', alignItems: 'center' }}
          data-testid="asset-address"
        >
          {assetAddress && <AssetAddress address={assetAddress} />}
          {assetAddress && timestamp && <span style={dividerStyle}>|</span>}
          {timestamp && <AssetLastUpdated timestamp={timestamp} />}
          {bluetoothSensorConfigured && (
            <>
              {(assetAddress || timestamp) && <span style={dividerStyle}>|</span>}
              <BluetoothIcon />
            </>
          )}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {truModelNumber || ''}
        {truModelNumber && truSerialNumber && ' / '}
        {truSerialNumberInfo}
      </Typography>
    </Box>
  );
};
