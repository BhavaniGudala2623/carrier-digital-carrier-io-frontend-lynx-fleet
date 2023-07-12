import Collapse from '@carrier-io/fds-react/Collapse';
import List from '@carrier-io/fds-react/List';
import ListItemButton from '@carrier-io/fds-react/ListItemButton';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import Typography from '@carrier-io/fds-react/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAssetsPageContext } from '../../providers';
import { AssetLayerFilterType } from '../../types';

import { ListButtonAsset } from './ListButtonAsset';

import { getAssetTypes } from '@/utils';

export const AssetLayers = () => {
  const { t } = useTranslation();
  const assetTypes = getAssetTypes();
  const { filter, toogletAssetLayerFilter } = useAssetsPageContext();

  const [expandedAssets, setAssetsExpanded] = useState(false);

  const handleAssetsExpandClick = () => {
    setAssetsExpanded(!expandedAssets);
  };

  const handleClickAsset = (assetType: AssetLayerFilterType) => {
    toogletAssetLayerFilter(assetType);
  };

  const assetTypeList = assetTypes.map((type) => (
    <ListButtonAsset
      key={`assetType-${type.key}`}
      color={type.color}
      name={t(type.key)}
      assetState={type.assetState}
      active={filter.selectedAssetLayers.includes(type.assetState)}
      onAssetFilterClick={handleClickAsset}
    />
  ));

  return (
    <>
      <List
        aria-label={t('asset.asset-types')}
        sx={{
          backgroundColor: 'white',
          padding: 0,
          minWidth: 200,
        }}
      >
        <ListItemButton
          sx={{
            height: 40,
            opacity: 1,
            pl: 4,
            cursor: 'pointer',
            borderRadius: 1,
          }}
          onClick={handleAssetsExpandClick}
        >
          <ListItemText primary={<Typography variant="body2">{t('assets.assets')}</Typography>} />
        </ListItemButton>
      </List>
      <Collapse in timeout="auto" unmountOnExit>
        <List aria-label={t('asset.asset-types')} sx={{ backgroundColor: 'white', padding: 0 }}>
          {assetTypeList}
        </List>
      </Collapse>
    </>
  );
};
