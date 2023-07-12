import { useMemo } from 'react';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

export const useGetUsersForTenant = (tenantId: string, usersEmailToExclude?: string[]) => {
  const { data: usersData, loading: isLoadingUsers } = CompanyService.useGetUsersForTenant(
    { tenantId },
    { notifyOnNetworkStatusChange: true }
  );

  const users = useMemo(() => {
    if (usersData) {
      return usersEmailToExclude
        ? usersData.getUsersForTenant.filter((u) => !usersEmailToExclude.includes(u.email))
        : usersData.getUsersForTenant;
    }

    return [];
  }, [usersData, usersEmailToExclude]);

  return { users, isLoadingUsers };
};
