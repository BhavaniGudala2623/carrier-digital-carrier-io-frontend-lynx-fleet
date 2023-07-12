import { NotificationPageItem } from '@carrier-io/lynx-fleet-types';

import { NotificationPageItemWithSearchFields } from '../types';

export const withSearchFields = (
  notification: NotificationPageItem
): NotificationPageItemWithSearchFields => {
  const updatedAtTime = notification.updatedAt ? new Date(notification.updatedAt).getTime() : 0;

  return {
    ...notification,
    updatedAtTime,
  };
};
