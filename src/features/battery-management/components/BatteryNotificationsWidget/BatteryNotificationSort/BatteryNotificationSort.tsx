import Input from '@carrier-io/fds-react/Input';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Select from '@carrier-io/fds-react/Select';
import { CSSProperties, useState } from 'react';
import { Typography } from '@carrier-io/fds-react';
import { ArrowDropDown } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { IBatteryNotificationSortItem, TwoOrMoreArray } from '../../../types';

interface IBatteryNotificationSort {
  styles?: CSSProperties;
  items: TwoOrMoreArray<IBatteryNotificationSortItem>;
  onChangeItem?: (value: IBatteryNotificationSortItem) => void;
}

export const BatteryNotificationSort = ({ styles, items, onChangeItem }: IBatteryNotificationSort) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const { t } = useTranslation();

  return (
    <Select
      input={<Input />}
      renderValue={() => (
        <Typography color="secondary" sx={{ opacity: 0.9 }} variant="caption" paddingRight="12px">
          {t('battery.management.battery.notifications.sort-by')}{' '}
          {items[selectedItemIndex].name.toLowerCase()}
        </Typography>
      )}
      sx={{
        background: 'transparent',
        ...styles,
      }}
      size="small"
      SelectDisplayProps={{ style: { paddingTop: 0, paddingBottom: 0, paddingLeft: 0 } }}
      inputProps={{ style: { padding: 1 } }}
      componentsProps={{
        root: { style: { background: 'transparent', padding: 0 } },
      }}
      IconComponent={ArrowDropDown}
      value={items[selectedItemIndex].value}
      defaultValue={items[0].value}
      tabIndex={selectedItemIndex}
    >
      {items.map((item, index) => (
        <MenuItem
          value={item.value}
          key={item.name}
          onClick={() => {
            setSelectedItemIndex(index);
            if (onChangeItem) {
              onChangeItem(items[index]);
            }
          }}
        >
          {item.name}
        </MenuItem>
      ))}
    </Select>
  );
};
