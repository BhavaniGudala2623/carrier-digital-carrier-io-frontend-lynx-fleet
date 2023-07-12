import { AssetView } from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { assetHistorySlice } from '../slice';
import { handleAssetViewError } from '../../utils';

import { getAssetViewsByUserEmailAction } from './getAssetViewsByUserEmailAction';

import type { AppDispatch } from '@/stores';

const { actions } = assetHistorySlice;

export const setAssetViewAsDefaultAction =
  (email: string, id: AssetView['id']) => (dispatch: AppDispatch) => {
    dispatch(actions.startFetchAssetViewsCall());

    return AssetService.setAssetViewAsDefault({ assetViewId: id as string })
      .then((res) => {
        if (res.data?.setAssetViewAsDefault?.error) {
          handleAssetViewError(new Error(res.data.setAssetViewAsDefault.error), dispatch);
        } else {
          dispatch(getAssetViewsByUserEmailAction(email));
        }
      })
      .catch((err) => {
        handleAssetViewError(err, dispatch);
      });
  };
