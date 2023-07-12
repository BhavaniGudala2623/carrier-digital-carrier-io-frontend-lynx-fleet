import { AlertType, AssetStatusType, HealthStatusType, Maybe } from '@carrier-io/lynx-fleet-types';

type GenericSummary = {
  type: AssetStatusType | AlertType | HealthStatusType;
  assetIds: Maybe<string>[];
};

export function mapAssetsSummaries<T extends GenericSummary>(summaries: Maybe<T>[], summArray: Maybe<T>[]) {
  return summaries.reduce(
    (acc, item) =>
      item && acc.find((summary) => summary?.type === item.type)
        ? acc.map((summary) =>
            summary?.type === item.type
              ? {
                  ...summary,
                  assetIds: summary.assetIds.concat(item.assetIds),
                }
              : summary
          )
        : [...acc, item],
    summArray
  );
}
