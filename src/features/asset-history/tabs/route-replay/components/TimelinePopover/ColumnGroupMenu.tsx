import { useMemo, useState } from 'react';
import Collapse from '@carrier-io/fds-react/Collapse';
import List from '@carrier-io/fds-react/List';
import ListItemButton from '@carrier-io/fds-react/ListItemButton';
import ListItemIcon from '@carrier-io/fds-react/ListItemIcon';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import Typography from '@carrier-io/fds-react/Typography';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import Checkbox from '@carrier-io/fds-react/Checkbox';

import { useColumnPopupContext } from '../../providers';

import { ColumnItem } from './ColumnItem';

import { ExpandIcon } from '@/components';
import { IColumnData, IColumnGroup } from '@/types';

interface IColumnsMenuProps {
  columnGroup: IColumnGroup;
  isTopLevel: boolean;
}

export const ColumnGroupMenu = ({ columnGroup, isTopLevel }: IColumnsMenuProps) => {
  const { setGroupVisible, selectedGroups } = useColumnPopupContext();
  const { groupId, columnDataArr } = columnGroup;
  const isChecked = groupId && selectedGroups.includes(groupId);
  const isIndeterminate = useMemo(
    () => !isChecked && columnDataArr.some((column) => column.isVisible),
    [columnDataArr, isChecked]
  );
  const [expandedGroup, setGroupExpanded] = useState((isChecked || isIndeterminate) && isTopLevel);

  const handleGroupsExpandClick = (e) => {
    setGroupExpanded((prev) => !prev);
    e.stopPropagation();
  };

  const toggleGroup = () => {
    if (groupId) {
      setGroupVisible(groupId, !isChecked);
    }

    if (isChecked) {
      setGroupExpanded((prev) => !prev);
    }
  };

  const handleExpandGroup = () => setGroupExpanded(true);

  const columnList = columnDataArr?.map((colData: IColumnData) => (
    <ColumnItem key={`${groupId}-${colData.colId}`} groupId={groupId} columnData={colData} />
  ));

  return (
    <>
      <List sx={{ paddingTop: 1, minWidth: 200 }}>
        <ListItemButton
          sx={{
            height: 40,
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
          onClick={handleExpandGroup}
        >
          <Checkbox
            checked={isIndeterminate || !!isChecked}
            indeterminate={isIndeterminate}
            size="medium"
            onChange={toggleGroup}
          />
          <ListItemText primary={<Typography variant="body2">{groupId}</Typography>} />

          <ListItemIcon sx={{ minWidth: '24px', visibility: 'visible' }} onClick={handleGroupsExpandClick}>
            <ExpandIcon expanded={expandedGroup} sx={{ fontSize: 18 }} />
          </ListItemIcon>
        </ListItemButton>
      </List>
      <Collapse in={expandedGroup} timeout="auto" unmountOnExit>
        <List
          aria-label="sensor-columns"
          sx={{ backgroundColor: fleetThemeOptions.palette.background.paper, padding: 0 }}
        >
          {columnList}
        </List>
      </Collapse>
    </>
  );
};
