import { useCallback, useState } from 'react';
import { NotificationRuleCondition } from '@carrier-io/lynx-fleet-types';
import IconButton from '@carrier-io/fds-react/IconButton';
import Box from '@carrier-io/fds-react/Box';
import { Close, Edit } from '@mui/icons-material';

import { AddEventModal, useAddEventModal } from './AddEventModal';
import { EventViewMapper } from './EventMapper';

interface EventManagerProps {
  event: NotificationRuleCondition;
  onRemove: () => void;
  onEdit: (newEvent: NotificationRuleCondition) => void;
  exclude?: boolean;
}

export const NotificationEventManager = ({ event, onEdit, onRemove, exclude }: EventManagerProps) => {
  const { currentModal, handleOpenModal, handleCloseModal } = useAddEventModal();
  const [actionsVisibility, setActionsVisibility] = useState<'hidden' | 'visible'>('hidden');

  const handleSave = useCallback(
    (newEvent: NotificationRuleCondition) => {
      onEdit(newEvent);
      handleCloseModal();
    },
    [handleCloseModal, onEdit]
  );

  const handleMouseEnterEventView = () => {
    setActionsVisibility('visible');
  };

  const handleMouseLeaveEventView = () => {
    setActionsVisibility('hidden');
  };

  return (
    <>
      <Box
        onMouseEnter={handleMouseEnterEventView}
        onMouseLeave={handleMouseLeaveEventView}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          py: 1,
          px: 1.5,
          background: actionsVisibility === 'visible' ? 'secondary.outlinedHoverBackground' : 'none',
        }}
      >
        <EventViewMapper event={event} />
        <Box sx={{ visibility: actionsVisibility, display: 'flex' }}>
          <IconButton sx={{ mr: 1 }} size="small" onClick={onRemove}>
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              handleOpenModal(event.type);
            }}
          >
            <Edit sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
      <AddEventModal
        initialValue={event}
        modal={currentModal}
        handleCancel={handleCloseModal}
        handleOk={handleSave}
        exclude={exclude}
      />
    </>
  );
};
