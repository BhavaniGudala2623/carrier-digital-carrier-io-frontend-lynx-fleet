import { DeviceFilter, Maybe, SortingParams } from '@carrier-io/lynx-fleet-types';
import { IDatasource, IGetRowsParams } from '@ag-grid-community/core';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { TFunction } from 'i18next';

import { getSortFromParams } from '@/utils';

export const LIMIT = 50;

export class DeviceProvisioningDataSource implements IDatasource {
  protected nextToken?: string;

  protected sort?: SortingParams;

  protected onSuccess: (total: number) => void;

  protected onFail: (message: Maybe<string>) => void;

  protected onLoadStarted: (callback: () => void) => void;

  protected filter: DeviceFilter;

  protected t: TFunction;

  constructor(
    onSuccess: (total: number) => void,
    onFail: (message: Maybe<string>) => void,
    onLoadStarted: (callback: () => void) => void,
    filter: DeviceFilter,
    t: TFunction
  ) {
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onLoadStarted = onLoadStarted;
    this.filter = filter;
    this.t = t;
  }

  getRows(params: IGetRowsParams) {
    const sort = getSortFromParams(params, 'activationDate', 'DESC');

    if (sort.field !== this.sort?.field || sort.direction !== this.sort?.direction) {
      this.updateNextToken(undefined);
      this.updateSort(sort);
    }
    this.onLoadStarted(this.resetNextToken);

    AssetService.getDevices({
      options: {
        pagination: { limit: LIMIT, nextToken: this.nextToken },
        filter: this.filter,
        sorting: this.sort,
      },
    })
      .then((response) => {
        const { items, nextToken: nextTokenNew, totalItems } = response.data.getDevices;

        if (nextTokenNew) {
          params.successCallback(items ?? []);
        } else {
          params.successCallback(items ?? [], params.startRow + (items?.length ?? 0));
        }

        this.onSuccess(totalItems ?? 0);
        this.updateNextToken(nextTokenNew ?? undefined);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error loading devices: ', error.message);

        this.onFail(this.t('device.management.device.provisioning.error-loading-devices'));
      });
  }

  updateSort(sort: SortingParams) {
    this.sort = sort;
  }

  updateNextToken(nextToken?: string) {
    this.nextToken = nextToken;
  }

  resetNextToken = () => {
    this.updateNextToken();
  };
}
