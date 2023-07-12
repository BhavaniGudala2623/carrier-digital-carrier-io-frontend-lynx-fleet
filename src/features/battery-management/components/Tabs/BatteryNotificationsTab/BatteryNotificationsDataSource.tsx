import { IDatasource, IGetRowsParams } from '@ag-grid-community/core';
import { BatteryService } from '@carrier-io/lynx-fleet-data-lib';
import { Maybe, SortingParams, BatteryNotificationListFilter } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

import { ROWS_LIMIT } from '../../../constants';

import { getSortFromParams } from '@/utils';
import { showError } from '@/stores/actions';
import { AppDispatch } from '@/stores';
import { DateRangeFilter } from '@/features/battery-management/types';

export class BatteryNotificationsDataSource implements IDatasource {
  protected nextToken?: string;

  protected sort?: SortingParams;

  protected onSuccess: (total: number) => void;

  protected onFail: (message: Maybe<string>) => void;

  protected onLoadStarted: (callback: () => void) => void;

  protected t: TFunction;

  protected dispatch: AppDispatch;

  protected dateRangeFilter: DateRangeFilter;

  constructor(
    onSuccess: (total: number) => void,
    onFail: (message: Maybe<string>) => void,
    onLoadStarted: (callback: () => void) => void,
    t: TFunction,
    dispatch: AppDispatch,
    dateRangeFilter: DateRangeFilter
  ) {
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onLoadStarted = onLoadStarted;
    this.t = t;
    this.dispatch = dispatch;
    this.dateRangeFilter = dateRangeFilter;
  }

  getRows(params: IGetRowsParams) {
    const { startDate, endDate } = this.dateRangeFilter;
    const sort = getSortFromParams(params, 'createdAt', 'DESC');
    if (sort.field !== this.sort?.field || sort.direction !== this.sort?.direction) {
      this.updateNextToken();
      this.updateSort(sort);
    }
    this.onLoadStarted(this.resetNextToken);
    BatteryService.getBatteryNotificationList({
      options: {
        pagination: { limit: ROWS_LIMIT, nextToken: this.nextToken },
        filter: {
          field: 'createdAt',
          value: '',
          startDate,
          endDate,
        } as BatteryNotificationListFilter,
        sorting: this.sort,
      },
    })
      .then((response) => {
        const { items, nextToken: nextTokenNew, totalItems } = response.data.getBatteryNotificationList;
        if (nextTokenNew) {
          params.successCallback(items ?? []);
        } else {
          params.successCallback(items ?? [], params.startRow + (items?.length ?? 0));
        }

        this.onSuccess(totalItems ?? 0);
        this.updateNextToken(nextTokenNew ?? undefined);
      })
      .catch(() => {
        const error = this.t('battery.management.battery.notifications.error-loading-battery-notifications');
        showError(this.dispatch, error);
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
