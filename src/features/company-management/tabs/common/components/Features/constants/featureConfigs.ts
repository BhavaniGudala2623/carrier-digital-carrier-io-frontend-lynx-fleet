import { FeatureConfig, Feature } from '@carrier-io/lynx-fleet-types';

export const coreFeatureConfigs: FeatureConfig[] = [
  {
    name: 'geofence',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            actions: [
              'geofence.list',
              'geofence.view',
              'geofence.create',
              'geofence.edit',
              'geofence.delete',
              'geofence.groupList',
              'geofence.groupCreate',
              'geofence.groupView',
              'geofence.groupEdit',
              'geofence.groupDelete',
              'geofence.collectionList',
              'geofence.collectionView',
              'geofence.collectionCreate',
              'geofence.collectionUpdate',
              'geofence.collectionDelete',
            ],
          },
        ],
      },
      {
        name: 'view_only',
        actionsByResource: [
          {
            resource: 'company',
            actions: [
              'geofence.list',
              'geofence.view',
              'geofence.groupList',
              'geofence.groupView',
              'geofence.collectionList',
              'geofence.collectionView',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'notification',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            actions: [
              'notification.list',
              'notification.view',
              'notification.edit',
              'notification.delete',
              'notification.create',
            ],
          },
        ],
      },
      {
        name: 'view_only',
        actionsByResource: [
          {
            resource: 'company',
            actions: ['notification.list', 'notification.view'],
          },
        ],
      },
    ],
  },
  {
    name: 'scheduledReports',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            actions: [
              'scheduledReports.view',
              'scheduledReports.create',
              'scheduledReports.download',
              'scheduledReports.schedule',
              'scheduledReports.edit',
              'scheduledReports.admin',
            ],
          },
        ],
      },
      {
        name: 'create_edit',
        actionsByResource: [
          {
            resource: 'company',
            actions: [
              'scheduledReports.view',
              'scheduledReports.create',
              'scheduledReports.download',
              'scheduledReports.schedule',
              'scheduledReports.edit',
            ],
          },
        ],
      },
    ],
  },
  {
    name: '2WayCmd',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            actions: ['2WayCmd.historyList', '2WayCmd.historyReportExport', '2WayCmd.send'],
          },
        ],
      },
      {
        name: 'view_only',
        actionsByResource: [
          {
            resource: 'company',
            actions: ['2WayCmd.historyList'],
          },
        ],
      },
    ],
  },
];
export const adminFeatureConfigs: FeatureConfig[] = [
  {
    name: 'company',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            actions: [
              'company.create',
              'company.delete',
              'company.edit',
              'company.editFeatures',
              'company.list',
              'company.view',
            ],
          },
        ],
      },
      {
        name: 'view_only',
        actionsByResource: [
          {
            resource: 'company',
            actions: ['company.list', 'company.view'],
          },
        ],
      },
    ],
  },
  {
    name: 'asset',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            // 'company.*' actions are needed here to have access to advanced company management page
            actions: [
              'company.list',
              'company.view',
              'asset.list',
              'asset.nameValidate',
              'asset.view',
              'asset.edit',
              'asset.move',
              'fleet.list',
              'fleet.view',
              'fleet.delete',
              'fleet.create',
              'fleet.edit',
            ],
          },
        ],
      },
      {
        name: 'create_edit',
        actionsByResource: [
          {
            resource: 'company',
            // 'company.*' actions are needed here to have access to advanced company management page
            actions: [
              'company.list',
              'company.view',
              'asset.list',
              'asset.nameValidate',
              'asset.view',
              'asset.edit',
              'fleet.list',
              'fleet.view',
              'fleet.delete',
              'fleet.create',
              'fleet.edit',
            ],
          },
        ],
      },
      {
        name: 'view_only',
        actionsByResource: [
          {
            resource: 'company',
            // 'company.*' actions are needed here to have access to advanced company management page
            actions: ['company.list', 'company.view', 'asset.list', 'asset.view', 'fleet.list', 'fleet.view'],
          },
        ],
      },
    ],
  },
  {
    name: 'user',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            // 'company.*' actions are needed here to have access to advanced company management page
            actions: [
              'company.list',
              'company.view',
              'group.create',
              'group.list',
              'group.view',
              'user.create',
              'user.list',
              'group.restrictPermission',
            ],
          },
          {
            resource: 'user',
            actions: ['user.edit', 'user.delete', 'user.view'],
          },
        ],
      },
      {
        name: 'create_edit',
        actionsByResource: [
          {
            resource: 'company',
            // 'company.*' actions are needed here to have access to advanced company management page
            actions: ['company.list', 'company.view', 'group.list', 'group.view', 'user.create', 'user.list'],
          },
          {
            resource: 'user',
            actions: ['user.edit', 'user.view'],
          },
        ],
      },
      {
        name: 'view_only',
        actionsByResource: [
          {
            resource: 'company',
            // 'company.*' actions are needed here to have access to advanced company management page
            actions: ['company.list', 'company.view', 'user.list', 'user.view', 'group.list', 'group.view'],
          },
        ],
      },
    ],
  },
  {
    name: 'device',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            actions: [
              'device.batchCreate',
              'device.batchEdit',
              'device.create',
              'device.list',
              'device.view',
              'device.edit',
              'asset.edit',
              'asset.nameValidate',
            ],
          },
        ],
      },
      {
        name: 'create_edit',
        actionsByResource: [
          {
            resource: 'company',
            actions: [
              'device.batchCreate',
              'device.batchEdit',
              'device.create',
              'device.list',
              'device.view',
            ],
          },
        ],
      },
      {
        name: 'view_only',
        actionsByResource: [
          {
            resource: 'company',
            actions: ['device.list', 'device.view'],
          },
        ],
      },
    ],
  },
];
export const externalLinksFeatureConfigs: FeatureConfig[] = [
  {
    name: 'advancedTracking',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [],
      },
    ],
  },
  {
    name: 'apiPortal',
    accessLevels: [
      {
        name: 'full_access',
        actionsByResource: [
          {
            resource: 'company',
            actions: ['apiPortal.assetHistoryList', 'apiPortal.assetList', 'apiPortal.snapshotList'],
          },
          {
            resource: 'user',
            actions: [
              'apiPortal.apiKeyCreate',
              'apiPortal.apiKeyDelete',
              'apiPortal.apiKeyView',
              'apiPortal.view',
            ],
          },
        ],
      },
    ],
  },
];

export const allFeaturesWithFullAccess: Feature[] = [
  ...coreFeatureConfigs,
  ...adminFeatureConfigs,
  ...externalLinksFeatureConfigs,
].map(({ name }) => ({
  name,
  accessLevel: 'full_access',
}));
