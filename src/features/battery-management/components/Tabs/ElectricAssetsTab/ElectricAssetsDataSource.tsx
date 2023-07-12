import { IDatasource, IGetRowsParams } from '@ag-grid-community/core';
import { BatteryService } from '@carrier-io/lynx-fleet-data-lib';
import { Maybe, SortingParams } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

import { ROWS_LIMIT } from '../../../constants';
import {
  electricAssetsError,
  electricAssetsSuccess,
  updateElectricAssetsFiltersData,
} from '../../../stores/batteryManagement/batteryManagementAction';

import { getSortFromParams } from '@/utils';
import { showError } from '@/stores/actions';
import { AppDispatch } from '@/stores';
import { BatteryFilterTypes } from '@/features/battery-management/types';

export class ElectricAssetsDataSource implements IDatasource {
  protected nextToken?: string;

  protected sort?: SortingParams;

  protected onSuccess: (total: number) => void;

  protected onFail: (message: Maybe<string>) => void;

  protected onLoadStarted: (callback: () => void) => void;

  protected t: TFunction;

  protected dispatch: AppDispatch;

  protected selectedQuickFilter: BatteryFilterTypes | '';

  constructor(
    onSuccess: (total: number) => void,
    onFail: (message: Maybe<string>) => void,
    onLoadStarted: (callback: () => void) => void,
    t: TFunction,
    dispatch: AppDispatch,
    selectedQuickFilter: BatteryFilterTypes | ''
  ) {
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onLoadStarted = onLoadStarted;
    this.t = t;
    this.dispatch = dispatch;
    this.selectedQuickFilter = selectedQuickFilter;
  }

  getRows(params: IGetRowsParams) {
    const sort = getSortFromParams(params, 'assetId', 'DESC');
    if (sort.field !== this.sort?.field || sort.direction !== this.sort?.direction) {
      this.updateNextToken();
      this.updateSort(sort);
    }

    if (this.selectedQuickFilter === '') {
      this.selectedQuickFilter = BatteryFilterTypes.ASSET_NAME;
    }
    this.onLoadStarted(this.resetNextToken);

    BatteryService.getBatteries({
      options: {
        pagination: { limit: ROWS_LIMIT, nextToken: this.nextToken },
        filter: { field: this.selectedQuickFilter, value: '' },
        sorting: this.sort,
      },
    })
      .then((response) => {
        const { items, nextToken: nextTokenNew, totalItems, batteryMetrics } = response.data.getBatteries;
        updateElectricAssetsFiltersData(this.dispatch, batteryMetrics);

        if (nextTokenNew) {
          params.successCallback(items ?? []);
        } else {
          params.successCallback(items ?? [], params.startRow + (items?.length ?? 0));
        }

        this.onSuccess(totalItems ?? 0);
        this.updateNextToken(nextTokenNew ?? undefined);
        electricAssetsSuccess(this.dispatch);
      })
      .catch(() => {
        const error = this.t('battery.management.electric.assets.error-loading-electric-assets');
        showError(this.dispatch, error);
        electricAssetsError(this.dispatch, error);
        this.onFail(error);
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
