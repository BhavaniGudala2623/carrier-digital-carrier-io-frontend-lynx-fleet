import { Maybe } from '@carrier-io/lynx-fleet-types';

export interface IGetRowClassParams {
  data?: {
    device_com_connection_status_1?: boolean;
    synthetic_tru_status?: string;
  };
}

export interface IEventHistoryParams extends IGetRowClassParams {
  value?: Maybe<string | number>;
  eventName?: string;
  column?: {
    userProvidedColDef?: {
      eventName?: string;
      colId?: string;
    };
  };
}
