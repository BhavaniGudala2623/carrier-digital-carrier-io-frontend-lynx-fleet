import { useCallback, useState } from 'react';
import { NotificationRuleConditionType } from '@carrier-io/lynx-fleet-types';

import { Maybe } from '@/types';

export function useEventModal() {
  const [currentModal, setCurrentModal] = useState<Maybe<NotificationRuleConditionType>>(null);

  const handleCloseModal = useCallback(() => {
    setCurrentModal(null);
  }, []);

  const handleOpenModal = useCallback((newModal: NotificationRuleConditionType) => {
    setCurrentModal(newModal);
  }, []);

  return {
    currentModal,
    handleOpenModal,
    handleCloseModal,
  };
}
