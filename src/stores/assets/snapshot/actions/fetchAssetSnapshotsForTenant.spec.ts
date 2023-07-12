import { assetSnapshotsSlice } from '../slice';

import { fetchAssetSnapshotsForTenant } from './fetchAssetSnapshotsForTenant';

const { actions } = assetSnapshotsSlice;

let i = 0;
jest.mock('@carrier-io/lynx-fleet-data-lib', () => ({
  AssetService: {
    getAssetSnapshotsForTenant: jest.fn().mockImplementation((query) => {
      i += 1;
      if (query.nextToken === undefined) {
        // fallback case leads to exception and fails our expectation
        if (i === 3) {
          return {
            data: undefined,
          };
        }

        // assuming it to be very first call and we have data more than the query limit
        return {
          data: {
            getAssetSnapshotsForTenant: {
              nextToken: 1,
            },
          },
        };
      }
      if (query.nextToken) {
        // mock end of the data, hence setting nextToken as null
        if (i === 3) {
          return {
            data: {
              getAssetSnapshotsForTenant: {
                nextToken: null,
              },
            },
          };
        }

        // update the nextToken for next set of data
        return {
          data: {
            getAssetSnapshotsForTenant: {
              nextToken: i,
            },
          },
        };
      }

      return {
        data: undefined,
      };
    }),
  },
}));

describe('Test fetchAssetSnapshotsForTenant', () => {
  it('nextToken should be updated properly', async () => {
    const dispatch = jest.fn();

    const mockStartCall = jest.spyOn(actions, 'startCall').mockImplementation(jest.fn());
    const mockAssetSnapshotsFetched = jest
      .spyOn(actions, 'assetSnapshotsFetched')
      .mockImplementation(jest.fn());

    await fetchAssetSnapshotsForTenant('en-US')(dispatch);

    expect(mockStartCall).toHaveBeenCalledTimes(1);
    expect(mockAssetSnapshotsFetched).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledTimes(2);
  });
});
