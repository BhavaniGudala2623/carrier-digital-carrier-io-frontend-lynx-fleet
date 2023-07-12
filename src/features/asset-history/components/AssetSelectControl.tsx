import { ChangeEvent, useMemo } from 'react';
import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import TextField from '@carrier-io/fds-react/TextField';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { PartialAsset } from '../types';

type AssetOption = { id: string; name: string };

interface AssetSelectProps {
  assets?: PartialAsset[];
  selectedAssetId?: Maybe<string>;
  onAssetChange: (assetId: string) => void;
  onAssetChangeCallback: () => void;
  width?: number;
}

export const AssetSelect = (props: AssetSelectProps) => {
  const { assets, selectedAssetId, onAssetChange, onAssetChangeCallback, width = 250 } = props;

  const handleChange = (_event: ChangeEvent<{}>, value: AssetOption) => {
    if (value) {
      onAssetChange(value.id);
      onAssetChangeCallback();
    }
  };

  const assetOptions: AssetOption[] = useMemo(
    () => assets?.map((asset) => ({ id: asset.asset?.id ?? '', name: asset.asset?.name ?? '' })) ?? [],
    [assets]
  );

  const selectedValue = useMemo(
    () => assetOptions.find((option) => option.id === selectedAssetId) ?? null,
    [selectedAssetId, assetOptions]
  );

  return (
    <Autocomplete
      open
      onClose={onAssetChangeCallback}
      autoHighlight
      options={assetOptions ?? []}
      getOptionLabel={(option) => option?.name ?? ''}
      sx={{
        display: 'flex',
        ml: 0,
        alignItems: 'center',
        '.MuiInputBase-hiddenLabel': {
          backgroundColor: 'transparent',
          pt: '1px',
          borderColor: 'transparent',
          pl: 0,
        },
        ' .MuiButtonBase-root': {
          color: 'primary.contrastText',
        },
      }}
      componentsProps={{
        clearIndicator: {
          color: 'inherit',
        },
        paper: {},
      }}
      onChange={handleChange}
      value={selectedValue}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderOption={(optionProps, option) => (
        <li {...optionProps} key={option.id}>
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            width,
            whiteSpace: 'nowrap',
            alignItems: 'center',
            '.MuiInputBase-root': {
              color: 'primary.contrastText',
            },
          }}
          multiline={false}
          size="small"
          showBorder
          hiddenLabel
        />
      )}
    />
  );
};
