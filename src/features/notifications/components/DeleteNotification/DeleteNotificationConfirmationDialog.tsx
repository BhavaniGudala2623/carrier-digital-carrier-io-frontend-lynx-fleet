import { useCallback, useState } from 'react';

import { deleteNotificationAction } from '../../stores';

import { DeleteNotificationConfirmationDialogView } from './View';

import { useAppDispatch } from '@/stores';

interface DeleteNotificationConfirmationDialogProps {
  notificationId?: string;
  onClose: () => void;
}

export function DeleteNotificationConfirmationDialog({
  notificationId,
  onClose,
}: DeleteNotificationConfirmationDialogProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOk = useCallback(() => {
    setLoading(true);
    dispatch(deleteNotificationAction(notificationId || ''))
      .then(() => {
        setLoading(false);
        onClose();
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch, notificationId, onClose]);

  return (
    <DeleteNotificationConfirmationDialogView
      loading={loading}
      open
      handleCancel={handleCancel}
      handleOk={handleOk}
    />
  );
}
