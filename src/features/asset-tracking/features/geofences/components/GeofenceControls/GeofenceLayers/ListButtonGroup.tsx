import { MouseEventHandler } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRbac } from '@carrier-io/rbac-provider-react';
import ListItemIcon from '@carrier-io/fds-react/ListItemIcon';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import ListItemSecondaryAction from '@carrier-io/fds-react/ListItemSecondaryAction';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import Typography from '@carrier-io/fds-react/Typography';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import { useTranslation } from 'react-i18next';

import { UNASSIGNED_GROUP_ID } from '../../../../../constants';

import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { MenuItemIconButton, LocationIcon } from '@/components';
import { companyActionPayload } from '@/features/authorization';

const iconButtonSx = {
  '&:hover': {
    backgroundColor: 'transparent',
  },
};

const iconSx = {
  fontSize: 16,
};

type ListButtonGroupProps = {
  groupid: string;
  active: boolean;
  color: string;
  name: string;
  onGroupFilterClick: (groupId: string) => void;
  onGroupEditClick?: (groupId: string) => void;
};

export const ListButtonGroup = (props: ListButtonGroupProps) => {
  const { t } = useTranslation();
  const { groupid, active, color, name, onGroupFilterClick, onGroupEditClick } = props;

  const tenantId = useAppSelector(getAuthTenantId);

  const { hasPermission } = useRbac();
  const shouldShowGroupEdit = hasPermission(companyActionPayload('geofence.groupEdit', tenantId));

  const handleClick = () => {
    onGroupFilterClick(groupid);
  };

  const handleEditClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onGroupEditClick?.(groupid);
  };

  const itemOpacity = active ? 1 : 0.3;

  return (
    <MenuItem
      onClick={handleClick}
      style={{ height: 40, opacity: itemOpacity, cursor: 'pointer', margin: 0 }}
      sx={{
        pl: 3,
        '&:hover .MuiListItemSecondaryAction-root': { visibility: 'visible' },
        '& .MuiListItemIcon-root': { minWidth: 28 },
      }}
    >
      <ListItemIcon>{color && <LocationIcon colorIcon={color} fontSize="small" />}</ListItemIcon>

      <ListItemText primary={<Typography variant="body2">{name}</Typography>} />
      <ListItemSecondaryAction sx={{ visibility: 'hidden' }}>
        {shouldShowGroupEdit && groupid !== UNASSIGNED_GROUP_ID && (
          <Tooltip
            classes={{ popper: 'MuiTooltip-popper-subheader' }}
            title={t('geofences.group.edit-group')}
          >
            <MenuItemIconButton
              edge="end"
              size="small"
              disableRipple
              onClick={handleEditClick}
              sx={{ ...iconButtonSx, mr: 1 }}
            >
              <EditIcon sx={{ ...iconSx }} />
            </MenuItemIconButton>
          </Tooltip>
        )}
        <Tooltip classes={{ popper: 'MuiTooltip-popper-subheader' }} title={t('geofences.group.hide-group')}>
          <MenuItemIconButton edge="end" size="small" disableRipple sx={iconButtonSx}>
            {active && <VisibilityIcon sx={{ ...iconSx }} />}
            {!active && <VisibilityOffIcon sx={{ ...iconSx }} />}
          </MenuItemIconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </MenuItem>
  );
};
