import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';

import {
  getAccessLimitTree,
  isNodeInitialySelected,
  updateAccessLimitTreeNode,
  resetAccessLimitTree,
} from './useLimitAccess';

describe('useLimitAccess', () => {
  describe('isNodeInitialySelected', () => {
    it('Returns correct result for a country node', () => {
      const node: TreeItemModel = {
        nodeId: `COUNTRY|FR`,
        label: 'France',
        level: 2,
        children: [],
      };
      expect(isNodeInitialySelected(node, ['FR'])).toEqual(true);
      expect(isNodeInitialySelected(node, ['GB'])).toEqual(false);
    });

    it('Returns correct result for a region node', () => {
      const node = {
        nodeId: 'REGION|Europe',
        label: 'Europe',
        level: 1,
        children: [
          {
            nodeId: `COUNTRY|FR`,
            label: 'France',
            level: 2,
            children: [],
          },
        ],
      };
      expect(isNodeInitialySelected(node, [])).toEqual(false);
    });

    it('Returns correct result for a reginon node without countries', () => {
      const node = {
        nodeId: 'REGION|Europe',
        label: 'Europe',
        level: 1,
        children: [],
      };
      expect(isNodeInitialySelected(node, [])).toEqual(false);
    });

    it('Returns correct result for a reginon node with countries', () => {
      const node = {
        nodeId: 'REGION|Europe',
        label: 'Europe',
        level: 1,
        children: [
          {
            nodeId: `COUNTRY|FR`,
            label: 'France',
            level: 2,
            children: [],
          },
          {
            nodeId: `COUNTRY|GB`,
            label: 'GB',
            level: 2,
            children: [],
          },
        ],
      };
      expect(isNodeInitialySelected(node, ['FR', 'GB'])).toEqual(true);
    });
  });

  describe('getAccessLimitTree', () => {
    const root = [
      {
        nodeId: 'GLOBAL|Global',
        label: 'Global',
        level: 0,
        selected: false,
        children: [
          {
            nodeId: 'REGION|Europe',
            label: 'Europe',
            level: 1,
            children: [
              {
                nodeId: `COUNTRY|FR`,
                label: 'France',
                level: 2,
                children: [],
              },
              {
                nodeId: `COUNTRY|GB`,
                label: 'GB',
                level: 2,
                children: [],
              },
            ],
          },
        ],
      },
    ];
    it('Get correct tree', () => {
      const initCountries: string[] = [];
      const initRegions: string[] = [];

      const expectedResult = [
        {
          nodeId: 'GLOBAL|Global',
          label: 'Global',
          level: 0,
          selected: false,
          children: [
            {
              nodeId: 'REGION|Europe',
              label: 'Europe',
              level: 1,
              selected: false,
              children: [
                {
                  nodeId: `COUNTRY|FR`,
                  selected: false,
                  children: [],
                  label: 'France',
                  level: 2,
                },
                {
                  nodeId: `COUNTRY|GB`,
                  label: 'GB',
                  level: 2,
                  selected: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ];

      expect(getAccessLimitTree(root, { countries: initCountries, regions: initRegions })).toEqual(
        expectedResult
      );
    });

    it('Get correct tree with all nodes selected', () => {
      const initCountries: string[] = ['FR', 'GB'];
      const initRegions: string[] = [];

      const expectedResult = [
        {
          nodeId: 'GLOBAL|Global',
          label: 'Global',
          level: 0,
          selected: false,
          children: [
            {
              nodeId: 'REGION|Europe',
              label: 'Europe',
              level: 1,
              selected: true,
              children: [
                {
                  nodeId: `COUNTRY|FR`,
                  selected: true,
                  children: [],
                  label: 'France',
                  level: 2,
                },
                {
                  nodeId: `COUNTRY|GB`,
                  label: 'GB',
                  level: 2,
                  selected: true,
                  children: [],
                },
              ],
            },
          ],
        },
      ];

      expect(getAccessLimitTree(root, { countries: initCountries, regions: initRegions })).toEqual(
        expectedResult
      );
    });

    it('Get correct tree with some nodes selected', () => {
      const initCountries: string[] = ['FR'];
      const initRegions: string[] = [];

      const expectedResult = [
        {
          nodeId: 'GLOBAL|Global',
          label: 'Global',
          level: 0,
          selected: false,
          children: [
            {
              nodeId: 'REGION|Europe',
              label: 'Europe',
              level: 1,
              selected: false,
              children: [
                {
                  nodeId: `COUNTRY|FR`,
                  selected: true,
                  children: [],
                  label: 'France',
                  level: 2,
                },
                {
                  nodeId: `COUNTRY|GB`,
                  label: 'GB',
                  level: 2,
                  selected: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ];

      expect(getAccessLimitTree(root, { countries: initCountries, regions: initRegions })).toEqual(
        expectedResult
      );
    });
  });

  describe('updateAccessLimitTreeNode', () => {
    const tree = [
      {
        nodeId: 'GLOBAL|Global',
        label: 'Global',
        level: 0,
        selected: false,
        children: [
          {
            nodeId: 'REGION|Europe',
            label: 'Europe',
            level: 1,
            selected: false,
            children: [
              {
                nodeId: `COUNTRY|FR`,
                selected: true,
                children: [],
                label: 'France',
                level: 2,
              },
              {
                nodeId: `COUNTRY|GB`,
                label: 'GB',
                level: 2,
                selected: false,
                children: [],
              },
            ],
          },
        ],
      },
    ];
    it('Returns correct updated tree #1', () => {
      const expectedResult = [
        {
          nodeId: 'GLOBAL|Global',
          label: 'Global',
          level: 0,
          selected: false,
          children: [
            {
              nodeId: 'REGION|Europe',
              label: 'Europe',
              level: 1,
              selected: false,
              children: [
                {
                  nodeId: `COUNTRY|FR`,
                  selected: true,
                  children: [],
                  label: 'France',
                  level: 2,
                },
                {
                  nodeId: `COUNTRY|GB`,
                  label: 'GB',
                  level: 2,
                  selected: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      expect(updateAccessLimitTreeNode(tree[0], 'FR', true)).toEqual(expectedResult[0]);
    });

    it('Returns correct updated tree #2', () => {
      const expectedResult = [
        {
          nodeId: 'GLOBAL|Global',
          label: 'Global',
          level: 0,
          selected: false,
          children: [
            {
              nodeId: 'REGION|Europe',
              label: 'Europe',
              level: 1,
              selected: true,
              children: [
                {
                  nodeId: `COUNTRY|FR`,
                  selected: true,
                  children: [],
                  label: 'France',
                  level: 2,
                },
                {
                  nodeId: `COUNTRY|GB`,
                  label: 'GB',
                  level: 2,
                  selected: true,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      expect(updateAccessLimitTreeNode(tree[0], 'Europe', true)).toEqual(expectedResult[0]);
    });

    it('Returns correct updated tree #3', () => {
      const initTree = [
        {
          nodeId: 'GLOBAL|Global',
          label: 'Global',
          level: 0,
          selected: false,
          children: [
            {
              nodeId: 'REGION|Europe',
              label: 'Europe',
              level: 1,
              selected: true,
              children: [
                {
                  nodeId: `COUNTRY|FR`,
                  selected: true,
                  children: [],
                  label: 'France',
                  level: 2,
                },
                {
                  nodeId: `COUNTRY|GB`,
                  label: 'GB',
                  level: 2,
                  selected: true,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      const expectedResult = [
        {
          nodeId: 'GLOBAL|Global',
          label: 'Global',
          level: 0,
          selected: false,
          children: [
            {
              nodeId: 'REGION|Europe',
              label: 'Europe',
              level: 1,
              selected: false,
              children: [
                {
                  nodeId: `COUNTRY|FR`,
                  selected: false,
                  children: [],
                  label: 'France',
                  level: 2,
                },
                {
                  nodeId: `COUNTRY|GB`,
                  label: 'GB',
                  level: 2,
                  selected: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      expect(updateAccessLimitTreeNode(initTree[0], 'Europe', false)).toEqual(expectedResult[0]);
    });
  });

  describe('resetAccessLimitTree', () => {
    const tree = [
      {
        nodeId: 'GLOBAL|Global',
        label: 'Global',
        level: 0,
        selected: false,
        children: [
          {
            nodeId: 'REGION|Europe',
            label: 'Europe',
            level: 1,
            selected: true,
            children: [
              {
                nodeId: `COUNTRY|FR`,
                selected: true,
                children: [],
                label: 'France',
                level: 2,
              },
              {
                nodeId: `COUNTRY|GB`,
                label: 'GB',
                level: 2,
                selected: true,
                children: [],
              },
            ],
          },
        ],
      },
    ];
    it('Returns access limit tree with unselected nodes', () => {
      const expectedResult = [
        {
          nodeId: 'GLOBAL|Global',
          label: 'Global',
          level: 0,
          selected: false,
          children: [
            {
              nodeId: 'REGION|Europe',
              label: 'Europe',
              level: 1,
              selected: false,
              children: [
                {
                  nodeId: `COUNTRY|FR`,
                  selected: false,
                  children: [],
                  label: 'France',
                  level: 2,
                },
                {
                  nodeId: `COUNTRY|GB`,
                  label: 'GB',
                  level: 2,
                  selected: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      expect(resetAccessLimitTree(tree)).toEqual(expectedResult);
    });
  });
});
