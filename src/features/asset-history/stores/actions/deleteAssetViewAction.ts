import { AssetView } from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { assetHistorySlice } from '../slice';
import { handleAssetViewError } from '../../utils';

import { getAssetViewsByUserEmailAction } from './getAssetViewsByUserEmailAction';

import type { AppDispatch } from '@/stores';

const { actions } = assetHistorySlice;

export const deleteAssetViewAction = (view: AssetView) => (dispatch: AppDispatch) => {
  if (!view?.id) {
    return null;
  }

  dispatch(actions.startFetchAssetViewsCall());

  return AssetService.deleteAssetView({ assetViewId: view.id })
    .then((res) => {
      if (res.data?.deleteAssetView?.error) {
        handleAssetViewError(new Error(res.data.deleteAssetView.error), dispatch);
      }

      dispatch(getAssetViewsByUserEmailAction(view.email));
    })
    .catch((err) => {
      handleAssetViewError(err, dispatch);
    });
};
