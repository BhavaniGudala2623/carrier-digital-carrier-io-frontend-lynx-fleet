import { CommandHistoryPageItem, CommandHistoryPageItemWithSearchFields } from '../types';

export const convertCommandData = (
  data: CommandHistoryPageItemWithSearchFields[]
): CommandHistoryPageItem[] => {
  const elementsToExclude = ['IMEI', 'Channel Id', 'Flespi Id'];

  return data.map((command: CommandHistoryPageItemWithSearchFields) => {
    const args = command.arguments
      ? command.arguments.filter((a) => a?.element && !elementsToExclude.includes(a.element))
      : [];
    const value = args?.[0]
      ? {
          ...args[0],
          commandName: command.commandType,
          status: command.status,
        }
      : null;

    return {
      ...command,
      commandName: command.commandType,
      value,
      sentBy: command.createdBy,
      flespiId: command.device?.flespiId,
    };
  });
};
