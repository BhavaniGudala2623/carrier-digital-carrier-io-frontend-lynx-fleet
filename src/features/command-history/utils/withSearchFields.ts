import { CommandHistory } from '@carrier-io/lynx-fleet-types';

import { CommandHistoryPageItemWithSearchFields } from '../types';

export const withSearchFields = (commandHistory: CommandHistory): CommandHistoryPageItemWithSearchFields => {
  const createdOnTime = commandHistory.createdOn ? new Date(commandHistory.createdOn).getTime() : 0;

  return {
    ...commandHistory,
    createdOnTime,
  };
};
