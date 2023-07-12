import { FC } from 'react';
import { Divider, SvgIconProps, Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { makeStyles } from '@mui/styles';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { BatteryFilterTypes } from '../../../types';

const filterButtonStyles = makeStyles(() => ({
  root: {
    background: fleetThemeOptions.palette.background.paper,
    height: '129px',
    borderRadius: '8px',
    userSelect: 'none',
    cursor: 'pointer',
  },
  zeroCount: { cursor: 'default' },
  titleBox: {
    display: 'flex',
    padding: '20px 8px 10px 8px',
    alignItems: 'center',
    gap: '4px',
    transition: 'all .1s',
  },
  titleBoxBorder: {
    borderRadius: '8px 8px 0px 0px',
    boxShadow: `inset 0 0 0 1px ${fleetThemeOptions.palette.primary.outlinedRestingBackground}`,
    backgroundColor: fleetThemeOptions.palette.primary.outlinedHoverBackground,
  },
  divider: { width: '80%', margin: 'auto' },
  dividerHidden: { visibility: 'hidden' },
  buttonNameBox: { width: '95px', marginTop: '8px', padding: '0px 8px' },
}));

interface ISecondaryFilterButton {
  onSelected: (filterType: BatteryFilterTypes | '') => void;
  buttonType: BatteryFilterTypes;
  name: string;
  count: number;
  icon: FC<SvgIconProps>;
  selectedFilter: BatteryFilterTypes | '';
  id?: string;
}

export const SecondaryFilterButton = (props: ISecondaryFilterButton) => {
  const { buttonType, selectedFilter, name, count, icon: Icon, onSelected, id } = props;

  const classes = filterButtonStyles();

  const isSelected = buttonType === selectedFilter;
  const titleBoxClasses = `${classes.titleBox} ${isSelected ? classes.titleBoxBorder : ''}`;
  const dividerClasses = `${classes.divider} ${isSelected ? classes.dividerHidden : ''}`;
  const rootBoxClasses = `${classes.root} ${count ? '' : classes.zeroCount}`;

  const handleFilterClick = () => {
    if (isSelected) {
      onSelected('');
    } else {
      onSelected(buttonType);
    }
  };

  return (
    <Box className={rootBoxClasses} id={id} onClick={count ? handleFilterClick : undefined}>
      <Box className={titleBoxClasses}>
        <Icon width={16} height={16} />
        <Typography
          variant="h6"
          sx={{
            color: fleetThemeOptions.palette.primary.dark,
          }}
          lineHeight={0}
        >
          {count.toLocaleString()}
        </Typography>
      </Box>
      <Divider className={dividerClasses} />
      <Box className={classes.buttonNameBox}>
        <Typography
          variant="caption"
          sx={{
            color: fleetThemeOptions.palette.text.primary,
            letterSpacing: -0.9,
          }}
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
};
