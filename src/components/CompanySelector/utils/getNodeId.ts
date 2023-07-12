import { NavigationTreeItemType } from '@carrier-io/lynx-fleet-types';

export const getNodeId = (type: NavigationTreeItemType, id: string) => `${type}|${id}`;
