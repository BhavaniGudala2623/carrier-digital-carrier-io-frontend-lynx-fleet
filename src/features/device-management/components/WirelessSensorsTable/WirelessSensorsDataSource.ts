import { Maybe, SortingParams, BluetoothSensorFilter } from '@carrier-io/lynx-fleet-types';
import { IDatasource, IGetRowsParams } from '@ag-grid-community/core';
import { TFunction } from 'i18next';
import { BluetoothService } from '@carrier-io/lynx-fleet-data-lib';

import { getSortFromParams } from '@/utils';

export const LIMIT = 30;

export class WirelessSensorsDataSource implements IDatasource {
  protected nextToken?: string;

  protected sort?: SortingParams;

  protected onSuccess: (total: number) => void;

  protected onFail: (message: Maybe<string>) => void;

  protected onLoadStarted: (callback: () => void) => void;

  protected filter: BluetoothSensorFilter;

  protected t: TFunction;

  constructor(
    onSuccess: (total: number) => void,
    onFail: (message: Maybe<string>) => void,
    onLoadStarted: (callback: () => void) => void,
    filter: BluetoothSensorFilter,
    t: TFunction
  ) {
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onLoadStarted = onLoadStarted;
    this.filter = filter;
    this.t = t;
  }

  getRows(params: IGetRowsParams) {
    const sort = getSortFromParams(params, 'assetName', 'ASC');

    if (sort.field !== this.sort?.field || sort.direction !== this.sort?.direction) {
      this.updateNextToken(undefined);
      this.updateSort(sort);
    }
    this.onLoadStarted(this.resetNextToken);

    BluetoothService.getBluetoothSensors({
      options: {
        pagination: { limit: LIMIT, nextToken: this.nextToken },
        filter: this.filter,
        sorting: this.sort,
      },
    })
      .then((response) => {
        const data = response.data.getBluetoothSensors;
        const payload = data?.payload;

        if (data.success && payload && payload !== null) {
          const { items, nextToken: nextTokenNew, totalItems } = payload;

          if (nextTokenNew) {
            params.successCallback(items ?? []);
          } else {
            params.successCallback(items ?? [], params.startRow + (items?.length ?? 0));
          }

          this.onSuccess(totalItems ?? 0);
          this.updateNextToken(nextTokenNew ?? undefined);
        } else {
          this.onFail(this.t('device.management.bluetooth-sensors.error-loading-sensors'));
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error loading sensors: ', error);

        this.onFail(this.t('device.management.bluetooth-sensors.error-loading-sensors'));
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
