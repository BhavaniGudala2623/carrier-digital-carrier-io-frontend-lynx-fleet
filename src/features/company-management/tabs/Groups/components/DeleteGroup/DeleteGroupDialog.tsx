import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import { HandleDeleteUserGroup, LightGroup } from '../../../common/types';
import { RadioButtonValueType } from '../../types';

import { DeleteGroupDialogContent } from './DeleteGroupDialogContent';

import { Dialog } from '@/components/Dialog';

interface DeleteGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: (data: HandleDeleteUserGroup) => void;
  group: LightGroup;
  isLoading: boolean;
}

export const DeleteGroupDialog = ({ open, onClose, onDelete, group, isLoading }: DeleteGroupDialogProps) => {
  const { t } = useTranslation();
  const [groupToReceiveId, setGroupToReceiveId] = useState<string>('');
  const [radioButtonValue, setRadioButtonValue] = useState<RadioButtonValueType>('DELETE');

  const usersToMove = useMemo(
    () => group.users.filter(({ groups }) => groups?.length === 1 && groups[0].group.id === group.id),
    [group]
  );

  const handleDelete = () => {
    const usersToDelete = radioButtonValue === 'DELETE' ? usersToMove : [];

    onDelete({
      groupToDeleteId: group.id,
      groupToReceiveId,
      usersToDelete,
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      dialogTitle={t('user.management.user-group.delete')}
      content={
        <DeleteGroupDialogContent
          usersToMove={usersToMove}
          setGroupToReceiveId={setGroupToReceiveId}
          setRadioButtonValue={setRadioButtonValue}
          radioButtonValue={radioButtonValue}
          groupToReceiveId={groupToReceiveId}
          group={group}
        />
      }
      actionsSx={{ pb: 1, pr: 1 }}
      actions={
        <>
          <Button color="secondary" variant="outlined" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            disabled={(radioButtonValue === 'MOVE' && groupToReceiveId === '') || isLoading}
            color="primary"
            variant="outlined"
            onClick={handleDelete}
          >
            {t('common.delete')}
          </Button>
        </>
      }
    />
  );
};
