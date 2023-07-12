import { composeColumnsUserSettings, applyComposedColumnsUserSettings } from './columnsUserSettings';

import { Columns } from '@/types';

const mockDefaultColDefs: Columns = [
  {
    colId: 'assetName',
    field: 'asset.name',
    headerName: 'Name',
    sort: null,
    hide: false,
    pinned: 'left',
  },
  {
    colId: 'assetSerial',
    field: 'asset.serial',
    headerName: 'Asset serial',
    sort: null,
    hide: false,
    pinned: undefined,
  },
  {
    groupId: 'compartmen1',
    headerName: 'Compartment 1',
    children: [
      {
        colId: 'c1.setpoint',
        field: 'c1.setpoint',
        headerName: 'c1 setpoint',
        sort: null,
        hide: false,
        pinned: undefined,
      },
      {
        colId: 'c1.supply',
        field: 'c1.supply',
        headerName: 'c1 supply',
        sort: null,
        hide: false,
        pinned: undefined,
      },
      {
        colId: 'c1.return',
        field: 'c1.return',
        headerName: 'c1 setpoint',
        sort: null,
        hide: false,
        pinned: undefined,
      },
    ],
  },
  {
    groupId: 'compartmen2',
    headerName: 'Compartment 2 with second level nested children',
    children: [
      {
        colId: 'c2.setpoint',
        field: 'c2.setpoint',
        headerName: 'c2 setpoint',
        sort: null,
        hide: false,
        pinned: undefined,
      },
      {
        colId: 'c2.supply',
        field: 'c2.supply',
        headerName: 'c2 supply',
        sort: null,
        hide: false,
        pinned: undefined,
      },
      {
        groupId: 'compartmen2.1',
        children: [
          {
            colId: 'c2.1.setpoint',
            field: 'c2.1.setpoint',
            headerName: 'c2.1 setpoint',
            sort: null,
            hide: false,
            pinned: undefined,
          },
          {
            colId: 'c2.1.supply',
            field: 'c2.1.supply',
            headerName: 'c2.1 supply',
            sort: null,
            hide: false,
            pinned: undefined,
          },
        ],
      },
    ],
  },
  {
    colId: 'date',
    field: 'date',
    headerName: 'Date',
    sort: null,
    hide: false,
    pinned: undefined,
  },
  {
    colId: 'createdBy',
    field: 'createdBy',
    headerName: 'created bt',
    sort: null,
    hide: false,
    pinned: undefined,
  },
];

const mockNewColDefs = [
  {
    groupId: 'compartmen2',
    headerName: 'Compartment 2 with second level nested children',
    children: [
      {
        colId: 'c2.supply',
        field: 'c2.supply',
        headerName: 'c2 supply',
        sort: null,
        hide: false,
        pinned: undefined,
      },
      {
        groupId: 'compartmen2.1',
        children: [
          {
            colId: 'c2.1.supply',
            field: 'c2.1.supply',
            headerName: 'c2.1 supply',
            sort: null,
            hide: false,
            pinned: undefined,
          },
          {
            colId: 'c2.1.setpoint',
            field: 'c2.1.setpoint',
            headerName: 'c2.1 setpoint',
            sort: null,
            hide: true,
            pinned: undefined,
          },
        ],
      },
      {
        colId: 'c2.setpoint',
        field: 'c2.setpoint',
        headerName: 'c2 setpoint',
        sort: null,
        hide: false,
        pinned: undefined,
      },
    ],
  },
  {
    colId: 'assetName',
    field: 'asset.name',
    headerName: 'Name',
    sort: 'asc',
    hide: false,
    pinned: 'left',
  },
  {
    colId: 'assetSerial',
    field: 'asset.serial',
    headerName: 'Asset serial',
    sort: null,
    hide: false,
    pinned: undefined,
  },
  {
    groupId: 'compartmen1',
    headerName: 'Compartment 1',
    children: [
      {
        colId: 'c1.setpoint',
        field: 'c1.setpoint',
        headerName: 'c1 setpoint',
        sort: null,
        hide: false,
        pinned: undefined,
      },
      {
        colId: 'c1.supply',
        field: 'c1.supply',
        headerName: 'c1 supply',
        sort: null,
        hide: false,
        pinned: undefined,
      },
      {
        colId: 'c1.return',
        field: 'c1.return',
        headerName: 'c1 setpoint',
        sort: null,
        hide: false,
        pinned: 'left',
      },
    ],
  },
  {
    colId: 'createdBy',
    field: 'createdBy',
    headerName: 'created bt',
    sort: 'asc',
    hide: false,
    pinned: 'right',
  },
  {
    colId: 'date',
    field: 'date',
    headerName: 'Date',
    sort: null,
    hide: true,
    pinned: undefined,
  },
];

const mockDifferences = [
  '{"id":"assetName","sort":"asc","index":1}',
  '{"id":"assetSerial","index":2}',
  '{"groupId":"compartmen1","index":3,"children":[{"id":"c1.return","pinned":"left"}]}',
  '{"groupId":"compartmen2","index":0,"children":[{"id":"c2.setpoint","index":2},{"id":"c2.supply","index":0},{"groupId":"compartmen2.1","index":1,"children":[{"id":"c2.1.setpoint","index":1,"hide":true},{"id":"c2.1.supply","index":0}]}]}',
  '{"id":"date","index":5,"hide":true}',
  '{"id":"createdBy","sort":"asc","index":4,"pinned":"right"}',
];

describe('saved columns', () => {
  const composedColumns = composeColumnsUserSettings({
    defaultColumns: mockDefaultColDefs,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changedColumns: mockNewColDefs as any,
  });
  it('should compose the differences from the default and changed tables', () => {
    expect(composedColumns).toEqual(mockDifferences);
  });
  it('should apply the differences to the default table and get the changed one', () => {
    const data = [{ name: 'default', columns: mockDifferences }];
    const appliedColumns = applyComposedColumnsUserSettings(mockDefaultColDefs, data);
    expect(appliedColumns).toEqual(mockNewColDefs);
  });
});
