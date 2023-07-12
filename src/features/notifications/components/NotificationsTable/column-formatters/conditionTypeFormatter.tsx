import { ValueFormatterParams } from '@ag-grid-community/core';
import { NotificationRule } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

import { translateNotificationRuleConditionType } from '../../../utils';

export function conditionTypeFormatter(
  { value }: ValueFormatterParams<unknown, NotificationRule>,
  t: TFunction
) {
  return value ? translateNotificationRuleConditionType(t, value.condition?.type) : '';
}
