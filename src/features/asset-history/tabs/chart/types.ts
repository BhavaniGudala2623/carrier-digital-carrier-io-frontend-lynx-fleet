import { HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';

export type ReportFormData = {
  assetId: string;
  assetName: string;
  tenantName: string;
  tenantId: string;
  fleetNames: string[];
  licensePlate: string;
  truSerial: string;
  truSystemType: string;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  flespiId?: Maybe<number>;
  quickDate: Maybe<QuickDate>;
  frequency: Maybe<HistoryFrequency>;
};
