import { useCallback, useMemo, useState, MouseEvent } from 'react';
import { ArrowDropDown, ArrowDropUp, Close } from '@mui/icons-material';
import Box from '@carrier-io/fds-react/Box';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import IconButton from '@carrier-io/fds-react/IconButton';
import InputAdornment from '@carrier-io/fds-react/InputAdornment';
import Menu from '@carrier-io/fds-react/Menu';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import TextField from '@carrier-io/fds-react/TextField';
import Chip from '@carrier-io/fds-react/Chip';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { styled } from '@mui/material';
import { Group, Maybe } from '@carrier-io/lynx-fleet-types';

import { generateId, getTreeNodeName, parseNodeId } from '../../../../../utils';
import { useLimitAccess, AccessLimitTreeNodeType } from '../../../../../hooks';
import { hasAssessRestrictions } from '../../../utils';

import { NestedMenuItem } from '@/components';

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  margin: 0,
  '& .MuiFormHelperText-root': {
    fontSize: theme.typography.pxToRem(16),
  },
  '& .MuiInputBase-root': {
    height: '48px',
    paddingRight: theme.spacing(2.5),
  },
}));

const chipContainerStyles = {
  width: '70%',
  display: 'flex',
  flexWrap: 'wrap',
  py: 0.5,
  '& div': {
    mb: 0.5,
  },
};

const chipStyles = {
  height: (theme) => theme.spacing(3),
  '&.MuiChip-root': {
    borderRadius: (theme) => theme.spacing(0.5),
  },
};

const Counter = styled('span')(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: 'auto',
  width: theme.spacing(12),
  color: 'primary',
  '&.MuiChip-root': {
    borderRadius: theme.spacing(0.5),
  },
}));

interface LimitAccessSelectProps {
  limitedCompanies: string[];
  limitedRegions: string[];
  onLimitCountriesChange: (countries: string[], regions: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  accessAllowedRestrictions: Group['accessAllowedRestrictions'];
  allowedRegions: Maybe<string[]>;
  allowedCountries: Maybe<string[]>;
}

type BuildMenuOptionsProps = {
  handleMenuItemClick: (node: AccessLimitTreeNodeType, checked: boolean) => void;
  isSelected: (node: AccessLimitTreeNodeType) => boolean;
  isPartialySelected: (node: AccessLimitTreeNodeType) => boolean;
};

const buildMenuItem = (
  root: AccessLimitTreeNodeType,
  t: TFunction<'translation'>,
  { handleMenuItemClick, isSelected, isPartialySelected }: BuildMenuOptionsProps
): JSX.Element => {
  const children = root.children ?? [];
  const rootLabel = t(getTreeNodeName(root.nodeId));
  const { type, id } = parseNodeId(root.nodeId);
  const keyMenu = generateId(type, id);
  if (children.length === 0 || type !== 'REGION') {
    return (
      <MenuItem key={keyMenu}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={isSelected(root)}
              onChange={(value) => handleMenuItemClick(root, value.target.checked)}
            />
          }
          label={rootLabel}
        />
      </MenuItem>
    );
  }

  return (
    <NestedMenuItem
      key={keyMenu}
      label={rootLabel}
      parentMenuOpen
      additionalContent={
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={isSelected(root)}
              indeterminate={isPartialySelected(root)}
              onChange={(value) => handleMenuItemClick(root, value.target.checked)}
            />
          }
          label={rootLabel}
        />
      }
    >
      {children.map((child) =>
        buildMenuItem(child, t, { handleMenuItemClick, isSelected, isPartialySelected })
      )}
    </NestedMenuItem>
  );
};

const buildRootItem = (
  root: AccessLimitTreeNodeType[],
  t: TFunction<'translation'>,
  { handleMenuItemClick, isSelected, isPartialySelected }: BuildMenuOptionsProps
): JSX.Element | JSX.Element[] => {
  if (root[0].nodeId === 'GLOBAL|Global') {
    return (
      root[0].children?.map((child) =>
        buildMenuItem(child, t, { handleMenuItemClick, isSelected, isPartialySelected })
      ) || []
    );
  }

  return root.map((item) => buildMenuItem(item, t, { handleMenuItemClick, isSelected, isPartialySelected }));
};

export const LimitAccessSelect = ({
  limitedCompanies,
  limitedRegions,
  onLimitCountriesChange,
  disabled = false,
  placeholder = '',
  accessAllowedRestrictions,
  allowedRegions,
  allowedCountries,
}: LimitAccessSelectProps) => {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [limitAccess, setLimitAccess] = useState(hasAssessRestrictions(accessAllowedRestrictions));

  const {
    accessLimitTree,
    handleToggleNode,
    deleteNode,
    deleteAllNodes,
    isSelected,
    isPartialySelected,
    countries,
    regions,
  } = useLimitAccess({
    countries: limitedCompanies,
    regions: limitedRegions,
    onCountriesListChange: onLimitCountriesChange,
    allowedRegions,
    allowedCountries,
  });

  const textFieldElement = document.getElementById('limit-access-field')?.parentElement;

  const handleMenuItemClick = useCallback(
    (node: AccessLimitTreeNodeType, checked: boolean) => {
      handleToggleNode(node, checked);
    },
    [handleToggleNode]
  );

  const open = Boolean(anchorEl);

  const menuItems = useMemo(
    () => buildRootItem(accessLimitTree, t, { handleMenuItemClick, isSelected, isPartialySelected }),
    [handleMenuItemClick, isSelected, isPartialySelected, accessLimitTree, t]
  );

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    if (disabled) {
      return;
    }
    setAnchorEl(anchorEl ? null : textFieldElement || null);
  };

  const handleClearAll = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    deleteAllNodes();
  };

  const onClickAway = () => {
    setExpanded(false);
  };

  const handleTextFiledClick = () => {
    setExpanded(true);
  };

  const handleChangeLimitAccess = () => {
    setLimitAccess((prev) => {
      if (prev) {
        handleClearAll();
      }

      return !prev;
    });
  };

  const regionsAndCountries = [
    ...regions.map((region) => ({ node: 'REGION', name: region })),
    ...countries.map((country) => ({ node: 'COUNTRY', name: country })),
  ];

  const lastRegionOrCountry = regionsAndCountries[regionsAndCountries.length - 1];

  return (
    <Box mb={3}>
      <FormControlLabel
        control={<Checkbox size="small" checked={limitAccess} onChange={handleChangeLimitAccess} />}
        label={t('user.management.user-group.limit-access')}
        sx={{ mb: 3, ml: -0.75 }}
      />
      <ClickAwayListener onClickAway={onClickAway}>
        <TextFieldStyled
          id="limit-access-field"
          onClick={handleTextFiledClick}
          placeholder={regionsAndCountries.length === 0 ? placeholder : ''}
          disabled
          InputProps={{
            startAdornment: regionsAndCountries.length > 0 && (
              <>
                <Box sx={expanded ? chipContainerStyles : {}}>
                  {expanded ? (
                    regionsAndCountries.map(({ name, node }) => (
                      <Chip
                        key={name}
                        sx={chipStyles}
                        label={t(getTreeNodeName(`${node}|${name}`))}
                        onDelete={() => deleteNode({ name, node })}
                      />
                    ))
                  ) : (
                    <Chip
                      sx={chipStyles}
                      label={t(getTreeNodeName(`${lastRegionOrCountry.node}|${lastRegionOrCountry.name}`))}
                      onDelete={() =>
                        deleteNode({ name: lastRegionOrCountry.name, node: lastRegionOrCountry.node })
                      }
                    />
                  )}
                </Box>
                {countries.length > 1 && !expanded && <Counter>{`+${countries.length - 1}`}</Counter>}
              </>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ marginLeft: 'auto' }}>
                <IconButton
                  sx={{
                    '&.Mui-disabled': {
                      color: (theme) => theme.palette.action.disabled,
                    },
                  }}
                  disabled={regionsAndCountries.length === 0 || disabled || !limitAccess}
                  onClick={handleClearAll}
                >
                  <Close />
                </IconButton>
                <IconButton edge="end" disabled={disabled || !limitAccess} onClick={handleClick}>
                  {open ? <ArrowDropUp /> : <ArrowDropDown />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
          fullWidth
        />
      </ClickAwayListener>
      <Menu
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {menuItems}
      </Menu>
    </Box>
  );
};
