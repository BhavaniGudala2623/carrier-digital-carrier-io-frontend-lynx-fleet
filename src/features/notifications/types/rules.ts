import { NotificationAssets, NotificationRuleCondition } from '@carrier-io/lynx-fleet-types';

export interface NotificationTimeFormData {
  hr: number;
  min: number;
}

export interface NotificationFormData {
  name: string;
  enableTimeCondition: boolean;
  sendEmail: boolean;
  recipients: string[];
  time: NotificationTimeFormData;
  conditions: NotificationRuleCondition[];
  exceptConditions: NotificationRuleCondition[];
  assets: NotificationAssets;
}
