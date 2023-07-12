import { useCallback } from 'react';
import { ActionRequest } from '@carrier-io/rbac-provider-react';
import { RbacService } from '@carrier-io/lynx-fleet-data-lib';

export const usePermissionsRequest = () =>
  useCallback(async (actions: ActionRequest[]) => {
    const response = await RbacService.hasPermissions({ input: actions });

    const { errors, data } = response;

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    const { permissions, error } = data.hasPermissions;

    if (error) {
      throw new Error(error);
    }

    return permissions ?? [];
  }, []);

export const useMockPermissionRequest = () =>
  useCallback(async (actions: ActionRequest[]) => actions.map((a) => ({ ...a, allow: true })), []);
