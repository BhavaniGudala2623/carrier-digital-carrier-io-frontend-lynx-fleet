import { AssetRow, HierarchicalFleet } from '@carrier-io/lynx-fleet-types';

export const makeNodeId = ({ data }: { data: AssetRow | Partial<HierarchicalFleet> }) =>
  data?.hierarchy ? `${data.hierarchy.join('-')}-${data.id}` : `${data.id}`;
