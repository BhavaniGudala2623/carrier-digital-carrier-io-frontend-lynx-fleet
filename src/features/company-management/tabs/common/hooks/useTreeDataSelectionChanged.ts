import { useCallback } from 'react';
import { difference } from 'lodash-es';
import { RowNode, SelectionChangedEvent } from '@ag-grid-community/core';
import { AssetRow, HierarchicalFleet, Maybe } from '@carrier-io/lynx-fleet-types';

import { makeNodeId } from '../utils';
import { RowSelected } from '../types';

export const useTreeDataSelectionChanged = (
  selectedIds: string[],
  rowData?: Maybe<(AssetRow | Partial<HierarchicalFleet>)[]>,
  onSelectedIdsChange?: (selectedAssets: RowSelected[]) => void
) => {
  const changeChildrenSelection = (nodes: RowNode[], value: boolean) => {
    nodes.forEach((node) => {
      node.childrenAfterGroup?.forEach((child) => {
        child.setSelected(value);
      });
    });
  };

  return useCallback(
    (event: SelectionChangedEvent) => {
      const nodes = event.api.getSelectedNodes();
      if (selectedIds.length > nodes.length) {
        const deselectedIds = difference(
          selectedIds,
          nodes.map((rowNode) => rowNode?.data.id)
        );
        const data = rowData?.find(({ id }) => id === deselectedIds[0]);
        if (data) {
          const deselectedNode = event.api.getRowNode(makeNodeId({ data }));
          if (deselectedNode) {
            changeChildrenSelection([deselectedNode], false);
          }
        }
      } else {
        changeChildrenSelection(nodes, true);
      }
      const selectedAssetsAndFleets = nodes.reduce((acc: RowSelected[], data) => {
        if (data) {
          return [
            ...acc,
            {
              id: data?.data?.id,
              tenantId: data?.data?.tenant?.id,
              // eslint-disable-next-line no-underscore-dangle
              __typename: data?.data?.__typename,
            },
          ];
        }

        return acc;
      }, []);
      onSelectedIdsChange?.(selectedAssetsAndFleets);
    },
    [selectedIds, onSelectedIdsChange, rowData]
  );
};
