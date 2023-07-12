import { CommandHistoryPageProvider } from '../providers';

import { CommandHistory } from './CommandHitory';

import { ContentRoute } from '@/components/layouts';

export function CommandHistoryPage() {
  return (
    <ContentRoute>
      <CommandHistoryPageProvider>
        <CommandHistory />
      </CommandHistoryPageProvider>
    </ContentRoute>
  );
}
