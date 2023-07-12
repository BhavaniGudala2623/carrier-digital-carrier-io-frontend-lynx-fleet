import i18n from 'i18next';

import { assetHistorySlice, IError } from '../stores/slice';

import type { AppDispatch } from '@/stores';

interface IAssetViewError extends IError {
  message: string;
}

type CombinedError = IAssetViewError & Error;

const { actions } = assetHistorySlice;

export const handleAssetViewError = (err: CombinedError, dispatch: AppDispatch) => {
  const errorMessage = i18n.t(err.message);
  const error = {
    ...err,
    clientMessage: `Error loading assets ${errorMessage}`,
  };

  dispatch(actions.catchFetchAssetViewsError({ error } as IError));
};
