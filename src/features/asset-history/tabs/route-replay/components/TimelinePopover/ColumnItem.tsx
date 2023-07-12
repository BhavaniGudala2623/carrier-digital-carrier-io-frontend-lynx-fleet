import MenuItem from '@carrier-io/fds-react/MenuItem';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import Typography from '@carrier-io/fds-react/Typography';
import ListItemSecondaryAction from '@carrier-io/fds-react/ListItemSecondaryAction';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import { useTranslation } from 'react-i18next';

import { useColumnPopupContext } from '../../providers';

import { IColumnData } from '@/types';

interface ColumnItemProps {
  groupId?: string;
  columnData: IColumnData;
}
export const ColumnItem = ({ groupId, columnData }: ColumnItemProps) => {
  const { t } = useTranslation();
  const { toggleVisibility } = useColumnPopupContext();
  const {
    isVisible,
    colConfig: { subTitleKey },
  } = columnData;

  const handleClick = () => {
    if (groupId) {
      toggleVisibility(groupId, { ...columnData, isVisible: !isVisible });
    }
  };

  return (
    <MenuItem
      onChange={handleClick}
      style={{ height: 40, cursor: 'pointer', margin: 0 }}
      sx={{
        pl: 3,
        '&:hover .MuiListItemSecondaryAction-root': { visibility: 'visible' },
        '& .MuiListItemIcon-root': { minWidth: 28 },
      }}
    >
      <ListItemSecondaryAction
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '90%',
          fontSize: 16,
          paddingLeft: 4,
        }}
      >
        <FormControlLabel
          key={subTitleKey}
          control={<Checkbox checked={isVisible ?? false} name={subTitleKey} size="medium" />}
          label={<Typography variant="body2">{t(subTitleKey || 'column')}</Typography>}
        />
      </ListItemSecondaryAction>
    </MenuItem>
  );
};
