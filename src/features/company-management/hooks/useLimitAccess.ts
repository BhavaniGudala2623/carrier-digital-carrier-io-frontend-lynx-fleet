import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { countriesByRegion, regions as allRegions } from '@carrier-io/lynx-fleet-common';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { getNodeId } from '@/components';
import { getCountryName } from '@/utils';

export type AccessLimitTreeNodeType = Pick<TreeItemModel, 'label' | 'nodeId' | 'level'> & {
  selected: boolean;
  children?: AccessLimitTreeNodeType[];
};

interface LimitAccessReturnType {
  accessLimitTree: AccessLimitTreeNodeType[];
  handleToggleNode: (node: AccessLimitTreeNodeType, selected: boolean) => void;
  isSelected: (node: AccessLimitTreeNodeType) => boolean;
  isPartialySelected: (node: AccessLimitTreeNodeType) => boolean;
  deleteNode: ({ name, node }: { name: string; node: string }) => void;
  deleteAllNodes: () => void;
  countries: string[];
  regions: string[];
}

interface LimitAccessSettings {
  countries: string[];
  regions: string[];
  onCountriesListChange: (countries: string[], regions: string[]) => void;
  allowedRegions: Maybe<string[]>;
  allowedCountries: Maybe<string[]>;
}

const parseNodeId = (nodeId: string) => ({
  id: nodeId.split('|')[1] ?? '',
  type: nodeId.split('|')[0] ?? '',
});

export function isNodeInitialySelected(
  node: TreeItemModel,
  countries: string[],
  regions?: string[]
): boolean {
  const { type, id } = parseNodeId(node.nodeId);
  if (type === 'REGION') {
    return (
      Boolean(
        node.children?.length &&
          node.children?.every((child) => countries.includes(child.nodeId.split('|')[1]))
      ) || Boolean(regions?.includes(id))
    );
  }
  if (type === 'COUNTRY') {
    return countries.includes(id);
  }

  return false;
}

export function getAccessLimitTree(
  root: TreeItemModel[],
  { countries, regions }: Pick<LimitAccessSettings, 'countries' | 'regions'>
): AccessLimitTreeNodeType[] {
  return root.map((rootItem) => ({
    ...rootItem,
    selected: isNodeInitialySelected(rootItem, countries),
    children:
      rootItem?.children?.map((region) => ({
        ...region,
        selected: isNodeInitialySelected(region, countries, regions),
        children:
          region.children?.map((country) => ({
            ...country,
            selected: isNodeInitialySelected(country, countries),
            children: [],
          })) ?? [],
      })) || [],
  }));
}

export function updateAccessLimitTreeNode(
  node: AccessLimitTreeNodeType,
  id: string,
  selected: boolean
): AccessLimitTreeNodeType {
  const nodeId = parseNodeId(node.nodeId).id;

  return {
    ...node,
    selected: nodeId === id ? selected : node.selected,
    children:
      nodeId === id
        ? node.children?.map((child) => ({ ...child, selected }))
        : node.children?.map((child) => updateAccessLimitTreeNode(child, id, selected)),
  };
}

export function resetAccessLimitTree(tree: AccessLimitTreeNodeType[]): AccessLimitTreeNodeType[] {
  return tree.map((item) => ({
    ...item,
    selected: false,
    children: resetAccessLimitTree(item?.children ?? []),
  }));
}

export function useLimitAccess({
  countries,
  regions,
  onCountriesListChange,
  allowedRegions,
  allowedCountries,
}: LimitAccessSettings): LimitAccessReturnType {
  const { t } = useTranslation();

  const treeData = allRegions
    .filter((r) => (allowedRegions ? allowedRegions.includes(r) : r))
    .map((r) => {
      const regionCountries = (Array.from(countriesByRegion[r]) as string[]).filter((c) =>
        allowedCountries ? allowedCountries.includes(c) : c
      );

      return {
        nodeId: getNodeId('REGION', r),
        label: t(`company.management.region.${r}`),
        level: 1,
        children: regionCountries.map((countryCode) => ({
          nodeId: getNodeId('COUNTRY', countryCode),
          label: t(getCountryName(countryCode)),
          children: [],
          level: 2,
        })),
      };
    });

  const initRoot: TreeItemModel[] = [
    {
      nodeId: 'GLOBAL|Global',
      label: 'Global',
      level: 0,
      children: treeData,
    },
  ];

  const accessLimitTreeInit = getAccessLimitTree(initRoot, { countries, regions });
  const [accessLimitTree, setAccessLimitTree] = useState<AccessLimitTreeNodeType[]>(accessLimitTreeInit);
  const [selectedCountries, setCountries] = useState<Set<string>>(new Set(countries));
  const [selectedRegions, setRegions] = useState<Set<string>>(new Set(regions));

  useEffect(() => {
    if (countries.length === selectedCountries.size && regions.length === selectedRegions.size) {
      return;
    }

    onCountriesListChange(Array.from(selectedCountries), Array.from(selectedRegions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountries, selectedRegions]);

  const onUpdateRegion = (
    region: Pick<AccessLimitTreeNodeType, 'nodeId' | 'selected' | 'children'>,
    value: boolean
  ) => {
    if (value) {
      setCountries(
        (prev) =>
          new Set([...prev].concat(region.children?.map((child) => parseNodeId(child.nodeId).id) || []))
      );
      setRegions((prev) => new Set([...prev, parseNodeId(region.nodeId).id]));
    } else {
      setCountries(new Set());
      setRegions((prev) => new Set([...prev].filter((r) => r !== parseNodeId(region.nodeId).id)));
    }
  };

  const onUpdateCountry = (
    country: Pick<AccessLimitTreeNodeType, 'nodeId' | 'selected' | 'children'>,
    value: boolean
  ) =>
    value
      ? setCountries((prev) => new Set(prev.add(parseNodeId(country.nodeId).id)))
      : setCountries((prev) => new Set([...prev].filter((c) => c !== parseNodeId(country.nodeId).id)));

  const onNodeUpdate = useCallback(
    (node: Pick<AccessLimitTreeNodeType, 'nodeId' | 'selected' | 'children'>, selected: boolean) => {
      const type = node.nodeId.split('|')[0];
      if (type === 'REGION') {
        onUpdateRegion(node, selected);
      }

      if (type === 'COUNTRY') {
        onUpdateCountry(node, selected);
      }
    },
    []
  );

  const handleToggleNode = useCallback(
    (node: Pick<AccessLimitTreeNodeType, 'nodeId' | 'selected' | 'children'>, selected: boolean) => {
      const updatedTree = accessLimitTree.map((item) =>
        updateAccessLimitTreeNode(item, parseNodeId(node.nodeId).id, selected)
      );
      setAccessLimitTree(updatedTree);
      onNodeUpdate(node, selected);
    },
    [accessLimitTree, onNodeUpdate]
  );

  const deleteNode = useCallback(
    ({ node, name }) => {
      const nodeItem: Pick<AccessLimitTreeNodeType, 'nodeId' | 'selected' | 'children'> = {
        nodeId: `${node}|${name}`,
        selected: true,
        children: [],
      };
      handleToggleNode(nodeItem, false);
    },
    [handleToggleNode]
  );

  const deleteAllNodes = useCallback(() => {
    const resettedTree = resetAccessLimitTree(accessLimitTree);
    setAccessLimitTree(resettedTree);
    setCountries(new Set());
    setRegions(new Set());
  }, [accessLimitTree]);

  const isPartialySelected = useCallback(
    (node: Pick<AccessLimitTreeNodeType, 'nodeId' | 'selected' | 'children'>) => {
      const selectedChildren = node.children?.filter((child) => child.selected) || [];

      return selectedChildren.length > 0 && selectedChildren.length < (node.children?.length ?? 0);
    },
    []
  );

  const isSelected = useCallback(
    (node: Pick<AccessLimitTreeNodeType, 'nodeId' | 'selected' | 'children'>) => {
      const selectedChildren = node.children?.filter((child) => child.selected) || [];

      return (
        node.selected ||
        (selectedChildren.length > 0 && selectedChildren.length === (node.children?.length ?? 0))
      );
    },
    []
  );

  return {
    accessLimitTree,
    handleToggleNode,
    deleteNode,
    deleteAllNodes,
    isSelected,
    isPartialySelected,
    countries: Array.from(selectedCountries),
    regions: Array.from(selectedRegions),
  };
}
