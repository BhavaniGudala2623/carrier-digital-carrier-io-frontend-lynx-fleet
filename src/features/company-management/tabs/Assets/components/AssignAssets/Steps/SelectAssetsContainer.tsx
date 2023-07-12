import { AssetRow } from '@carrier-io/lynx-fleet-types';

import { SelectAssets } from '../../SelectAssets';

import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';

interface SelectAssetsContainerProps {
  onSelectedAssetsChange?: (assets: AssetRow[]) => void;
}
export const SelectAssetsContainer = ({ onSelectedAssetsChange }: SelectAssetsContainerProps) => {
  const tenantId = useAppSelector(getAuthTenantId);

  return (
    <SelectAssets
      onSelectedAssetsChange={onSelectedAssetsChange}
      tenantId={tenantId}
      showOnlyUnassignedAssets
    />
  );
};
