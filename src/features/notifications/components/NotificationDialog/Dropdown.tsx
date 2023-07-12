import { useCallback, useState } from 'react';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Select, { SelectProps } from '@carrier-io/fds-react/Select';
import FormControl from '@carrier-io/fds-react/FormControl';
import Input from '@carrier-io/fds-react/Input';
import { KeyboardArrowDown } from '@mui/icons-material';

interface DropdownItem<T> {
  label: string;
  value: T;
}

interface DropdownProps<T> {
  items: DropdownItem<T>[];
  value: string;
  onChange: (value: T) => void;
}

export function useDropdownOption<T>(initialValue: T) {
  const [option, setOption] = useState<T>(initialValue);

  const handleOptionChange = useCallback((newOption: T) => {
    setOption(newOption);
  }, []);

  return {
    option,
    handleOptionChange,
  };
}

const DropdownIcon = (props) => (
  <KeyboardArrowDown
    {...props}
    fontSize="small"
    sx={{ mt: 1, ml: -3.5, fill: (theme) => theme.palette.primary.main }}
  />
);

export const Dropdown = <T extends unknown>({ value, items, onChange }: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);

  const handleChange: SelectProps['onChange'] = (event) => {
    onChange(event.target.value as T);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl>
      <Select
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={handleChange}
        value={value}
        input={<Input />}
        IconComponent={DropdownIcon}
        sx={{ mb: 2, ml: -0.5, mr: 0.5, color: (theme) => theme.palette.primary.main }}
        size="small"
        hideBackgroundColor
      >
        {items.map((item) => (
          <MenuItem value={item.value as string} key={item.value as string}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
