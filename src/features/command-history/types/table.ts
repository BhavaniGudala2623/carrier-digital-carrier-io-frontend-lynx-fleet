import { Device, CommandHistory, ArgumentOutput, Maybe } from '@carrier-io/lynx-fleet-types';

export type CommandValue = ArgumentOutput & {
  commandName?: CommandHistory['commandType'];
  status?: CommandHistory['status'];
};

export interface CommandHistoryPageItem extends CommandHistoryPageItemWithSearchFields {
  commandName?: CommandHistory['commandType'];
  sentBy?: CommandHistory['createdBy'];
  flespiId?: Device['flespiId'];
  value?: Maybe<CommandValue>;
}
export interface CommandHistoryPageItemWithSearchFields extends CommandHistory {
  createdOnTime: number;
}
