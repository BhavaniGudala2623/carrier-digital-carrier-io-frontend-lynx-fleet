import { CommandStatusType, Maybe } from '@carrier-io/lynx-fleet-types';

export const responseFormatter = (cellContent: Maybe<string>, status: Maybe<CommandStatusType>): string => {
  if (cellContent && status === 'FAILED') {
    return cellContent;
  }

  return '';
};
