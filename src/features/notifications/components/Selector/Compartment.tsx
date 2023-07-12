/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import TextField from '@carrier-io/fds-react/TextField';
import Autocomplete, { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

type CompartmentSelectorProps = Omit<AutocompleteProps, 'options' | 'renderInput' | 'value'> & {
  selectedCompartments: number[];
  isCompartmentSelected: boolean;
};

export const getCompartmentOptions = (t: TFunction) => [
  {
    label: t('asset.compartment1'),
    value: 1,
  },
  {
    label: t('asset.compartment2'),
    value: 2,
  },
  {
    label: t('asset.compartment3'),
    value: 3,
  },
];

export const CompartmentSelector = memo(
  ({ selectedCompartments, onChange, isCompartmentSelected, ...rest }: CompartmentSelectorProps) => {
    const { t } = useTranslation();

    const compartmentOptions = getCompartmentOptions(t);

    const selectedValues = useMemo(
      () =>
        selectedCompartments.map((compartment) =>
          compartmentOptions.find((option) => option.value === compartment)
        ),
      [selectedCompartments]
    );

    return (
      <Autocomplete
        multiple
        disableCloseOnSelect
        limitTags={3}
        options={compartmentOptions}
        getOptionLabel={(option) => t(option.label)}
        renderOption={(props, option, { selected }) => (
          <li {...props} style={{ height: 40 }}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        )}
        value={selectedValues}
        onChange={onChange}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ '.MuiAutocomplete-inputRoot .MuiAutocomplete-input': { minWidth: 24 } }}
            label={t('asset.compartment')}
            placeholder={!isCompartmentSelected ? t('notifications.select-compartment') : ''}
            error={!isCompartmentSelected}
            showBorder
            helperText={
              isCompartmentSelected ? (
                <Trans i18nKey="notifications.selected-compartments" />
              ) : (
                t('notifications.error.selected-compartments')
              )
            }
          />
        )}
        {...rest}
      />
    );
  }
);

CompartmentSelector.displayName = 'CompartmentSelector';
