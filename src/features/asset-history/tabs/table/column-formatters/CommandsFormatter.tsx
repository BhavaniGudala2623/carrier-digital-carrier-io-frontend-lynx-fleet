import { SyntheticEvent, useState } from 'react';
import Button from '@carrier-io/fds-react/Button';
import { Command, Maybe } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { ParamsProps } from '../types';
import { CommandPopover } from '../components/CommandPopover';

export const CommandsFormatter = (params: ParamsProps) => {
  const { data } = params;
  const { t } = useTranslation();
  const [selectedCommands, setSelectedCommands] = useState<Maybe<Command[]>>(null);
  const [commandPopoverAnchorEl, setCommandPopoverAnchorEl] = useState<Maybe<Element>>(null);
  const number = data?.['formattedFields.commands']?.length || 0;

  const closeCommandPopover = () => {
    setCommandPopoverAnchorEl(null);
    setSelectedCommands(null);
  };

  const openCommandPopover = (e: SyntheticEvent) => {
    setSelectedCommands(data?.['formattedFields.commands']);
    setCommandPopoverAnchorEl(e.currentTarget);
  };

  const getCommandsText = () => {
    if (data) {
      return number === 1 ? `${number} ${t('commands.command')}` : `${number} ${t('commands.commands')}`;
    }

    return '';
  };

  return number ? (
    <CommandPopover
      commands={selectedCommands}
      onClose={closeCommandPopover}
      anchorEl={commandPopoverAnchorEl}
    >
      <Button
        sx={{
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        variant="text"
        onClick={openCommandPopover}
      >
        <b>{getCommandsText()}</b>
      </Button>
    </CommandPopover>
  ) : (
    <span>{getCommandsText()}</span>
  );
};
