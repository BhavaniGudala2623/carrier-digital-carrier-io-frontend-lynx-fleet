import { useMemo } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import IconButton from '@carrier-io/fds-react/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';

import { AssetSelect } from './AssetSelectControl';

import { PartialAsset } from '@/features/asset-history/types';
import { useToggle } from '@/hooks';

interface AssetSelectWrapperProps {
  assets?: PartialAsset[];
  selectedAssetId?: Maybe<string>;
  onAssetChange: (assetId: string) => void;
}
export const AssetSelectWrapper = (props: AssetSelectWrapperProps) => {
  const { assets, selectedAssetId, onAssetChange } = props;

  const { value: viewSelect, toggleOn: handleShowSelect, toggleOff: handleHideSelect } = useToggle(false);

  const selectedAssetName = useMemo(
    () => (assets?.find((option) => option.asset?.id === selectedAssetId) ?? {}).asset?.name,
    [selectedAssetId, assets]
  );

  return viewSelect ? (
    <ClickAwayListener onClickAway={handleHideSelect}>
      <Box>
        <AssetSelect
          assets={assets}
          selectedAssetId={selectedAssetId}
          onAssetChange={onAssetChange}
          onAssetChangeCallback={handleHideSelect}
        />
      </Box>
    </ClickAwayListener>
  ) : (
    <Box display="flex" alignItems="center" px={0.75} onClick={handleShowSelect}>
      <Typography
        sx={{
          mr: 1,
          mt: 0.3,
          maxWidth: '200px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          color: 'primary.contrastText',
        }}
      >
        {selectedAssetName}
      </Typography>
      {selectedAssetName && (
        <IconButton
          sx={{
            color: 'primary.contrastText',
            borderRadius: 2,
            '&.MuiIconButton-root': {
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            },
          }}
        >
          <ArrowDropDownIcon />
        </IconButton>
      )}
    </Box>
  );
};
