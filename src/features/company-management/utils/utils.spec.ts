import { getObjectDifference, isAssetPopulatedRow, getEntityType } from './utils';

describe('getObjectDifference', () => {
  it('#1. Returns correct getObjectDifference', async () => {
    const o1 = { name: 'fake-name' };
    const o2 = { name: 'fake-name' };
    expect(getObjectDifference(o1, o2)).toEqual({});
  });

  it('#2. Returns correct getObjectDifference #1', async () => {
    const o1 = { name: 'name', b: 2, c: { d: 5 } };
    const o2 = { name: 'name', b: 1, c: { d: 7 } };
    expect(getObjectDifference(o1, o2)).toEqual({ b: 2, c: { d: 5 } });
  });

  it('#2. Returns correct getObjectDifference #2', async () => {
    const object = {
      name: 'new-company-name',
      contactInfo: {
        name: 'fake-name',
        lastName: 'fake-last-name',
        phone: '+7 777 777 778',
        email: 'fake@mail.com',
        companyAddress: 'Str. Fake',
        city: 'Fake',
        country: 'Finland',
        address: 'Helsinki, str. Some',
      },
      features: {
        companyManagement: true,
        deviceManagement: false,
        notifications: false,
        twoWayCommands: false,
        assetManagement: false,
        advancedTrackingEnabled: false,
        geofences: false,
      },
    };
    const baseObj = {
      name: 'company-name',
      contactInfo: {
        name: 'fake-name',
        lastName: 'fake-last-name',
        phone: '+7 777 777 777',
        email: 'fake@mail.com',
        companyAddress: 'Str. Fake',
        city: 'Fake',
        country: 'Finland',
        address: 'Helsinki, str. Some',
      },
      features: {
        companyManagement: false,
        deviceManagement: false,
        notifications: false,
        twoWayCommands: false,
        assetManagement: false,
        advancedTrackingEnabled: false,
        geofences: false,
      },
    };
    expect(getObjectDifference(object, baseObj)).toEqual({
      name: 'new-company-name',
      contactInfo: { phone: '+7 777 777 778' },
      features: { companyManagement: true },
    });
  });
});

describe('isAssetPopulatedRow', () => {
  it('#1. isAssetPopulatedRow should return true', async () => {
    expect(isAssetPopulatedRow({ __typename: 'AssetPopulated' })).toBeTruthy();
  });
  it('#2. isAssetPopulatedRow should return false', async () => {
    expect(isAssetPopulatedRow({ __typename: 'NotAssetPopulated' })).toBeFalsy();
    expect(isAssetPopulatedRow({})).toBeFalsy();
  });
});

describe('getEntityType', () => {
  it('#1. getEntityType should not return type', async () => {
    expect(getEntityType({})).toBeNull();
  });
  it('#2. getEntityType should return type', async () => {
    expect(getEntityType({ __typename: 'AssetPopulated' })).toEqual('AssetPopulated');
  });
});
