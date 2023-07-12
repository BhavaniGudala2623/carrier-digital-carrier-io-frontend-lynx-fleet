import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import i18n from 'i18next';
import { AssetHistoryAsset } from '@carrier-io/lynx-fleet-types';

import { assetHistorySlice, IAssetError } from '../slice';

import { AppDispatch } from '@/stores';
import { getErrorMessage } from '@/utils';

const { actions } = assetHistorySlice;

export const getAssetsAction = () => async (dispatch: AppDispatch) => {
  dispatch(actions.startFetchAssetsCall());

  let assets: AssetHistoryAsset[] = [];

  try {
    let nextToken: string | undefined;

    do {
      const { data } = await AssetService.getAssetHistoryAssets({ nextToken, limit: 1000 }, 'network-only');
      const response = data.getAssetSnapshotsForTenant;

      nextToken = response.nextToken ?? undefined;
      assets = assets.concat(response.snapshots ?? []);
    } while (nextToken);

    return dispatch(actions.assetsFetched({ assets }));
  } catch (err) {
    const message = getErrorMessage(err);
    const errorMessage = i18n.t(message) ?? message;
    const error = {
      ...(err as Error),
      clientMessage: `Error loading assets ${errorMessage}`,
    };

    // eslint-disable-next-line no-console
    console.error(JSON.stringify(error));
    dispatch(actions.catchAssetsError({ error } as IAssetError));

    return undefined;
  }
};
