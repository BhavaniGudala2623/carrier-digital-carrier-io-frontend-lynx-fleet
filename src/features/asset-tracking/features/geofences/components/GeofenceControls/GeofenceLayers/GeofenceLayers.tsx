import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Collapse from '@carrier-io/fds-react/Collapse';
import List from '@carrier-io/fds-react/List';
import ListItemButton from '@carrier-io/fds-react/ListItemButton';
import ListItemIcon from '@carrier-io/fds-react/ListItemIcon';
import ListItemSecondaryAction from '@carrier-io/fds-react/ListItemSecondaryAction';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import Typography from '@carrier-io/fds-react/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import { grey } from '@mui/material/colors';

import { useGeofenceGroup, EditGeofenceGroup } from '../../../../geofenceGroups';
import { getHexColor } from '../../../../../utils';

import { ListButtonGroup } from './ListButtonGroup';

import { useToggle } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/stores';
import { geofenceGroupsSlice, UNASSIGNED_GROUP_ID } from '@/stores/assets/geofenceGroup';
import { ExpandIcon, MenuItemIconButton } from '@/components';

const iconButtonSx = {
  '&:hover': {
    backgroundColor: 'transparent',
  },
};

const iconSx = {
  fontSize: 16,
};

export const GeofenceLayers = () => {
  const { t } = useTranslation();

  const { geofenceState, geofenceGroupsState } = useAppSelector(
    (state) => ({
      geofenceState: state.geofences,
      geofenceGroupsState: state.geofenceGroups,
    }),
    shallowEqual
  );

  const geofencesLoading = geofenceState.isLoading || geofenceGroupsState.isLoading;
  const { entities: geofenceGroups, filters: filterGroups } = geofenceGroupsState;

  const dispatch = useAppDispatch();
  const { actions } = geofenceGroupsSlice;

  const {
    value: openEditGeofenceGroupDialog,
    toggleOn: handleOpenEditGeofenceGroupDialog,
    toggleOff: handleCloseEditGeofenceGroupDialog,
  } = useToggle(false);

  const [expandedGroups, setGroupsExpanded] = useState(true);
  const [geofenceAll, setGeofenceAll] = useState(false);

  const { group, handleSetGroupId } = useGeofenceGroup();

  const handleGroupsExpandClick = (e) => {
    setGroupsExpanded(!expandedGroups);
    e.stopPropagation();
  };

  const handleClickGroup = (groupid: string) => {
    dispatch(actions.setGeofenceGroupFilter({ groupid }));
  };

  const expandGeofenceAll = (changeExpandState) => {
    if (changeExpandState) {
      setGroupsExpanded(!expandedGroups);
    }
  };

  const toggleGeofenceAll = (event: MouseEvent<HTMLButtonElement>, changeExpandState: boolean) => {
    event.stopPropagation();
    const newGeofenceAll = !geofenceAll;
    setGeofenceAll(!geofenceAll);
    dispatch(actions.setGeofenceGroupFilterAll({ newGeofenceAll }));

    expandGeofenceAll(changeExpandState);
  };

  const handleEditGroupClick = useCallback(
    (currentGroupId) => {
      handleSetGroupId(currentGroupId);
      handleOpenEditGeofenceGroupDialog();
    },
    [handleOpenEditGeofenceGroupDialog, handleSetGroupId]
  );

  const groupList = geofenceGroups?.map((geofenceGroup) => (
    <ListButtonGroup
      key={`geofenceGroup-${geofenceGroup.name}${geofenceGroup.groupId}`}
      groupid={geofenceGroup.groupId}
      color={getHexColor(geofenceGroup.color)}
      name={geofenceGroup.name}
      active={filterGroups.includes(geofenceGroup.groupId)}
      onGroupEditClick={handleEditGroupClick}
      onGroupFilterClick={handleClickGroup}
    />
  ));

  useEffect(() => {
    if (filterGroups) {
      setGeofenceAll(filterGroups.length !== 0);
    }
  }, [filterGroups]);

  const geofenceAllOpacity = geofenceAll ? 1 : 0.3;
  const unassignedActive = filterGroups?.includes(UNASSIGNED_GROUP_ID);

  return (
    <>
      <List
        aria-label={t('geofences.geofence-groups')}
        sx={{ backgroundColor: 'white', padding: 0, minWidth: 200 }}
      >
        <ListItemButton
          sx={{
            height: 40,
            opacity: geofenceAllOpacity,
            padding: '8px 4px',
            cursor: 'pointer',
            borderRadius: 1,
            '&:hover .MuiListItemSecondaryAction-root': {
              visibility: 'visible',
            },
            '&:hover .MuiListItemIcon-root': {
              visibility: 'visible',
            },
          }}
          onClick={() => expandGeofenceAll(true)}
          disabled={geofencesLoading}
        >
          {geofencesLoading ? (
            <ListItemIcon sx={{ minWidth: '24px' }}>
              <CircularProgress sx={{ marginRight: '10px' }} size={18} />
            </ListItemIcon>
          ) : (
            <ListItemIcon sx={{ minWidth: '24px', visibility: 'hidden' }} onClick={handleGroupsExpandClick}>
              <ExpandIcon expanded={expandedGroups} sx={{ ...iconSx }} />
            </ListItemIcon>
          )}
          <ListItemText primary={<Typography variant="body2">{t('geofences.geofences')}</Typography>} />
          <ListItemSecondaryAction sx={{ visibility: 'hidden' }}>
            <Tooltip
              classes={{ popper: 'MuiTooltip-popper-subheader' }}
              title={t('buttons.tooltip.hide-layer')}
            >
              <MenuItemIconButton
                edge="end"
                size="small"
                disableRipple
                sx={iconButtonSx}
                onClick={(e) => toggleGeofenceAll(e, false)}
                disabled={geofencesLoading}
              >
                {geofenceAll && <VisibilityIcon sx={{ ...iconSx }} />}
                {!geofenceAll && <VisibilityOffIcon sx={{ ...iconSx }} />}
              </MenuItemIconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItemButton>
      </List>
      <Collapse in={!geofencesLoading && expandedGroups} timeout="auto" unmountOnExit>
        <List aria-label={t('geofences.geofence-groups')} sx={{ backgroundColor: 'white', padding: 0 }}>
          {groupList}
          <ListButtonGroup
            groupid="0"
            color={grey[500]}
            name={t('geofences.geofence-ungrouped')}
            active={unassignedActive}
            onGroupFilterClick={handleClickGroup}
          />
        </List>
      </Collapse>
      <EditGeofenceGroup
        group={group}
        open={openEditGeofenceGroupDialog}
        onClose={handleCloseEditGeofenceGroupDialog}
      />
    </>
  );
};
