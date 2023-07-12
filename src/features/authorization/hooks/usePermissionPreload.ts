import { useRbac } from '@carrier-io/rbac-provider-react';
import { useEffect, useState } from 'react';
import { isEqual } from 'lodash-es';
import { LynxActionRequest } from '@carrier-io/lynx-fleet-types';

interface PermissionPreloadResponse {
  permissionLoading: boolean;
  permissionError?: unknown;
}

export const usePermissionPreload = (memorizedActions: LynxActionRequest[]): PermissionPreloadResponse => {
  const { preloadPermissions } = useRbac();
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [permissionError, setPermissionError] = useState();
  const [prevActions, setPrevActions] = useState<LynxActionRequest[]>();

  const requestActions =
    prevActions && isEqual(memorizedActions, prevActions) ? prevActions : memorizedActions;

  useEffect(() => {
    setPermissionLoading(true);
    setPermissionError(undefined);
    setPrevActions(requestActions);

    preloadPermissions(requestActions)
      .then(() => {
        setPermissionLoading(false);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error preloading permissions', error);
        setPermissionLoading(false);
        setPermissionError(error);
      });
  }, [preloadPermissions, requestActions]);

  return { permissionLoading, permissionError };
};
