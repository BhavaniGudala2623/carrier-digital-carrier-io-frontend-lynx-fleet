import TextField from '@carrier-io/fds-react/TextField';
import {
  createContext,
  forwardRef,
  memo,
  useContext,
  useEffect,
  useRef,
  HTMLAttributes,
  CSSProperties,
} from 'react';
import { VariableSizeList, ListChildComponentProps, areEqual } from 'react-window';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import ListItemAvatar from '@carrier-io/fds-react/ListItemAvatar';
import ListItem from '@carrier-io/fds-react/ListItem';
import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import Chip from '@carrier-io/fds-react/Chip';
import InputAdornment from '@carrier-io/fds-react/InputAdornment';
import Stack from '@carrier-io/fds-react/Stack';
import { useTranslation } from 'react-i18next';

import { FilterOption, Category } from '../../types';
import { getHexColor } from '../../utils';

import { TruckIcon, LocationIcon, SearchIcon, BuildingIcon } from '@/components';

const LISTBOX_PADDING = 8;

type ListboxComponentChild = [HTMLAttributes<HTMLElement>, FilterOption];

const textOverflowStyle = {
  style: { textOverflow: 'ellipsis', overflow: 'hidden' },
};

const itemAvatarStyle = { minWidth: 'auto', mr: 2 };

const itemIconStyle = { fontSize: 20, mt: 1 };
// I added icons for fun, but if they are undesired its very easy to remove, just remove here and icon prop from chips
const categories: Category[] = [
  { name: 'assets', label: 'assets.assets' },
  { name: 'geofences', label: 'geofences.geofences' },
  { name: 'addresses', label: 'common.addresses' },
];

const AutocompleteListRow = memo((props: ListChildComponentProps<ListboxComponentChild[]>) => {
  const { data, index, style } = props;
  const dataSet = data[index];
  const [itemProps, itemData] = dataSet;
  const { type, label, address, groupColor } = itemData;
  const inlineStyle: CSSProperties = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
    whiteSpace: 'nowrap',
    paddingLeft: 30,
  };
  if (type === 'Asset') {
    return (
      <ListItem {...itemProps} style={inlineStyle}>
        <ListItemAvatar sx={itemAvatarStyle}>
          <TruckIcon sx={itemIconStyle} />
        </ListItemAvatar>
        <ListItemText primary={label} primaryTypographyProps={textOverflowStyle} />
      </ListItem>
    );
  }
  if (type === 'Geofence') {
    return (
      <ListItem {...itemProps} style={inlineStyle}>
        <ListItemAvatar sx={itemAvatarStyle}>
          <LocationIcon sx={itemIconStyle} colorIcon={getHexColor(groupColor as string)} />
        </ListItemAvatar>
        <ListItemText
          primary={label}
          secondary={address}
          primaryTypographyProps={textOverflowStyle}
          secondaryTypographyProps={textOverflowStyle}
        />
      </ListItem>
    );
  }

  return (
    <ListItem {...itemProps} style={inlineStyle}>
      <ListItemAvatar sx={itemAvatarStyle}>
        <BuildingIcon sx={itemIconStyle} />
      </ListItemAvatar>
      <ListItemText primary={label} primaryTypographyProps={textOverflowStyle} />
    </ListItem>
  );
}, areEqual);

AutocompleteListRow.displayName = 'AutocompleteListRow';

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);

  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: unknown) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);

  return ref;
}

// Adapter for react-window
const ListboxComponent = (
  categorySelected: Category | null,
  handleCategorySelect: (value: Category | null) => void
) =>
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>((props, ref) => {
    const { t } = useTranslation();

    const { children, ...other } = props;
    const itemData: ListboxComponentChild[] = [];
    (children as ListboxComponentChild[]).forEach((item) => {
      itemData.push(item);
    });

    const ASSET_ITEM_SIZE = 36;
    const GEOFENCE_ITEM_SIZE = 54;
    const itemCount = itemData.length;

    const getChildSize = (index: number) => {
      if (itemData[index][1].type === 'Asset') {
        return ASSET_ITEM_SIZE;
      }

      return GEOFENCE_ITEM_SIZE;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * ASSET_ITEM_SIZE;
      }

      // eslint-disable-next-line no-unused-vars
      return itemData.map((_item, index) => getChildSize(index)).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div ref={ref} onMouseDown={(event) => event.preventDefault()}>
        <ListItem>
          <ListItemText secondary={t('asset.tracking.looking.for')} />
        </ListItem>
        <ListItem>
          <Stack direction="row" spacing={2} className="selectedTags">
            {categories
              .filter((category) => category.name !== categorySelected?.name)
              .map((category) => (
                <Chip
                  key={category.name}
                  label={t(category.label)}
                  clickable
                  onClick={(event) => {
                    handleCategorySelect(category);
                    event.preventDefault();
                  }}
                  size="small"
                  color="primary"
                  variant="filled"
                  lightBackground
                  sx={{ '&.MuiChip-root:hover': { backgroundColor: 'whiteSmoke' } }}
                />
              ))}
          </Stack>
        </ListItem>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(index)}
            overscanCount={5}
            itemCount={itemCount}
          >
            {AutocompleteListRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  });

export const AutocompleteFilter = ({
  options,
  onInputChange,
  onOptionChange,
  selectedOption,
  handleCategorySelect,
  categorySelected,
}: {
  options: FilterOption[];
  onInputChange: (input: string) => void;
  onOptionChange: (options: FilterOption | null) => void;
  selectedOption: FilterOption | null;
  handleCategorySelect: (value: Category | null) => void;
  categorySelected: Category | null;
}) => {
  const { t } = useTranslation();
  const getOptionlabel = (option: FilterOption) => `${option.label || option.value}`;
  const onAutocompleteChange = (_event, option: FilterOption | null) => {
    onOptionChange(option);
  };

  const handleInputChange = (_, value: string) => {
    onInputChange(value);
  };

  const searchBar = () =>
    !categorySelected ? t('asset.tracking.search.placeholder') : t('asset.tracking.type.here');

  return (
    <Autocomplete
      id="assetFenceSearch"
      options={options}
      filterOptions={(option) => option}
      getOptionLabel={getOptionlabel}
      sx={{ width: 420 }}
      ListboxComponent={ListboxComponent(categorySelected, handleCategorySelect)}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ m: 0 }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
                {categorySelected ? (
                  <Chip
                    label={t(categorySelected.label)}
                    onDelete={() => handleCategorySelect(null)}
                    size="small"
                    color="primary"
                    variant="filled"
                    lightBackground
                  />
                ) : null}
              </InputAdornment>
            ),
          }}
          hiddenLabel
          placeholder={searchBar()}
        />
      )}
      forcePopupIcon={false}
      renderOption={(props, option) => [props, option] as React.ReactNode}
      value={selectedOption}
      onChange={onAutocompleteChange}
      onInputChange={handleInputChange}
      clearOnBlur={false}
      isOptionEqualToValue={(option, value) => option.type === value.type && option.value === value.value}
    />
  );
};
