import { Maybe } from '@carrier-io/lynx-fleet-types';

export type Step1FormValues = {
  tempChart: boolean;
  events: boolean;
  legend: boolean;
  table: boolean;
};

export type Step2FormValues = {
  reportName: string;
  logoUrl: string;
  attachLogo: boolean;
  attachedFile: string;
};

export type Step1FormErrors = {
  legendError: string | undefined;
};

export type Step2FormErrors = {
  reportNameError: string | undefined;
};

export type CreateReportFormValues = Step1FormValues & Step2FormValues;

export type SharedReportState = {
  logoFile: Maybe<File>;
  setLogoFile: (x: File) => void;
  tenantLogoUrl: Maybe<string>;
  setTenantLogoUrl: (x: Maybe<string>) => void;
  inProgress: boolean;
  setInProgress: (x: boolean) => void;
};
