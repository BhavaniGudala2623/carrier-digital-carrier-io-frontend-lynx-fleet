import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';
import { useState, useCallback, useEffect } from 'react';

import { CommandHistoryPageItemWithSearchFields } from '../types';
import { withSearchFields, convertCommandData } from '../utils';

import { showError } from '@/stores/actions';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useAppDispatch } from '@/stores';

export const useFetchCommandHistory = (
  startDate: Maybe<string | undefined>,
  endDate: Maybe<string | undefined>,
  t: TFunction
) => {
  const dispatch = useAppDispatch();
  const [commands, setCommands] = useState<CommandHistoryPageItemWithSearchFields[]>([]);
  const [commandsLoading, setCommandsLoading] = useState(false);

  const fetchAllCommands = useCallback(async () => {
    if (!startDate || !endDate) {
      showError(dispatch, t('command-history.error-validation'));

      return;
    }

    setCommandsLoading(true);

    const history: CommandHistoryPageItemWithSearchFields[] = [];
    let nextToken;

    do {
      try {
        const { data } = await AssetService.pageCommandHistory(
          {
            input: { startDate, endDate, nextToken, limit: 750 },
          },
          'network-only'
        );

        const items = data?.pageCommandHistory.items
          .map((command, index) => ({
            ...command,
            commandIndex: index,
          }))
          .map(withSearchFields);

        if (data?.pageCommandHistory?.error) {
          const message = getErrorMessage(data.pageCommandHistory.error);
          showError(dispatch, message);
          setCommandsLoading(false);
          break;
        }

        nextToken = data?.pageCommandHistory.nextToken;

        if (items && items.length) {
          history.push(...items);
        }
      } catch (e) {
        showError(dispatch, e);
      }
    } while (nextToken);

    setCommands(convertCommandData(history));
    setCommandsLoading(false);
  }, [dispatch, endDate, startDate, t]);

  const restoreCommandsHistoryState = useCallback(() => {
    setCommands([]);
    setCommandsLoading(false);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      restoreCommandsHistoryState();
      fetchAllCommands();
    }
  }, [endDate, fetchAllCommands, restoreCommandsHistoryState, startDate]);

  return {
    commands,
    commandsLoading,
  };
};
