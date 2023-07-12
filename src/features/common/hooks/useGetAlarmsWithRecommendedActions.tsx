import { FreezerControlType, LanguageType, RecommendedAction } from '@carrier-io/lynx-fleet-types';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { SnapshotDataEx, FreezerAlarmWithRecommendedAction } from '../types';

import { showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { useApplicationContext } from '@/providers/ApplicationContext';

const controllersWithRecommendations: FreezerControlType[] = ['APX'];

export const useGetAlarmsWithRecommendedActions = (
  selectedAsset: SnapshotDataEx,
  controllerType?: FreezerControlType
) => {
  const { appLanguage } = useApplicationContext();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [recommendedActions, setRecommendedActions] = useState<RecommendedAction[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const activeAlarmsData: FreezerAlarmWithRecommendedAction[] = useMemo(
    () =>
      selectedAsset?.activeFreezerAlarms?.map((alarm) => {
        const code = alarm?.code;

        const recommendation = recommendedActions.find((action) => action.code === code);

        return {
          ...alarm,
          recommendation: recommendation?.action ?? '',
        };
      }) ?? [],
    [recommendedActions, selectedAsset?.activeFreezerAlarms]
  );

  const fetchAlarmRecommendedActions = useCallback(
    async (codes: string[], language: LanguageType, controller: FreezerControlType) => {
      try {
        setLoading(true);

        const {
          data: { getAlarmRecommendedActions: recommendedActionsData },
        } = await AssetService.getAlarmRecommendedActions(
          {
            codes,
            language,
            controller,
          },
          'cache-first'
        );

        if (
          recommendedActionsData.success &&
          recommendedActionsData.docs &&
          recommendedActionsData.docs.length > 0
        ) {
          setRecommendedActions(recommendedActionsData.docs);
        } else if (recommendedActionsData?.error) {
          setError(recommendedActionsData.error);
        }
      } catch (e) {
        setError(t('asset.recommendations-loading-error'));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    const codes = selectedAsset?.activeFreezerAlarms?.reduce(
      (acc: string[], alarm) => (alarm?.code ? [...acc, alarm.code] : acc),
      []
    );

    if (
      codes &&
      codes.length !== 0 &&
      controllerType &&
      controllersWithRecommendations.includes(controllerType)
    ) {
      fetchAlarmRecommendedActions(codes, appLanguage, controllerType);
    }
  }, [selectedAsset, controllerType, appLanguage, fetchAlarmRecommendedActions]);

  useEffect(() => {
    if (error) {
      showMessage(dispatch, error);
    }
  }, [dispatch, error]);

  return { loading, activeAlarmsData };
};
