import { useEffect } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import RadioGroup from '@carrier-io/fds-react/RadioGroup';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Radio from '@carrier-io/fds-react/Radio';
import FormControl from '@carrier-io/fds-react/FormControl';
import InputLabel from '@carrier-io/fds-react/InputLabel';
import Select from '@carrier-io/fds-react/Select';
import Input from '@carrier-io/fds-react/Input';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import { GroupRole, User } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { LightGroup } from '../../../common/types';
import { RadioButtonValueType } from '../../types';

import { useAppSelector } from '@/stores';
import { getAuthUserGroups } from '@/features/authentication';
import { actionPayload } from '@/features/authorization';

interface DeleteGroupDialogContentProps {
  group: LightGroup;
  usersToMove: User[];
  setRadioButtonValue: (value: RadioButtonValueType) => void;
  radioButtonValue: RadioButtonValueType;
  groupToReceiveId: string;
  setGroupToReceiveId: (value: string) => void;
}

export const DeleteGroupDialogContent = ({
  group,
  usersToMove,
  setRadioButtonValue,
  radioButtonValue,
  groupToReceiveId,
  setGroupToReceiveId,
}: DeleteGroupDialogContentProps) => {
  const { t } = useTranslation();
  const { hasPermission } = useRbac();

  useEffect(() => {
    if (radioButtonValue === 'DELETE') {
      setGroupToReceiveId('');
    }
  }, [radioButtonValue, setGroupToReceiveId]);

  const accessibleGroups = useAppSelector(getAuthUserGroups).filter(
    ({ user, group: { id } }) =>
      id !== group.id &&
      ['Manager', 'Owner'].includes(user.role as GroupRole) &&
      hasPermission(
        actionPayload({
          action: 'group.edit',
          subjectId: group.id,
          subjectType: 'GROUP',
        })
      )
  );

  const handleRadioChange = (_, value: string) => {
    setRadioButtonValue(value as RadioButtonValueType);
  };

  const handleSelectChange = (e) => {
    setGroupToReceiveId(e.target.value);
  };

  const usersToMoveText =
    usersToMove.length > 1
      ? 'user.management.user-group.delete-message-there-are-users-plural'
      : 'user.management.user-group.delete-message-there-are-users';

  return (
    <Box minWidth={480}>
      {usersToMove.length > 0 ? (
        <>
          <Typography variant="body1" mb={3}>
            {t(usersToMoveText, {
              count: usersToMove.length,
              ifYouDelete: t('user.management.user-group.delete-message-if-you-delete'),
            })}
          </Typography>
          <Box ml={2}>
            <RadioGroup value={radioButtonValue} onChange={handleRadioChange}>
              <FormControlLabel
                control={<Radio size="medium" />}
                label={t('user.management.user-group.delete.radio-button-delete')}
                labelPlacement="end"
                size="medium"
                value="DELETE"
              />
              <FormControlLabel
                control={<Radio size="medium" />}
                label={t('user.management.user-group.delete.radio-button-move-users')}
                labelPlacement="end"
                size="medium"
                value="MOVE"
              />
            </RadioGroup>
            <FormControl
              color="primary"
              sx={{
                ml: 4,
                mt: 1,
                minWidth: 250,
              }}
              variant="filled"
            >
              <InputLabel id="selectGroupInputLabel">
                {t('user.management.user-group.select-group')}
              </InputLabel>
              <Select
                showBorder
                disabled={radioButtonValue === 'DELETE'}
                labelId="selectGroupInputLabel"
                size="small"
                onChange={handleSelectChange}
                value={groupToReceiveId}
                input={<Input showBorder />}
              >
                {accessibleGroups.map(({ group: g }) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </>
      ) : (
        <Typography variant="body1">{t('user.management.user-group.delete-message')}</Typography>
      )}
    </Box>
  );
};
