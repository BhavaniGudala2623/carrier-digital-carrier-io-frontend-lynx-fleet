import { useCallback, useState, MouseEvent } from 'react';
import Button, { ButtonProps } from '@carrier-io/fds-react/Button';
import Menu from '@carrier-io/fds-react/Menu';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import ListItemIcon from '@carrier-io/fds-react/ListItemIcon';
import { useTranslation } from 'react-i18next';
import { Add } from '@mui/icons-material';
import { NotificationRuleCondition, NotificationRuleConditionType } from '@carrier-io/lynx-fleet-types';

import { NOTIFICATION_EVENT_MENU_ITEMS } from '../../../constants';

import { AddEventModal, useAddEventModal } from './AddEventModal';

interface AddEventButtonProps extends ButtonProps {
  onAdd: (rule: NotificationRuleCondition) => void;
  events: NotificationRuleConditionType[];
  exclude?: boolean;
}

export const AddEventButton = ({ className, onAdd, events, exclude }: AddEventButtonProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentModal, handleCloseModal, handleOpenModal } = useAddEventModal();

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleEventItemClick = useCallback(
    (newModal: NotificationRuleConditionType) => {
      handleClose();
      handleOpenModal(newModal);
    },
    [handleClose, handleOpenModal]
  );

  const handleEventCreate = useCallback(
    (currentEvent: NotificationRuleCondition) => {
      onAdd(currentEvent);
      handleCloseModal();
    },
    [handleCloseModal, onAdd]
  );

  return (
    <>
      <Button
        className={className}
        sx={{ py: 0.5 }}
        color="secondary"
        variant="outlined"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
        startIcon={<Add />}
      >
        <span>{exclude ? t('notifications.add-exception') : t('notifications.add-event')}</span>
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {events.map((event) => {
          const { icon: Icon, title } = NOTIFICATION_EVENT_MENU_ITEMS[event];

          return (
            <MenuItem onClick={() => handleEventItemClick(event)} key={event}>
              <ListItemIcon>
                <Icon style={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary={t(title)} />
            </MenuItem>
          );
        })}
      </Menu>
      <AddEventModal
        modal={currentModal}
        handleCancel={handleCloseModal}
        handleOk={handleEventCreate}
        exclude={exclude}
      />
    </>
  );
};
