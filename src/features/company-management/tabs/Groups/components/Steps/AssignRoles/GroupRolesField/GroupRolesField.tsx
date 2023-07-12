import { useEffect } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import Paper from '@carrier-io/fds-react/Paper';
import { ChevronRight, ChevronLeft } from '@mui/icons-material';
import Fab from '@carrier-io/fds-react/Fab';
import { useFormikContext } from 'formik';

import { CreateGroupFormValuesType } from '../../../../types';

import { UserList } from './UserList';
import { useGroupRoles } from './useGroupRoles';

import { sortArrayOfObjectsByStringField } from '@/utils';

interface GroupRolesFieldProps {
  activeStep: number;
}

export const GroupRolesField = ({ activeStep }: GroupRolesFieldProps) => {
  const { setFieldValue, values } = useFormikContext<CreateGroupFormValuesType>();

  const {
    members,
    managers,
    selectManagers,
    selectMemebers,
    toggleAllMembers,
    toggleAllManagers,
    moveMembers,
    moveManagers,
    selectedMembersCount,
    selectedManagersCount,
  } = useGroupRoles();

  const groupOwnerId = values.ownerEmail;

  useEffect(() => {
    if (activeStep === 1 || activeStep === 3) {
      const users = [
        {
          role: 'Member',
          userIds: members.map((member) => member.email),
        },
        {
          role: 'Manager',
          userIds: managers.map((manager) => manager.email),
        },
        {
          role: 'Owner',
          userIds: groupOwnerId ? [groupOwnerId] : [],
        },
      ];

      const usersListByRoleUpdated = {
        Member: members,
        Manager: managers,
      };

      setFieldValue('users', users);
      setFieldValue('usersListByRole', usersListByRoleUpdated);
    }
  }, [activeStep, groupOwnerId, managers, members, setFieldValue]);

  const sortUsers = (a, b) => sortArrayOfObjectsByStringField(a, b, 'firstName');

  return (
    <Grid container direction="row">
      <Grid item xs={5}>
        <UserList
          groupRole="Manager"
          users={[...managers].sort(sortUsers)}
          onSelect={selectManagers}
          onSelectAll={toggleAllManagers}
        />
      </Grid>
      <Grid item xs={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Paper
            sx={{
              '& > button.MuiButtonBase-root': { backgroundColor: 'white', borderRadius: '10px' },
              mb: 1,
            }}
          >
            <Fab size="small" onClick={moveMembers} disabled={selectedMembersCount === 0}>
              <ChevronLeft />
            </Fab>
          </Paper>
          <Paper sx={{ '& > button.MuiButtonBase-root': { backgroundColor: 'white', borderRadius: '10px' } }}>
            <Fab size="small" onClick={moveManagers} disabled={selectedManagersCount === 0}>
              <ChevronRight />
            </Fab>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={5}>
        <UserList
          groupRole="Member"
          users={[...members].sort(sortUsers)}
          onSelect={selectMemebers}
          onSelectAll={toggleAllMembers}
        />
      </Grid>
    </Grid>
  );
};

GroupRolesField.displayName = 'GroupRolesField';
