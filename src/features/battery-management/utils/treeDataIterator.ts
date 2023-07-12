import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { NavigationTreeItemType, SOCCompanyFilterType } from '@carrier-io/lynx-fleet-types';

import { AllCompanyFilterTypes } from '../types';

import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

// Iterates through entire tree for the selected node and return it's reference
const findNodeAndGetChildrens = (
  currentTree: TreeItemModel[] | undefined,
  selectedNode: string
): TreeItemModel[] | undefined => {
  if (!currentTree) {
    return undefined;
  }
  for (const node of currentTree) {
    if (node.nodeId === selectedNode) {
      return node.children;
    }

    const res = findNodeAndGetChildrens(node.children, selectedNode);
    if (res) {
      return res;
    }
  }

  return undefined;
};

// With the reference of subtree iterate and get the company ids
const iterateAllNestedChilds = (
  childsRef: TreeItemModel[] | undefined,
  childrens: string[]
): string[] | undefined => {
  if (!childsRef) {
    return;
  }
  for (const childNode of childsRef) {
    if (childNode.nodeId.startsWith(AllCompanyFilterTypes.COMPANY)) {
      childrens.push(childNode.nodeId.split('|').pop() ?? childNode.nodeId);
    }
    iterateAllNestedChilds(childNode.children, childrens);
  }
};

const getChildTenantIds = (
  treeData: TreeItemModel[],
  selectedCompanyType: NavigationTreeItemType,
  selectedCompanyId: string,
  ids: string[]
) =>
  iterateAllNestedChilds(
    findNodeAndGetChildrens(treeData, `${selectedCompanyType}|${selectedCompanyId}`),
    ids
  );

export const getSelectedNodeAndChildIds = (
  selectedCompanyHierarchy: SelectedCompanyHierarchy,
  treeData: TreeItemModel[]
): [SOCCompanyFilterType, string[]] => {
  const filteredChildIds: string[] = [];
  let selectedNodeType: SOCCompanyFilterType;
  const { id, type } = selectedCompanyHierarchy;
  if (AllCompanyFilterTypes.ALL === type || AllCompanyFilterTypes.FLEET === type) {
    selectedNodeType = type;
  } else {
    selectedNodeType = AllCompanyFilterTypes.TENANT;
  }
  if (selectedNodeType !== AllCompanyFilterTypes.ALL) {
    filteredChildIds.push(id);
  }
  if (selectedNodeType === AllCompanyFilterTypes.TENANT) {
    getChildTenantIds(treeData, type, id, filteredChildIds);
  }

  return [selectedNodeType, filteredChildIds];
};
