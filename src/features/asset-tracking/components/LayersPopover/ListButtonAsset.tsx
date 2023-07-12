import CircleIcon from '@mui/icons-material/FiberManualRecord';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ListItemIcon from '@carrier-io/fds-react/ListItemIcon';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import ListItemSecondaryAction from '@carrier-io/fds-react/ListItemSecondaryAction';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import Typography from '@carrier-io/fds-react/Typography';

import { AssetLayerFilterType } from '../../types';

import { MenuItemIconButton } from '@/components';

const iconButtonSx = {
  '&:hover': {
    backgroundColor: 'transparent',
  },
};

const iconSx = {
  fontSize: 16,
};

type ListButtonAssetProps = {
  assetState: AssetLayerFilterType;
  active: boolean;
  color: string;
  name: string;
  onAssetFilterClick: (filterType: AssetLayerFilterType) => void;
};

export const ListButtonAsset = (props: ListButtonAssetProps) => {
  const { active, color, name, onAssetFilterClick, assetState } = props;
  const itemOpacity = active ? 1 : 0.3;

  const handleClick = () => {
    onAssetFilterClick(assetState);
  };

  return (
    <MenuItem
      onClick={handleClick}
      style={{
        height: 40,
        opacity: itemOpacity,
        cursor: 'pointer',
        margin: 0,
      }}
      sx={{
        pl: 3.5,
        '&:hover .MuiListItemSecondaryAction-root': { visibility: 'visible' },
        '& .MuiListItemIcon-root': { minWidth: 24 },
      }}
    >
      <ListItemIcon>
        <CircleIcon sx={{ width: '16px' }} style={{ color }} />
      </ListItemIcon>
      <ListItemText primary={<Typography variant="body2">{name}</Typography>} />
      <ListItemSecondaryAction sx={{ visibility: 'hidden' }}>
        <MenuItemIconButton edge="end" size="small" disableRipple sx={{ ...iconButtonSx, mr: '2px' }}>
          {active && <VisibilityIcon sx={{ ...iconSx }} />}
          {!active && <VisibilityOffIcon sx={{ ...iconSx }} />}
        </MenuItemIconButton>
      </ListItemSecondaryAction>
    </MenuItem>
  );
};
