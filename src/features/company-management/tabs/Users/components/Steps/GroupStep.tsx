import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Delete as DeleteIcon, Add as AddIcon, InfoOutlined } from '@mui/icons-material';
import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import TextField from '@carrier-io/fds-react/TextField';
import Button from '@carrier-io/fds-react/Button';
import IconButton from '@carrier-io/fds-react/IconButton';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { useRbac } from '@carrier-io/rbac-provider-react';
import Popper from '@carrier-io/fds-react/Popper';
import Fade from '@carrier-io/fds-react/Fade';
import Paper from '@carrier-io/fds-react/Paper';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { Group, AddUserInput, UserGroup } from '../../types';
import { usePopper } from '../../../common/hooks';

import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { PageLoader as Loader } from '@/components';
import { actionPayload } from '@/features/authorization';
import { sortStrings } from '@/utils';

export const GroupStep = () => {
  const { t } = useTranslation();

  const { hasPermission } = useRbac();

  const { anchorEl, open: openInfo, handleShowPopper, handleClosePopper } = usePopper();

  const { values, handleChange, setFieldValue } = useFormikContext<AddUserInput>();
  const { accessibleGroupsIds, sortedGroups } = values;
  const userTenantId = useAppSelector(getAuthTenantId);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);

  const { data, loading, error } = CompanyService.useGetGroupsByTenant(
    {
      tenantId: values.tenantId,
    },
    { skip: !values.tenantId, fetchPolicy: 'network-only' }
  );

  useEffect(() => {
    if (loading || !data?.getGroupsByTenant?.length) {
      return;
    }

    setFieldValue('availableTenantGroups', data?.getGroupsByTenant);

    let availableGroupsTmp: Group[] | undefined = [];
    if (data?.getGroupsByTenant?.length === 1) {
      availableGroupsTmp = data?.getGroupsByTenant;
    } else if (values.tenantId !== userTenantId) {
      availableGroupsTmp = data?.getGroupsByTenant?.filter((g: Group) =>
        hasPermission(
          actionPayload({
            action: 'group.edit',
            subjectId: g.id,
            subjectType: 'GROUP',
          })
        )
      ) as Group[];
    } else if (values.tenantId === userTenantId) {
      availableGroupsTmp = data?.getGroupsByTenant?.filter((g: Group) =>
        accessibleGroupsIds.includes(g.id)
      ) as Group[];
    }

    setAvailableGroups(availableGroupsTmp.slice().sort((a, b) => sortStrings(a.name, b.name)));

    const nonEditableGroups = (sortedGroups || []).filter(
      (g) => g.role === 'Owner' || !availableGroupsTmp?.find((item) => item.id === g.id)
    );

    setFieldValue('nonEditableGroups', nonEditableGroups);

    const editableGroups: UserGroup[] = [];

    if (data?.getGroupsByTenant?.length === 1) {
      const groupId = data.getGroupsByTenant[0].id;

      if (!nonEditableGroups.find((item) => item.id === groupId)) {
        editableGroups.push({ id: groupId, role: 'Member', name: data.getGroupsByTenant[0].name });
      }
    } else if (sortedGroups?.length) {
      editableGroups.push(...sortedGroups.filter((g) => !nonEditableGroups.find((item) => item.id === g.id)));
    }

    setFieldValue('editableGroups', editableGroups);
  }, [
    data,
    loading,
    error,
    hasPermission,
    accessibleGroupsIds,
    setFieldValue,
    sortedGroups,
    userTenantId,
    values.tenantId,
  ]);

  if (error) {
    return <h1>{error.message}</h1>;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" fontSize={100}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box mb={2} ml={2}>
      <Box mb={2} display="flex" justifyContent="flex-start" alignItems="center">
        <Typography variant="subtitle1" color="text.primary" mr={1}>
          {t('user.management.manage-group-membership')}
        </Typography>
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleShowPopper}>
          <InfoOutlined fontSize="small" />
        </IconButton>
        <Popper
          style={{ zIndex: 9999 }}
          open={openInfo}
          anchorEl={anchorEl}
          placement="right"
          transition
          direction="ltr"
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <ClickAwayListener onClickAway={handleClosePopper}>
                  <Box sx={{ p: 2, weight: '100px', width: '200px' }}>
                    <Typography variant="body1" color="text.primary">
                      {t('user.management.add.group.select-group-role-info')}
                    </Typography>
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
      <Box mt={2}>
        {values.nonEditableGroups.map((g, ind) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid mb={2} container spacing={2} key={`nonEditableGroup_${ind}`}>
            <Grid xs={4} item>
              <TextField
                select
                value={g.id}
                label={t('user.management.add.group.select-group')}
                aria-label={t('user.management.add.group.select-group')}
                fullWidth
                size="small"
                disabled
              >
                <MenuItem value={g.id} key={g.id}>
                  {g.name}
                </MenuItem>
              </TextField>
            </Grid>
            <Grid xs={4} item>
              <TextField
                select
                value={g.role}
                label={t('user.management.add.group.select-group-role')}
                aria-label={t('user.management.add.group.select-group-role')}
                fullWidth
                size="small"
                disabled
              >
                {(g.role === 'Owner' ? ['Owner'] : ['Member', 'Manager']).map((roleName) => (
                  <MenuItem value={roleName} key={roleName}>
                    {roleName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        ))}
        {values.editableGroups.map((g, ind) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid mb={2} container spacing={2} key={`editableGroup_${ind}`}>
            <Grid xs={4} item>
              <TextField
                id={`editableGroups[${ind}].id`}
                name={`editableGroups[${ind}].id`}
                select
                value={g.id}
                label={t('user.management.add.group.select-group')}
                aria-label={t('user.management.add.group.select-group')}
                onChange={handleChange}
                fullWidth
                size="small"
              >
                {availableGroups?.map((group) => (
                  <MenuItem value={group.id} key={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={4} item>
              <TextField
                id={`editableGroups[${ind}].role`}
                name={`editableGroups[${ind}].role`}
                select
                label={t('user.management.add.group.select-group-role')}
                aria-label={t('user.management.add.group.select-group-role')}
                value={g.role}
                onChange={handleChange}
                fullWidth
                size="small"
              >
                {(g.role === 'Owner' ? ['Owner'] : ['Member', 'Manager']).map((roleName) => (
                  <MenuItem value={roleName} key={roleName}>
                    {roleName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid sx={{ display: 'flex', alignItems: 'center' }} xs={2} item>
              <IconButton
                aria-label="delete"
                onClick={() =>
                  setFieldValue(
                    'editableGroups',
                    values.editableGroups.filter((_g, i) => i !== ind)
                  )
                }
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Box>
      <Box mt={2}>
        <Button
          startIcon={<AddIcon />}
          variant="text"
          onClick={() =>
            setFieldValue('editableGroups', [...values.editableGroups, { id: '', role: 'Member' }])
          }
          disabled={values.editableGroups.length >= (availableGroups?.length || 0)}
        >
          {t('user.management.add-to-another-group')}
        </Button>
      </Box>
    </Box>
  );
};

GroupStep.displayName = 'GroupStep';
