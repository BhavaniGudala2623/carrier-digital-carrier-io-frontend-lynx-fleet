import { Maybe } from '@carrier-io/lynx-fleet-types';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';
import { Group, GroupData } from '@carrier-io/lynx-fleet-types/dist/common/group';
import { uniq } from 'lodash-es';

import { getAuthUserGroups, getAuthUserIsCarrierAdmin } from '@/features/authentication';
import { useAppSelector } from '@/stores';

export const useAllowedRegionsAndCountries = (): {
  allowedRegions: Maybe<string[]>;
  allowedCountries: Maybe<string[]>;
} => {
  const authUserIsCarrierAdmin = useAppSelector(getAuthUserIsCarrierAdmin);
  const groups = useAppSelector(getAuthUserGroups);

  const { data: getGroups } = CompanyService.useGetGroups({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const allowedRegionsAndCountries = !authUserIsCarrierAdmin
    ? getGroups?.getGroups
        ?.filter((g) => groups.map(({ group }) => group.id).includes(g.id))
        .reduce(
          (previousValue, currentValue: GroupData): Group['accessAllowedRestrictions'] => ({
            regions: uniq([
              ...(previousValue?.regions || []),
              ...(currentValue.accessAllowedRestrictions?.regions || []),
            ]),
            countries: uniq([
              ...(previousValue?.countries || []),
              ...(currentValue.accessAllowedRestrictions?.countries || []),
            ]),
          }),
          {} as Group['accessAllowedRestrictions']
        )
    : null;

  return {
    allowedRegions: allowedRegionsAndCountries?.regions || null,
    allowedCountries: allowedRegionsAndCountries?.countries || null,
  };
};
