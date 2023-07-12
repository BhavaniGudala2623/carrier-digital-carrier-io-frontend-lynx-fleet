import { AssetView, Maybe } from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { assetHistorySlice } from '../slice';
import { handleAssetViewError } from '../../utils';

import { getAssetViewsByUserEmailAction } from './getAssetViewsByUserEmailAction';

import { showError, showMessage } from '@/stores/actions';
import type { AppDispatch } from '@/stores';

const { actions } = assetHistorySlice;

type SetSelectedView = (view: Maybe<string | number>) => void;

export const saveAssetViewAction =
  (view: AssetView, setSelectedView: SetSelectedView, onSuccessMessage: string) =>
  (dispatch: AppDispatch) => {
    if (!view?.email) {
      return null;
    }

    dispatch(actions.startFetchAssetViewsCall());

    return AssetService.saveAssetView({ input: view })
      .then((res) => {
        if (res.data?.saveAssetView?.error) {
          handleAssetViewError(new Error(res.data.saveAssetView.error), dispatch);
          showError(dispatch, new Error(res.data.saveAssetView.error));
        } else {
          const assetViewId = res.data?.saveAssetView?.assetView?.id || '';

          setSelectedView(assetViewId);
          dispatch(getAssetViewsByUserEmailAction(view.email));
          showMessage(dispatch, onSuccessMessage);
        }
      })
      .catch((err) => {
        handleAssetViewError(err, dispatch);
      });
  };
