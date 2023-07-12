import { IDatasource, IGetRowsParams } from '@ag-grid-community/core';
import { Maybe, Device, AssetHistoryData, Sorting, LanguageType } from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { TFunction } from 'i18next';

import { mapHistoryData, getDataColdIncludeStatus } from '../utils';

import { getSortDirectionFromParams } from '@/utils';

export const LIMIT = 15;

export class AssetHistoryTabDatasource implements IDatasource {
  protected nextToken: Maybe<string>;

  protected assetId: string;

  protected startDate: string | undefined;

  protected endDate: string | undefined;

  protected sort?: Maybe<Sorting>;

  protected onSuccess: (data: { device: Device }) => void;

  protected onFail: (data: { message: Maybe<string>; isError?: Maybe<boolean> }) => void;

  protected onLoadStarted: () => void;

  protected t: TFunction;

  protected appLanguage: LanguageType;

  constructor(
    assetId: string,
    startDate: string | undefined,
    endDate: string | undefined,
    onSuccess: (data: { device: Device }) => void,
    onFail: (data: { message: Maybe<string>; isError?: Maybe<boolean> }) => void,
    onLoadStarted: () => void,
    t: TFunction,
    appLanguage: LanguageType
  ) {
    this.nextToken = null;
    this.assetId = assetId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onLoadStarted = onLoadStarted;
    this.t = t;
    this.appLanguage = appLanguage;
  }

  getRows(params: IGetRowsParams) {
    const sort = getSortDirectionFromParams(params, 'timestamp');

    if (sort !== this.sort) {
      this.updateNextToken(null);
      this.updateSort(sort);
    }
    this.onLoadStarted();

    if (!this.startDate || !this.endDate) {
      return;
    }

    AssetService.getAssetHistoryList(
      {
        assetId: this.assetId,
        startDate: this.startDate,
        endDate: this.endDate,
        sort,
        nextToken: this.nextToken,
        limit: LIMIT,
        appLanguage: this.appLanguage ?? 'en-US',
      },
      'cache-first'
    )
      .then((response) => {
        const { history, asset, device, units } = response.data?.getAssetHistory?.data ?? {};

        if (!device) {
          this.onFail({
            message: `${this.t('asset.history')}: ${this.t('assethistory.asset-has-no-data')}`,
          });
        }

        const nextTokenNew = response.data?.getAssetHistory?.nextToken ?? null;
        const filledData = history?.map((data: AssetHistoryData) =>
          mapHistoryData(data, asset, device, units)
        );

        if (nextTokenNew) {
          params.successCallback(filledData ?? []);
        } else {
          params.successCallback(filledData ?? [], params.startRow + (filledData?.length ?? 0));
        }

        if (device) {
          this.onSuccess({
            device: {
              ...device,
              includeDatacoldSensors: getDataColdIncludeStatus(device),
            },
          });
        } else {
          this.onFail({
            message: `${this.t('asset.history')}: ${this.t('assethistory.asset-has-no-data')}`,
          });
        }
        this.updateNextToken(nextTokenNew);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('ASSET HISTORY ERROR', error.message);

        this.onFail({ message: this.t('assethistory.error-loading-asset-history'), isError: true });
      });
  }

  updateSort(sort?: Maybe<Sorting>) {
    this.sort = sort;
  }

  updateNextToken(nextToken: Maybe<string>) {
    this.nextToken = nextToken;
  }
}
