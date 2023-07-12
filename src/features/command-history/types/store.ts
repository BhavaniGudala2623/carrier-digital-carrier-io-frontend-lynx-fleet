import { Maybe } from '@carrier-io/lynx-fleet-types';

import { CommandHistoryPageItemWithSearchFields } from './table';

export interface CommandHistoryState {
  isLoading: boolean;
  entities: Maybe<CommandHistoryPageItemWithSearchFields[]>;
  error: Maybe<string>;
}
