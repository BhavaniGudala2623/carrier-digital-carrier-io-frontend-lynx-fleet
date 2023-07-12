import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import i18n from 'i18next';

import { assetHistorySlice } from '../slice';
import { handleAssetViewError } from '../../utils';

import { AppDispatch } from '@/stores';

const { actions } = assetHistorySlice;

export const getAssetViewsByUserEmailAction = (email?: string) => (dispatch: AppDispatch) => {
  if (!email) {
    return null;
  }

  dispatch(actions.startFetchAssetViewsCall());

  return AssetService.getAssetViewsByUserEmail({ email })
    .then((res) => {
      let assetViews = res?.data?.getAssetViewsByUserEmail;

      assetViews = assetViews.map((assetView) => ({
        ...assetView,
        legendSettings: assetView?.legendSettings && JSON.parse(assetView.legendSettings),
      }));
      assetViews.sort((view1, view2) => {
        if (view1?.created && view2?.created) {
          return view1.created < view2.created ? 1 : -1;
        }

        return -1;
      });
      dispatch(
        actions.assetViewsFetched({
          assetViews,
        })
      );
    })
    .catch((err) => {
      const errorMessage = i18n.t(err.message);
      const error = {
        ...err,
        clientMessage: `Error getting Views by user email ${errorMessage}`,
      };

      handleAssetViewError(error, dispatch);
    });
};
