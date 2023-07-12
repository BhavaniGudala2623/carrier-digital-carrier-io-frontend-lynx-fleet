import { NotificationRuleCondition, NotificationRuleConditionType } from '@carrier-io/lynx-fleet-types';
import { FieldArray } from 'formik';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';

import { NotificationEventManager } from './NotificationEventManager';
import { AddEventButton } from './AddEventButton';

import { useApplicationContext } from '@/providers/ApplicationContext';

interface RuleConditionsProps {
  conditions: NotificationRuleCondition[];
  allowedEvents: NotificationRuleConditionType[];
  fieldName: string;
  error?: string;
  exclude?: boolean;
}

export const RuleConditions = ({
  conditions,
  fieldName,
  allowedEvents,
  error,
  exclude,
}: RuleConditionsProps) => {
  const { featureFlags } = useApplicationContext();
  const isFeatureFuelLevelEnabled = featureFlags.REACT_APP_FEATURE_FUEL_LEVEL;
  const isFeatureBatteryLevelEnabled = featureFlags.REACT_APP_FEATURE_BATTERY_LEVEL;
  const isAssetOfflineEnabled = featureFlags.REACT_APP_FEATURE_ASSET_OFFLINE;

  const flagChecker = (fuelFlag, batteryFlag, assetOfflineFlag) => {
    let newEvent = allowedEvents;
    if (!fuelFlag || !batteryFlag || !assetOfflineFlag) {
      if (!fuelFlag) {
        newEvent = newEvent.filter((word) => word !== 'FUEL_LEVEL');
      }
      if (!batteryFlag) {
        newEvent = newEvent.filter((word) => word !== 'BATTERY_LEVEL');
      }
      if (!assetOfflineFlag) {
        newEvent = newEvent.filter((word) => word !== 'ASSET_OFFLINE');
      }
    }

    return newEvent;
  };

  return (
    <FieldArray
      name={fieldName}
      render={(arrayHelpers) =>
        conditions.length > 0 ? (
          conditions.map((rule, index) => (
            <NotificationEventManager
              onRemove={() => arrayHelpers.remove(index)}
              onEdit={(event) => arrayHelpers.replace(index, event)}
              key={index.toString() + rule.type}
              event={rule}
              exclude={exclude}
            />
          ))
        ) : (
          <>
            <AddEventButton
              onAdd={(event: NotificationRuleCondition) => arrayHelpers.push(event)}
              sx={{ mb: 3 }}
              events={flagChecker(
                isFeatureFuelLevelEnabled,
                isFeatureBatteryLevelEnabled,
                isAssetOfflineEnabled
              )}
              exclude={exclude}
            />
            {error && typeof error === 'string' && <FormHelperText error>{error}</FormHelperText>}
          </>
        )
      }
    />
  );
};
