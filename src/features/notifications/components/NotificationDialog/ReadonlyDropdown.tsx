import { useState } from 'react';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Select from '@carrier-io/fds-react/Select';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Input from '@carrier-io/fds-react/Input';

interface DropdownItem<T> {
  label: string;
  value: T;
}

interface DropdownProps<T> {
  items: DropdownItem<T>[];
  selectValue: string;
  isLoading?: boolean;
}

export const ReadonlyDropdown = <T extends unknown>({ items, selectValue, isLoading }: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return !isLoading ? (
    <Select
      input={<Input hiddenLabel sx={{ minWidth: 150 }} />}
      open={open}
      displayEmpty
      onClose={handleClose}
      onOpen={handleOpen}
      value=""
      sx={{
        mx: 2,
      }}
      size="small"
    >
      <MenuItem disabled value="">
        {selectValue}
      </MenuItem>
      {items
        .slice()
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((item) => (
          <MenuItem disabled value={item.value as string} key={item.value as string}>
            {item.label}
          </MenuItem>
        ))}
    </Select>
  ) : (
    <CircularProgress style={{ marginLeft: 10 }} size={18} />
  );
};
