import { Maybe, NavigationTreeItemType } from '@carrier-io/lynx-fleet-types';

import { ALL_COMPANIES } from '@/constants';
import type { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

export const getCompanyHierarchyByNodeId = (
  nodeId: Maybe<string>,
  name: string
): SelectedCompanyHierarchy => {
  const items = nodeId?.split('|') ?? [];

  if (items.length < 2 || !items[0] || !items[1]) {
    return { type: 'ALL', id: ALL_COMPANIES, name };
  }

  return { type: items[0] as NavigationTreeItemType, id: items[1], name };
};
