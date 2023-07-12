import { CSSProperties, FC } from 'react';
import Box from '@carrier-io/fds-react/Box';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { SvgIconProps, Typography } from '@carrier-io/fds-react';
import { makeStyles } from '@mui/styles';

import { BatteryFilterTypes } from '@/features/battery-management/types';

const filterButtonsStyles = makeStyles(() => ({
  baseFilter: {
    border: '1px solid',
    borderColor: fleetThemeOptions.palette.addition.divider,
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    maxWidth: '400px',
    userSelect: 'none',
    transition: 'all .1s',
    cursor: 'pointer',
  },
  selected: { backgroundColor: fleetThemeOptions.palette.primary.outlinedHoverBackground },
  zeroCount: { cursor: 'default' },
  iconBox: { display: 'flex', gap: '2px', alignItems: 'center' },
  name: { color: fleetThemeOptions.palette.secondary.main, flex: '1', marginRight: '20px' },
}));

interface IPrimaryFilterButton {
  boxStyles: CSSProperties;
  onSelected: (filterType: BatteryFilterTypes | '') => void;
  buttonType: BatteryFilterTypes;
  name: string;
  count: number;
  icons: [FC<SvgIconProps>, FC<SvgIconProps> | null];
  selectedFilter: BatteryFilterTypes | '';
  iconColors?: {
    fisrtIconColor?: string;
    secondIconColor?: string;
  };
  id?: string;
}

export const PrimaryFilterButton = (props: IPrimaryFilterButton) => {
  const classes = filterButtonsStyles();
  const {
    name,
    count,
    boxStyles = {
      borderLeft: 'none',
      borderRight: 'none',
    },
    buttonType,
    onSelected,
    selectedFilter,
    icons,
    iconColors = {},
    id,
  } = props;
  const isSelected = buttonType === selectedFilter;
  const [FirstIcon, SecondIcon] = icons;
  const boxClasses = `${classes.baseFilter} ${isSelected ? classes.selected : ''} ${
    count ? '' : classes.zeroCount
  }`;

  const handleFilterClick = () => {
    if (isSelected) {
      onSelected('');
    } else {
      onSelected(buttonType);
    }
  };

  return (
    <Box className={boxClasses} id={id} style={boxStyles} onClick={count ? handleFilterClick : undefined}>
      <Box className={classes.iconBox}>
        <FirstIcon width={16} height={16} fill={iconColors.fisrtIconColor} />
        {SecondIcon ? <SecondIcon width={16} height={16} fill={iconColors.secondIconColor} /> : null}
      </Box>
      <Typography variant="caption" className={classes.name}>
        {name}
      </Typography>
      <Typography sx={{ color: fleetThemeOptions.palette.primary.dark }} variant="h6">
        {count.toLocaleString()}
      </Typography>
    </Box>
  );
};
