import {
  AlertSummary,
  Maybe,
  StatusSummary,
  HealthSummary,
  SnapshotDataGql,
  GetAssetSnapshotsForTenantArgs,
  LanguageType,
} from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { assetSnapshotsSlice } from '../slice';

import { getErrorMessage, mapAssetsSummaries } from '@/utils';
import type { AppDispatch } from '@/stores';

const { actions } = assetSnapshotsSlice;

export const fetchAssetSnapshotsForTenant = (language: LanguageType) => async (dispatch: AppDispatch) => {
  dispatch(actions.startCall({}));

  let snapshots: Maybe<SnapshotDataGql>[] = [];
  let alertSummaries: Maybe<AlertSummary>[] = [];
  let statusSummaries: Maybe<StatusSummary>[] = [];
  let healthSummaries: Maybe<HealthSummary>[] = [];

  try {
    let nextToken: string | undefined;
    const query: GetAssetSnapshotsForTenantArgs = { nextToken, limit: 500, language };

    do {
      const { data } = await AssetService.getAssetSnapshotsForTenant(query, 'network-only');
      const response = data.getAssetSnapshotsForTenant;

      nextToken = response.nextToken ?? undefined;
      query.nextToken = nextToken;
      snapshots = snapshots.concat(response.snapshots ?? []);

      if (response.alertSummaries) {
        alertSummaries = mapAssetsSummaries(response.alertSummaries, alertSummaries);
      }

      if (response.statusSummaries) {
        statusSummaries = mapAssetsSummaries(response.statusSummaries, statusSummaries);
      }

      if (response.healthSummaries) {
        healthSummaries = mapAssetsSummaries(response.healthSummaries, healthSummaries);
      }
    } while (nextToken);

    return dispatch(
      actions.assetSnapshotsFetched({
        snapshots,
        alertSummaries,
        statusSummaries,
        healthSummaries,
      })
    );
  } catch (error) {
    dispatch(actions.catchError({ error: getErrorMessage(error) }));
  }

  return undefined;
};
