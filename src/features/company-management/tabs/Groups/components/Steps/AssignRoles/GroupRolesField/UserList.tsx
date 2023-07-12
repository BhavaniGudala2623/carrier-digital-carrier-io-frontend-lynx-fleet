import Box from '@carrier-io/fds-react/Box';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import Typography from '@carrier-io/fds-react/Typography';
import Paper from '@carrier-io/fds-react/Paper';
import { useTranslation } from 'react-i18next';
import { GroupRole } from '@carrier-io/lynx-fleet-types';

import { UserItem } from '../../../../types';

interface UserListProps {
  users: UserItem[];
  onSelect: (user: UserItem, value: boolean) => void;
  onSelectAll: (value: boolean) => void;
  groupRole: GroupRole;
}

export const UserList = ({ users, groupRole, onSelect, onSelectAll }: UserListProps) => {
  const { t } = useTranslation();

  const allSelected = users.length > 0 && users.every((user) => user.checked);
  const selectedUserCount = users.filter((user) => user.checked).length;

  return (
    <Paper>
      <>
        <Box
          sx={{
            display: 'flex',
            p: 1,
            borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
          }}
        >
          <Checkbox
            size="small"
            checked={allSelected}
            onChange={(value) => onSelectAll(value.target.checked)}
          />
          <div>
            <Typography variant="body1" fontWeight={500}>
              {groupRole}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t('company.management.create-group.checked', {
                all: users.length,
                checked: selectedUserCount,
              })}
            </Typography>
          </div>
        </Box>
        <Box
          sx={{
            height: 192,
            overflowY: 'auto',
            borderTop: 'none',
            px: 1,
          }}
        >
          {users.map((user) => (
            <Box display="flex" alignItems="center" py={1} key={user.email}>
              <Checkbox
                size="small"
                checked={user.checked ?? false}
                onChange={(value) => onSelect(user, value.target.checked)}
              />
              <Typography variant="body1">
                {user.fullName ? user.fullName : `${user.firstName} ${user.lastName}`}
              </Typography>
            </Box>
          ))}
        </Box>
      </>
    </Paper>
  );
};
