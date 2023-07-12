import FormControl, { FormControlProps } from '@carrier-io/fds-react/FormControl';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Select, { SelectProps } from '@carrier-io/fds-react/Select';
import { ClearButtonEndAdornment } from '@carrier-io/fds-react';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/material';
import Input from '@carrier-io/fds-react/Input';
import InputLabel from '@carrier-io/fds-react/InputLabel';
import { FotawebGroup, Maybe } from '@carrier-io/lynx-fleet-types';

import { SelectorPlaceholder } from './SelectorPlaceholder';

interface IProps {
  placeholder?: string;
  onChange: SelectProps['onChange'];
  label?: string;
  value?: string;
  name?: string;
  options?: string[] | Maybe<FotawebGroup[]>;
  dictionary?: Record<string, string>;
  translate?: boolean;
  timeZones?: string[];
  error?: boolean;
  helperText?: string | boolean;
  onBlur?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  stylesFormControl?: SxProps;
  stylesSelect?: SxProps;
  stylesInputLabel?: SxProps;
  stylesMenu?: SxProps;
  stylesMenuItem?: SxProps;
  stylesInput?: SxProps;
  required?: boolean;
  disabled?: boolean;
  children?: SelectProps['children'];
  labelId?: SelectProps['labelId'];
  color?: SelectProps['color'];
  input?: SelectProps['input'];
  size?: FormControlProps['size'];
  sx?: SelectProps['sx'];
  readOnly?: SelectProps['readOnly'];
  fullWidth?: SelectProps['fullWidth'];
  disableUnderline?: SelectProps['disableUnderline'];
  hideBackgroundColor?: SelectProps['hideBackgroundColor'];
  showBorder?: SelectProps['showBorder'];
  onClear?: () => void;
}

export const FormSelect = (props: IProps) => {
  const {
    size = 'small',
    placeholder,
    onChange,
    value = '',
    name = '',
    options,
    dictionary,
    translate,
    timeZones,
    error,
    helperText,
    onBlur,
    label,
    required = false,
    stylesFormControl,
    stylesSelect,
    stylesInputLabel,
    stylesMenu,
    stylesMenuItem,
    disabled = false,
    children,
    readOnly,
    stylesInput,
    onClear,
    ...rest
  } = props;
  const { t } = useTranslation();

  const renderItem = (item: string, index: number) => {
    let output;

    if (dictionary) {
      output = translate ? t(dictionary[item]) : dictionary[item];
    } else if (timeZones) {
      output = timeZones[index];
    } else {
      output = item;
    }

    return output;
  };

  const hiddenLabelStyle = !label
    ? {
        '& .MuiSelect-select': {
          paddingTop: 2,
          paddingBottom: 2,
        },
      }
    : null;

  return (
    <FormControl
      sx={{
        '& .MuiSelect-nativeInput': {
          height: '100%',
          padding: 2,
        },
        ...stylesFormControl,
      }}
      variant="filled"
      fullWidth
      error={error}
      size={size}
      required={required}
    >
      {label && <InputLabel sx={stylesInputLabel && { ...stylesInputLabel }}>{label}</InputLabel>}
      <Select
        displayEmpty
        renderValue={
          value !== ''
            ? undefined
            : () =>
                placeholder && (
                  <SelectorPlaceholder>
                    {required ? `${t(placeholder)} *` : t(placeholder)}
                  </SelectorPlaceholder>
                )
        }
        value={value}
        name={name}
        label={label}
        onChange={onChange}
        onBlur={onBlur}
        MenuProps={stylesMenu ? { sx: { ...stylesMenu } } : undefined}
        input={
          <Input
            hiddenLabel={!label}
            readOnly={readOnly}
            sx={stylesInput}
            endAdornment={
              value && onClear && <ClearButtonEndAdornment position="end" handleClear={onClear} />
            }
          />
        }
        sx={{
          height: '48px',
          ...hiddenLabelStyle,
          ...stylesSelect,
        }}
        disabled={disabled}
        size={size}
        {...rest}
      >
        {children ||
          options?.map((item, index) => (
            <MenuItem sx={stylesMenuItem} key={item} value={item}>
              {renderItem(item, index)}
            </MenuItem>
          ))}
      </Select>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

FormSelect.displayName = 'FormSelect';
