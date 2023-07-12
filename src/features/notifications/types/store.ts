import { Maybe } from '@carrier-io/lynx-fleet-types';

import { NotificationPageItemWithSearchFields } from './notification';

export interface NotificationsState {
  isLoading: boolean;
  entities: Maybe<NotificationPageItemWithSearchFields[]>;
  error: Maybe<string>;
}
